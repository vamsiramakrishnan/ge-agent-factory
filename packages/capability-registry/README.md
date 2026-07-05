# @ge/capability-registry

The single source of truth wiring every operator capability into its
surfaces: console route, CLI invocation, MCP tool, risk level, preflight
requirements, and observability shape. One `GE_COMMANDS` entry per capability;
every surface consumes the table, none re-declares it:

| Surface | Consumer |
|---------|----------|
| `ge` CLI help + requirement checks | `tools/ge/help.mjs`, `tools/lib/factory-core.mjs` |
| Console routes + client command list | `apps/console/src/server/ge-api.mjs` via `apps/console/src/shared/ge-commands.mjs` |
| MCP tools (one per `mcp` block) | `tools/mcp-server.mjs` |
| Docs site command cards + generated API reference | `apps/docs/src/lib/ge-commands.mjs`, `tools/gen-console-api-reference.mjs` |

The entry contract (risk levels, requirement keys, observability modes, MCP
param descriptors) is owned by [`@ge/core-api`](../core-api);
`assertCapabilityTable` validates the table against it at import time, so a
malformed entry fails every surface at load instead of drifting on one.

Adding a command? Follow
[`docs/contributing/add-a-ge-command.md`](../../docs/contributing/add-a-ge-command.md) —
one registry entry gives every surface the command at once.

Guards: `src/registry.test.mjs` + `src/surface-parity.test.mjs` here;
`tools/mcp-registry-parity.test.mjs` freezes the MCP tool surface;
`tools/contracts-registry-parity.test.mjs` holds `@ge/contracts` and
`@ge/core-api` vocabularies equal.

Test: `bun test packages/capability-registry/src`.
