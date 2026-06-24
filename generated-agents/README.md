# Generated agent workspaces

Each subdirectory here is a generated agent workspace exported from the factory.
One folder is written per catalog use-case id (`generated-agents/<use-case-id>/`).
In local mode this is the preview-validated workspace from
`.ge/factory/workspaces/<id>`. In remote mode it is the archived result produced
by the cloud factory.

## How it gets here

### Local workspace sync

1. `ge agents build --ids <id> --local` generates and gates a local workspace in
   `.ge/factory/workspaces/<workspace-id>`.
2. `ge agents sync --ids <id> --local` copies the selected workspace here,
   pruning `.venv`, `node_modules`, caches, run history, and harness scratch.

```bash
ge agents sync --ids account-reconciliation-agent --local
```

To sync to a dedicated generated-agents repository instead of this monorepo,
pass a git remote:

```bash
ge agents sync --ids account-reconciliation-agent --local --remote <git-url> --push
```

The console Fleet bulk action and Agent Detail **Code sync** panel call the same
CLI path with explicit selected ids and optional destination git repo.

### Remote archive sync

1. `ge agents build --all --remote` submits each agent in the use-case catalog
   (`apps/ge-demo-generator/src/use-cases.generated.js`) to the factory gateway.
2. The cloud factory persists each result to
   `gs://<bucket>/runs/<runId>/items/<workspaceId>/agent-result.tar.gz`.
3. `ge agents sync --push` downloads each completed result archive, extracts it
   here, and commits it:

   ```bash
   ge agents sync --push
   ```

Remote sync is resumable (`.generated-agents-sync-state.json`, git-ignored) and
re-extracts an agent whenever its `runId` changes.

## What's in each workspace

The export excludes `.venv`, `node_modules`, caches, local run history, and
harness scratch. You get the agent source (`app/agent.py`, `pyproject.toml`),
generated fixtures and mock data, deployment metadata when present, evals, and
validation artifacts — enough to inspect, diff, or re-deploy any agent from
source.
