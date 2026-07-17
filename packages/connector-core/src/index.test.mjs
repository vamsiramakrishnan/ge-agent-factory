import { describe, expect, test } from "bun:test";
import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
import {
  MAX_RESPONSE_BYTES_HARD_CAP,
  READ_METHODS,
  createRestConnector,
  isPublicAddress,
  probeRestBinding,
  resolveAuthRef,
  validateRestTarget,
} from "./index.mjs";

const publicResolver = async () => [{ address: "93.184.216.34", family: 4 }];

// A fetch stub that records every request it sees and replies from a script.
function stubFetch(replies = [{ status: 200, body: { ok: true } }]) {
  const calls = [];
  let i = 0;
  const impl = async (url, init) => {
    calls.push({ url, ...init });
    const reply = replies[Math.min(i++, replies.length - 1)];
    return new Response(reply.body === undefined ? null : JSON.stringify(reply.body), {
      status: reply.status,
      headers: { "content-type": "application/json" },
    });
  };
  return { impl, calls };
}

describe("resolveAuthRef", () => {
  test("none/empty resolves to null; env:VAR resolves from the injected env", () => {
    expect(resolveAuthRef("none")).toBeNull();
    expect(resolveAuthRef(undefined)).toBeNull();
    expect(resolveAuthRef("env:CRM_TOKEN", { CRM_TOKEN: "s3cret" })).toBe("s3cret");
  });

  test("malformed references and unset vars fail loudly before any dial", () => {
    expect(() => resolveAuthRef("token:abc")).toThrow("unsupported auth reference");
    expect(() => resolveAuthRef("env:MISSING_VAR", {})).toThrow("MISSING_VAR is not set");
  });
});

describe("createRestConnector — read-only structurally", () => {
  test("refuses every write-class method, whatever the caller passes", async () => {
    const { impl, calls } = stubFetch();
    const connector = createRestConnector({ baseUrl: "https://crm.example.com", fetchImpl: impl, resolveHost: publicResolver });
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "post", "Put"]) {
      await expect(connector.call({ method, path: "/cases" })).rejects.toThrow("read-only");
    }
    expect(calls).toHaveLength(0); // refused before the transport, not after
    expect([...READ_METHODS]).toEqual(["GET", "HEAD"]);
  });

  test("GET with query + bearer auth from env ref; token never lands in errors", async () => {
    const { impl, calls } = stubFetch([{ status: 500, body: { boom: true } }]);
    const connector = createRestConnector({
      baseUrl: "https://crm.example.com/",
      authRef: "env:CRM_TOKEN",
      env: { CRM_TOKEN: "s3cret-token-value" },
      fetchImpl: impl,
      resolveHost: publicResolver,
    });
    const result = await connector.call({ path: "cases", query: { status: "open", limit: 5 } });
    expect(calls[0].url).toBe("https://crm.example.com/cases?status=open&limit=5");
    expect(calls[0].headers.authorization).toBe("Bearer s3cret-token-value");
    expect(result).toMatchObject({ ok: false, status: 500, body: { boom: true } });

    // Failure paths must not echo the secret.
    const failing = createRestConnector({
      baseUrl: "https://crm.example.com",
      authRef: "env:CRM_TOKEN",
      env: { CRM_TOKEN: "s3cret-token-value" },
      fetchImpl: async () => {
        throw new Error("connect ECONNREFUSED https://crm.example.com/?token=s3cret-token-value");
      },
      resolveHost: publicResolver,
    });
    const error = await failing.call({ path: "/cases" }).catch((e) => e);
    expect(String(error.message)).not.toContain("s3cret-token-value");
    expect(JSON.stringify(error)).not.toContain("s3cret-token-value");
  });

  test("construction validates baseUrl and the auth reference shape eagerly", () => {
    expect(() => createRestConnector({ baseUrl: "ftp://nope" })).toThrow("requires HTTPS");
    expect(() => createRestConnector({ baseUrl: "https://ok.example.com", authRef: "vault:xyz" })).toThrow("unsupported auth reference");
  });

  test("non-JSON bodies are wrapped, not thrown", async () => {
    const impl = async () => new Response("<html>hi</html>", { status: 200 });
    const connector = createRestConnector({ baseUrl: "https://crm.example.com", fetchImpl: impl, resolveHost: publicResolver });
    const result = await connector.call({ path: "/" });
    expect(result.body).toEqual({ raw: "<html>hi</html>" });
  });
});

describe("probe / probeRestBinding", () => {
  test("probe HEADs first, falls back to GET on 405, classifies auth failures", async () => {
    const { impl, calls } = stubFetch([{ status: 405 }, { status: 401, body: {} }]);
    const connector = createRestConnector({ baseUrl: "https://crm.example.com", fetchImpl: impl, resolveHost: publicResolver });
    const report = await connector.probe();
    expect(calls.map((c) => c.method)).toEqual(["HEAD", "GET"]);
    expect(report).toMatchObject({ reachable: true, authorized: false, status: 401 });
  });

  test("probe also falls back to GET on 501 (python http.server-style HEAD)", async () => {
    const { impl, calls } = stubFetch([{ status: 501 }, { status: 200, body: {} }]);
    const connector = createRestConnector({ baseUrl: "https://crm.example.com", fetchImpl: impl, resolveHost: publicResolver });
    const report = await connector.probe();
    expect(calls.map((c) => c.method)).toEqual(["HEAD", "GET"]);
    expect(report).toMatchObject({ reachable: true, authorized: true, status: 200 });
  });

  test("probe never throws — unreachable becomes a report", async () => {
    const connector = createRestConnector({
      baseUrl: "https://down.example.com",
      fetchImpl: async () => {
        throw new Error("getaddrinfo ENOTFOUND");
      },
      resolveHost: publicResolver,
    });
    const report = await connector.probe();
    expect(report.reachable).toBe(false);
    expect(report.detail).toBe("live request failed");
  });

  test("probeRestBinding: rest bindings dial with config.authEnv; other kinds report undialable", async () => {
    const { impl, calls } = stubFetch([{ status: 200, body: {} }]);
    const binding = {
      system: "crm",
      boundTo: "https://crm.example.com",
      kind: "rest",
      mode: "live_first",
      config: { authEnv: "CRM_TOKEN" },
    };
    const report = await probeRestBinding(binding, { env: { CRM_TOKEN: "tok" }, fetchImpl: impl, resolveHost: publicResolver });
    expect(report).toMatchObject({ system: "crm", dialable: true, reachable: true, authorized: true });
    expect(calls[0].headers.authorization).toBe("Bearer tok");

    expect(await probeRestBinding({ system: "erp", kind: "twin", boundTo: "erp-twin" })).toEqual({
      system: "erp",
      dialable: false,
      kind: "twin",
    });
  });

  test("probeRestBinding surfaces an unset auth var as an unreachable report, not a crash", async () => {
    const binding = { system: "crm", boundTo: "https://crm.example.com", kind: "rest", mode: "live_first", config: { authEnv: "NOT_SET" } };
    const report = await probeRestBinding(binding, { env: {}, resolveHost: publicResolver });
    expect(report.dialable).toBe(true);
    expect(report.reachable).toBe(false);
    expect(report.detail).toContain("NOT_SET");
  });
});

describe("target and URL policy", () => {
  test("HTTPS is the default; userinfo and private/metadata targets are rejected", async () => {
    expect(() => validateRestTarget("http://api.example.com")).toThrow("requires HTTPS");
    expect(() => validateRestTarget("https://user:pass@api.example.com")).toThrow("user information");
    expect(() => validateRestTarget("https://127.0.0.1")).toThrow("outside the public network");
    expect(() => validateRestTarget("https://169.254.169.254/latest/meta-data")).toThrow("outside the public network");
    expect(() => validateRestTarget("https://metadata.google.internal/computeMetadata/v1")).toThrow("outside the public network");

    const connector = createRestConnector({
      baseUrl: "https://api.example.com",
      fetchImpl: async () => new Response("{}"),
      resolveHost: async () => [{ address: "10.0.0.4", family: 4 }],
    });
    await expect(connector.call()).rejects.toMatchObject({ code: "private_target" });
  });

  test("private and insecure targets require explicit policy opt-ins", async () => {
    const { impl, calls } = stubFetch();
    const connector = createRestConnector({
      baseUrl: "http://127.0.0.1:8080/api",
      allowInsecureHttp: true,
      allowPrivateNetwork: true,
      fetchImpl: impl,
    });
    await connector.call({ path: "cases" });
    expect(calls[0].url).toBe("http://127.0.0.1:8080/api/cases");
  });

  test("public-address classifier blocks private, link-local, loopback, and documentation ranges", () => {
    for (const address of ["10.0.0.1", "127.0.0.1", "169.254.169.254", "192.168.1.1", "::1", "fd00::1", "fe80::1", "2001:db8::1"]) {
      expect(isPublicAddress(address)).toBe(false);
    }
    expect(isPublicAddress("8.8.8.8")).toBe(true);
    expect(isPublicAddress("2606:4700:4700::1111")).toBe(true);
  });

  test("pins the validated DNS answer while preserving Host, HTTPS SNI, and certificate checks", async () => {
    let resolverCalls = 0;
    const resolveHost = async () => {
      resolverCalls += 1;
      return resolverCalls === 1
        ? [{ address: "93.184.216.34", family: 4 }]
        : [{ address: "169.254.169.254", family: 4 }];
    };
    const requests = [];
    const requestImpl = (options, onResponse) => {
      const outgoing = new EventEmitter();
      outgoing.end = () => {
        const lookups = [];
        const record = (error, address, family) => {
          if (error) return outgoing.emit("error", error);
          lookups.push({ address, family });
          if (lookups.length < 2) return;
          requests.push({ options, lookups });
          const incoming = Readable.from([Buffer.from("{}")]);
          incoming.statusCode = 200;
          incoming.headers = { "content-type": "application/json" };
          onResponse(incoming);
        };
        // Even if the underlying HTTP stack asks twice, this hook is closed
        // over the validated address and cannot consult DNS again.
        options.lookup(options.hostname, {}, record);
        options.lookup(options.hostname, {}, record);
      };
      return outgoing;
    };
    const connector = createRestConnector({
      baseUrl: "https://crm.example.com/api",
      resolveHost,
      requestImpl,
    });

    expect(await connector.call({ path: "cases" })).toMatchObject({ ok: true, status: 200 });
    expect(resolverCalls).toBe(1);
    expect(requests[0].lookups).toEqual([
      { address: "93.184.216.34", family: 4 },
      { address: "93.184.216.34", family: 4 },
    ]);
    expect(requests[0].options).toMatchObject({
      hostname: "crm.example.com",
      servername: "crm.example.com",
      rejectUnauthorized: true,
      headers: { host: "crm.example.com" },
    });
  });

  test("response limits cannot exceed the fixed hard cap", () => {
    expect(() => createRestConnector({
      baseUrl: "https://api.example.com",
      maxResponseBytes: MAX_RESPONSE_BYTES_HARD_CAP + 1,
    })).toThrow(`between 1 and ${MAX_RESPONSE_BYTES_HARD_CAP}`);
  });

  test("canonical request paths cannot escape a configured base path", async () => {
    const { impl, calls } = stubFetch();
    const connector = createRestConnector({
      baseUrl: "https://api.example.com/v1",
      fetchImpl: impl,
      resolveHost: publicResolver,
    });
    for (const path of ["../admin", "%2e%2e/admin", "%252e%252e/admin", "safe/%2fadmin", "safe\\admin"]) {
      await expect(connector.call({ path })).rejects.toMatchObject({ code: expect.stringMatching(/path/) });
    }
    expect(calls).toHaveLength(0);
    await connector.call({ path: "cases" });
    expect(calls[0].url).toBe("https://api.example.com/v1/cases");
  });

  test("redirects are manual, same-origin, and confined to the configured base path", async () => {
    const seen = [];
    const connector = createRestConnector({
      baseUrl: "https://api.example.com/v1",
      resolveHost: publicResolver,
      fetchImpl: async (url, init) => {
        seen.push({ url, init });
        return new Response(null, { status: 302, headers: { location: "https://evil.example.net/steal" } });
      },
    });
    await expect(connector.call({ path: "cases" })).rejects.toMatchObject({ code: "unsafe_redirect" });
    expect(seen[0].init.redirect).toBe("manual");
    expect(seen[0].init.headers.authorization).toBeUndefined();

    const escaping = createRestConnector({
      baseUrl: "https://api.example.com/v1",
      resolveHost: publicResolver,
      fetchImpl: async () => new Response(null, { status: 302, headers: { location: "/admin" } }),
    });
    await expect(escaping.call({ path: "cases" })).rejects.toMatchObject({ code: "path_escape" });
  });

  test("cancels a redirect response body before following it", async () => {
    let cancelled = false;
    let calls = 0;
    const connector = createRestConnector({
      baseUrl: "https://api.example.com/v1",
      resolveHost: publicResolver,
      fetchImpl: async () => {
        calls += 1;
        if (calls > 1) return new Response("{}", { status: 200 });
        const body = new ReadableStream({
          cancel() {
            cancelled = true;
          },
        });
        return new Response(body, { status: 302, headers: { location: "/v1/next" } });
      },
    });

    expect(await connector.call({ path: "cases" })).toMatchObject({ ok: true, status: 200 });
    expect(cancelled).toBe(true);
    expect(calls).toBe(2);
  });

  test("bounded streaming reads stop oversized responses and sanitize transport errors", async () => {
    const oversized = createRestConnector({
      baseUrl: "https://api.example.com",
      maxResponseBytes: 8,
      resolveHost: publicResolver,
      fetchImpl: async () => new Response("0123456789"),
    });
    await expect(oversized.call()).rejects.toMatchObject({ code: "response_too_large" });

    const failing = createRestConnector({
      baseUrl: "https://api.example.com",
      resolveHost: publicResolver,
      fetchImpl: async () => {
        throw new Error("dial https://api.example.com/?secret=credential failed");
      },
    });
    const error = await failing.call({ path: "cases", query: { secret: "credential" } }).catch((caught) => caught);
    expect(error.code).toBe("network_error");
    expect(error.message).toBe("live request failed");
    expect(error.message).not.toContain("credential");
  });

  test("caller cannot inject credential-bearing transport headers", async () => {
    const connector = createRestConnector({
      baseUrl: "https://api.example.com",
      fetchImpl: async () => new Response("{}"),
      resolveHost: publicResolver,
    });
    for (const name of ["authorization", "cookie", "host", "proxy-authorization"]) {
      await expect(connector.call({ headers: { [name]: "secret" } })).rejects.toMatchObject({ code: "unsafe_header" });
    }
  });
});
