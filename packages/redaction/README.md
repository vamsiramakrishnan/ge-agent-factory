# @ge/redaction

The redaction module every live-system capture passes through **before any
byte reaches disk** — the safety-critical centerpiece of
[Phase 2 of the real-system twins plan](../../docs/plans/real-system-twins/phase-2-system-profile.md).
`ge systems profile`, `ge systems record`, and every trace-import adapter
call `redactExchange` on each request/response pair; nothing they persist
may bypass it.

## The four rules

1. **Headers are default-deny for credentials.** `authorization`, `cookie`,
   `set-cookie`, `x-api-key` and friends are masked with no policy at all.
   A policy can add masked headers; it can never unmask the built-ins.
2. **Queries and bodies fail closed.** Sensitive query keys are masked in
   both URL parameters and query objects, including percent-encoded PII.
   Field-path rules
   (`mask` / `drop` / `hash`) from a `ge.redaction-policy.v1`, and built-in
   PII detectors (email, phone, SSN, Luhn-checked card numbers) that are
   always on and can only be widened by future policy versions.
3. **Every redaction is reported.** The `ge.redaction-report.v1` says what
   was removed and by which rule — the reviewable evidence a capture was
   clean.
4. **Pure and deterministic.** No IO; same input + policy + referenced hash
   key → byte-identical output. Behavior changes must show up as a diff of the
   golden fixture (`src/fixtures/exchange-redacted.golden.json`) —
   regenerate only after verifying nothing leaks:
   `GE_REGEN_REDACTION_GOLDEN=1 bun test packages/redaction`.

## Surface

```js
import { redactExchange, buildRedactionReport, validateRedactionPolicy } from "@ge/redaction";

const { exchange, report } = redactExchange({ request, response }, policy, { env });
const artifact = buildRedactionReport({ system: "crm", entries: report });
```

The `hash` action uses keyed HMAC-SHA-256 so equal values stay correlatable
without enabling offline guessing. Configure only a secret reference in the
policy, for example `"hashing": { "keyRef": "env:GE_REDACTION_HASH_KEY" }`;
the key value is resolved from the supplied `env` object and never enters an
artifact. If the reference or key is unavailable, a hash rule masks the value
instead of emitting an unsafe unkeyed fingerprint.
