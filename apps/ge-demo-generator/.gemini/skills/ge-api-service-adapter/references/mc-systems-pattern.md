# mc-systems Pattern

Use this reference only when matching the existing `/mc-systems` architecture.

## Pattern

Each system has:

- `src/api.ts`: Express REST API.
- `src/mcp.ts`: MCP SSE server that mounts the API and exposes typed tools.
- `src/db.ts`: deterministic local data store.
- `src/rules.ts`: business rules for non-trivial validation.
- `openapi.yaml`: REST contract.
- `scripts/seed.js`: deterministic seed.
- `package.json`: `build` and `start` scripts.

## Adapter Standard

Generated GE adapters should preserve the same operational shape:

- Express app for local and Cloud Run.
- `/healthz` endpoint.
- MCP SSE endpoint at `/sse`.
- MCP message endpoint at `/messages`.
- Typed input schemas for each tool.
- Safe retries for write operations through `idempotencyKey`.
- Deterministic fixture responses for local mode.

## What Not To Do

- Do not collapse APIs into generic SQL tables.
- Do not hide API contracts inside README prose.
- Do not create live network dependencies in local-first generation.
- Do not deploy service adapters by default.
