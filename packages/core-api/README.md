# @ge/core-api

The capability kernel. The product invariant it encodes: **every operator
capability is one typed core operation; the CLI, console, MCP server, and
cloud worker are transports/renderers over it.** This package owns the pieces
of that contract every surface must agree on, and nothing surface-specific:

- **Vocabularies** — `RISK_LEVELS`, `OBSERVABILITY_MODES`, `REQUIREMENT_KEYS`,
  `MCP_PARAM_TYPES`: the closed sets capability entries draw from.
- **`capabilityMeta(command)`** — the client-facing projection of a capability
  entry (id, route, cli, label, summary, risk, duration, requirements,
  observability) that the console command list and generated API reference
  consume.
- **`validateCapability(command)` / `assertCapabilityTable(table)`** — the
  structural validator [`@ge/capability-registry`](../capability-registry)
  runs over its table at import time, so a malformed entry fails every
  surface at load instead of drifting on whichever surface didn't read the
  broken field.

Dependency-free leaf: no `apps/*`, `tools/*`, or third-party imports (the
table it validates is bundled into browser clients). `@ge/contracts` carries
the zod twin of the risk vocabulary for typed front-ends;
`tools/contracts-registry-parity.test.mjs` holds the two equal.

Test: `bun test packages/core-api/src`.
