# @ge/connector-core

The minimal live-system connector: dial a `rest` binding read-only. This is
the Phase 0 seam of [`docs/plans/real-system-twins/`](../../docs/plans/real-system-twins/phase-0-binding-dispatch.md)
— the profile/record/compare commands (Phase 2) and `ge systems doctor
--dial` all dial through it, so the safety rules live in one place.

## The three rules

1. **Read-only is structural.** `call()` checks the HTTP method class
   against the frozen `READ_METHODS` allowlist (`GET`/`HEAD`). Refusing
   writes is not a flag a caller can forget to pass — a `POST` never
   reaches the transport.
2. **Secrets by reference.** Auth is an `env:VAR` reference resolved at
   call time. The token value is never stored on the connector, never
   echoed in an error, never serialized. A configured-but-unresolvable
   reference fails loudly *before* dialing, so a missing var can't
   masquerade as an unauthenticated live-system bug.
3. **Injectable transport.** `fetchImpl` defaults to global fetch and is
   injected in tests; nothing in this package needs a network to be tested.

## Surface

```js
import { createRestConnector, probeRestBinding } from "@ge/connector-core";

const connector = createRestConnector({
  baseUrl: "https://crm.internal.example.com",
  authRef: "env:CRM_TOKEN",   // or "none"
  timeoutMs: 10_000,
});
await connector.call({ path: "/cases", query: { status: "open" } }); // GET only
await connector.probe(); // HEAD (GET fallback on 405/501) — never throws

// One stored ge.system-binding.v1 -> a reachability report (doctor --dial core):
await probeRestBinding(binding); // auth from binding.config.authEnv, by name
```

Deliberately small: no `mcp`-kind dialing, no OAuth/mTLS, no scaffolding —
the full connector SDK grows from this interface only as consumers appear
([`parallel-and-deferred.md`](../../docs/plans/real-system-twins/parallel-and-deferred.md)).
Dependency-free leaf; consumed by `tools/lib/systems-dial.mjs`.
