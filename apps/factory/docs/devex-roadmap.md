# Agent Studio Devex Roadmap

This harness should feel like a local Agent Studio, not a thin chat wrapper.
The original roadmap below has been superseded by the unified `ge` pipeline and
the canonical `.ge/` state substrate. The current golden path is:

```bash
ge doctor --local
ge agents build --ids <use-case-id> --local
ge pipeline run --scenario <use-case-id> --ids <use-case-id> --target-stage preview
ge daemon tasks
ge agents sync --ids <use-case-id> --local
```

## P0: Make Workspaces Real

- Add a workspace manifest at `.ge/factory/workspaces/<id>/workspace.json`.
- Persist factory run records under `.ge/factory/runs/` and daemon task events under `.ge/runtime/`.
- Track generated artifacts, manifests, evals, and publish plans per workspace.
- Keep local mock mode as the default. Deployment and Gemini Enterprise publishing
  require explicit approval.

## P1: Make The CLI The Contract

- `ge doctor --local`: verify `bun`, `node`, `uv`, `agents-cli`, Antigravity SDK,
  skills, shared cache, workspace registry, and port availability.
- `ge daemon status|start|stop`: operate the durable local runtime daemon.
- `ge state paths`: show the canonical `.ge/` state layout.
- `ge agents build --ids <id> --local`: create a bounded generated workspace.
- `ge pipeline run --scenario <id> --ids <id> --target-stage preview`: run data,
  simulator, factory, and preview convergence through the typed pipeline graph.
- `ge handoff --ids <workspace-id>`: hand previewed local workspaces to the
  cloud deploy boundary.
- `ge agents sync --ids <id> --local [--remote <git-url>]`: export generated
  workspace code to `generated-agents/` or a dedicated repo.

## P2: Make Generation Contract-Driven

Every generated agent should include:

```json
{
  "agent": {
    "name": "hr-transformation",
    "runtime": "adk-python",
    "entrypoint": "app.agent:root_agent"
  },
  "systems": [],
  "fixtures": [],
  "commands": {
    "install": "uv sync",
    "run": "uv run adk web",
    "eval": "uv run pytest"
  },
  "registration": {
    "agentRegistryReady": false,
    "geminiEnterpriseReady": false
  }
}
```

The daemon should validate this contract before labeling a run complete.

## P3: Make The UI A Workbench

- Workspace rail with status, file count, and latest run.
- Agent/system composer with mock mode versus cloud mode made explicit.
- Structured run timeline with messages, tool calls, tool results, stderr, and
  final stats.
- Artifact browser for generated files, manifests, evals, and publish plans.
- Next-action panel for validate, run locally, eval, deploy plan, publish plan.

## P4: Make Registries Boring

- Local ADK tools are just Python functions or toolsets.
- MCP mocks register as local `McpToolset` during development.
- A2A mocks register as remote agents only when serving A2A.
- Google Cloud Agent Registry is for governed MCP/A2A resources.
- Gemini Enterprise receives deployed ADK agents hosted on Agent Engine.

## Acceptance Bar

- A new user can run one doctor command and know what is missing.
- A generated agent always lands in a workspace, never loose in the repo root.
- The UI can replay a previous run without rerunning the model.
- Local mock agents do not require Google auth.
- Deployment and publishing are planned separately from local generation.
