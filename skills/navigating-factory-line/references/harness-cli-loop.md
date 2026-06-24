# Harness CLI Loop

The harness may operate the CLI, and the CLI may invoke harness behavior internally. Keep the loop explicit.

## Loop

1. Harness reads current state.
2. Harness chooses the next station and skill.
3. Harness invokes CLI or console API.
4. CLI executes deterministic factory code, starts jobs, or invokes the harness runtime.
5. CLI returns JSON/artifacts/logs.
6. Harness parses the result and chooses the next station.
7. Console/CLI show the user what happened and what can happen next.

## Rules

- Prefer commands with JSON output when available.
- Treat artifacts as the source of truth for gates.
- Do not infer success from a zero exit code if the artifact says blocked.
- Do not resume from UI filters; resume from persisted mission/run state.
- In remote mode, observe cloud factory state unless local workspace repair is explicitly available.

## User Surfaces

- CLI: fast, scriptable, structured output.
- Console: readable operating state and manual invocation.
- MCP: model/tool integration surface.

All three should call shared core behavior.

