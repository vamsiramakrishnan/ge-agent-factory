import { describe, expect, test } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DENY_HEADERS,
  MASKED,
  REDACTION_POLICY_SCHEMA_VERSION,
  buildRedactionReport,
  hashRedactionPolicy,
  redactExchange,
  validateRedactionPolicy,
} from "./index.mjs";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const RAW = JSON.parse(readFileSync(join(FIXTURES, "exchange-raw.json"), "utf8"));

const POLICY = {
  schemaVersion: REDACTION_POLICY_SCHEMA_VERSION,
  headers: { mask: ["x-request-id"] },
  hashing: { keyRef: "env:TEST_REDACTION_HASH_KEY" },
  fields: [
    { path: "response.body.internal.api_key", action: "drop" },
    { path: "response.body.customers.*.customer_id", action: "hash" },
    { path: "response.body.customers.*.name", action: "mask" },
  ],
};
const HASH_ENV = { TEST_REDACTION_HASH_KEY: "golden-test-key-not-an-artifact" };

// The golden: redaction behavior changes MUST show up as a diff of this
// fixture. Regenerate ONLY after verifying the new output leaks nothing:
//   GE_REGEN_REDACTION_GOLDEN=1 bun test packages/redaction
const GOLDEN_PATH = join(FIXTURES, "exchange-redacted.golden.json");

test("golden: raw exchange + policy → byte-stable redacted output", () => {
  const { exchange, report } = redactExchange(RAW, POLICY, { env: HASH_ENV });
  const actual = `${JSON.stringify({ exchange, report }, null, 2)}\n`;
  if (process.env.GE_REGEN_REDACTION_GOLDEN === "1") writeFileSync(GOLDEN_PATH, actual);
  expect(actual).toBe(readFileSync(GOLDEN_PATH, "utf8"));
});

describe("the safety rules, asserted directly", () => {
  const { exchange, report } = redactExchange(RAW, POLICY, { env: HASH_ENV });
  const text = JSON.stringify(exchange);

  test("credential headers are masked with NO policy at all (default-deny)", () => {
    const bare = redactExchange(RAW); // no policy
    const t = JSON.stringify(bare.exchange);
    expect(t).not.toContain("sk-live-VERY-SECRET-TOKEN-12345");
    expect(t).not.toContain("session=abc123");
    expect(t).not.toContain("key-9999");
    expect(t).not.toContain("session=def456");
    expect(DENY_HEADERS.length).toBeGreaterThan(0);
  });

  test("no secret or PII value survives anywhere in the redacted exchange", () => {
    for (const leaked of [
      "sk-live-VERY-SECRET-TOKEN-12345",
      "session=abc123",
      "jane.doe@example.com",
      "ops@corp.example.com",
      "123-45-6789",
      "4111 1111 1111 1111",
      "+1 (415) 555-0142",
      "inline-secret",
      "Jane Doe",
    ]) {
      expect(text).not.toContain(leaked);
    }
  });

  test("non-sensitive data survives untouched — redaction is surgical", () => {
    const customer = exchange.response.body.customers[0];
    expect(customer.notes).toBe("prefers email contact");
    expect(customer.balance).toBe(1250.5);
    expect(customer.order_ref).toBe("1234 5678 9012 34"); // 14 digits but fails Luhn — not a card
    expect(exchange.response.body.internal.shard).toBe("us-west-2");
    expect(exchange.request.headers.Accept).toBe("application/json");
  });

  test("hash action stays correlatable without being readable", () => {
    expect(exchange.response.body.customers[0].customer_id).toMatch(/^hmac-sha256:[0-9a-f]{64}$/);
    const same = redactExchange(RAW, POLICY, { env: HASH_ENV });
    expect(same.exchange.response.body.customers[0].customer_id).toBe(exchange.response.body.customers[0].customer_id);
    const differentKey = redactExchange(RAW, POLICY, { env: { TEST_REDACTION_HASH_KEY: "different-key" } });
    expect(differentKey.exchange.response.body.customers[0].customer_id).not.toBe(exchange.response.body.customers[0].customer_id);
  });

  test("a hash rule without its referenced secret fails safe to masking", () => {
    const missing = redactExchange(RAW, POLICY);
    expect(missing.exchange.response.body.customers[0].customer_id).toBe(MASKED);
    expect(missing.report).toContainEqual({
      path: "response.body.customers.0.customer_id",
      rule: "field:response.body.customers.*.customer_id:hash-key-unavailable",
      action: "mask",
    });
  });

  test("drop removes the field entirely", () => {
    expect("api_key" in exchange.response.body.internal).toBe(false);
  });

  test("every redaction is reported with its rule", () => {
    const rules = new Set(report.map((r) => r.rule));
    expect(rules).toContain("header:default-deny");
    expect(rules).toContain("header:policy");
    expect(rules).toContain("detector:email");
    expect(rules).toContain("detector:ssn");
    expect(rules).toContain("detector:card");
    expect(rules).toContain("detector:phone");
    expect(rules).toContain("field:response.body.internal.api_key");
    const summary = buildRedactionReport({ system: "crm", entries: report });
    expect(summary.totalRedactions).toBe(report.length);
    expect(summary.byRule["header:default-deny"]).toBeGreaterThanOrEqual(4);
  });

  test("the URL query string is scrubbed too", () => {
    expect(exchange.request.url).not.toContain("jane.doe@example.com");
  });

  test("query objects, sensitive keys, encoded PII, and response URLs fail closed", () => {
    const raw = {
      request: {
        url: "https://example.test/users/ada%2540example.com/123-45-6789?accessToken=plain-secret&sig=signed-secret&code=oauth-code&lookup=ada%252Edev%2540example%252Ecom#access_token=fragment-secret",
        path: "/search?token=path-secret",
        query: {
          password: "hunter2",
          customerEmail: "alias-without-an-at-sign",
          nested: { apiKey: "key-value", safe: "region-west" },
        },
      },
      response: {
        headers: { Location: "/users/bob@example.com/123-45-6789?password=location-secret&signature=redirect-signature" },
        redirectUrl: "https://example.test/next?token=server-secret",
        error: "retry https://example.test/debug?password=also-secret",
      },
    };
    const result = redactExchange(raw);
    const serialized = JSON.stringify(result.exchange);
    for (const secret of [
      "plain-secret",
      "fragment-secret",
      "signed-secret",
      "oauth-code",
      "path-secret",
      "location-secret",
      "redirect-signature",
      "ada%2540example.com",
      "bob@example.com",
      "123-45-6789",
      "ada%252Edev",
      "hunter2",
      "alias-without",
      "key-value",
      "server-secret",
      "also-secret",
    ]) {
      expect(serialized).not.toContain(secret);
    }
    expect(result.exchange.request.query.nested.safe).toBe("region-west");
    expect(result.report.map((entry) => entry.rule)).toContain("query-key:default-deny");
    expect(result.report).toContainEqual({
      path: "request.url.fragment.access_token",
      rule: "query-key:default-deny",
      action: "mask",
    });
  });
});

describe("policy validation", () => {
  test("rejects wrong schemaVersion, bad rules, bad header config", () => {
    expect(validateRedactionPolicy({ schemaVersion: "v0" }).length).toBeGreaterThan(0);
    expect(validateRedactionPolicy({ schemaVersion: REDACTION_POLICY_SCHEMA_VERSION, fields: [{ path: "", action: "mask" }] }).length).toBe(1);
    expect(validateRedactionPolicy({ schemaVersion: REDACTION_POLICY_SCHEMA_VERSION, fields: [{ path: "a", action: "obliterate" }] }).length).toBe(1);
    expect(validateRedactionPolicy({ schemaVersion: REDACTION_POLICY_SCHEMA_VERSION, headers: { mask: [1] } }).length).toBe(1);
    expect(validateRedactionPolicy({ schemaVersion: REDACTION_POLICY_SCHEMA_VERSION, hashing: { keyRef: "literal-secret" } }).length).toBe(1);
    expect(validateRedactionPolicy(POLICY)).toEqual([]);
    expect(hashRedactionPolicy(POLICY)).toBe(
      hashRedactionPolicy({ ...POLICY, fields: [...POLICY.fields], headers: { ...POLICY.headers } }),
    );
  });

  test("redactExchange throws on an invalid policy — never silently under-redacts", () => {
    expect(() => redactExchange(RAW, { schemaVersion: "nope" })).toThrow("invalid redaction policy");
  });

  test("determinism: same input + policy → byte-identical output", () => {
    const a = JSON.stringify(redactExchange(RAW, POLICY, { env: HASH_ENV }));
    const b = JSON.stringify(redactExchange(RAW, POLICY, { env: HASH_ENV }));
    expect(a).toBe(b);
  });

  test(`masked marker is the stable literal ${MASKED}`, () => {
    expect(MASKED).toBe("[REDACTED]");
  });
});
