# CLI Harness Loop

The harness can operate the CLI, and the CLI can invoke harness runtimes. Keep the layers clean:

```text
outer harness -> CLI command -> factory core/stage -> optional inner harness task -> JSON/artifacts -> outer harness next decision
```

## Rules

- Do not bypass CLI/core for stage behavior.
- Do not parse prose when JSON or artifacts exist.
- Treat `--continue true` as a resumability decision.
- Stop at the local build boundary unless mission/handoff says to continue.
- After generation/refine, use `checking-workspaces`.

## Good Output

A good CLI-driven step returns:

- command run
- target stage
- totals
- artifact path
- ok/failed state
- next station

