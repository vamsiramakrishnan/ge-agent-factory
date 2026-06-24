# generated-agent-runtime

Shared Python helpers for generated GE agents.

The package is intentionally importable without `google-adk`. Helpers that need ADK,
such as MCP registry resolution or wrapping fixture functions as `FunctionTool`,
import ADK lazily inside the specific function.

## Solves

- Shared workflow-state, write-tool guard, and evidence-capture callbacks.
- Deterministic action and audit IDs plus JSONL action-event appends.
- Fixture JSON/CSV/document helpers for generated evidence tools.
- `GE_DATA_BACKEND` selection between local fixtures and Agent Registry MCP toolsets.

No generated agents are changed by this slice. Migration can happen after this package
boundary is reviewed and published inside the repo.
