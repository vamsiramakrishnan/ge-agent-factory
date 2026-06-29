# Stage Definitions

Each agent passes through seven ordered stages. This document defines the
full entry criteria, exit criteria, and semantics for each stage.

## 1. briefed

**Meaning**: The agent has a name, a workspace directory, and an optional
brief describing what it should do. No code or data has been generated yet.

**Entry criteria**:
- Agent record created in DB (`insertAgentDb`)
- Workspace directory initialized (`factory init`)
- `mock_systems/pipeline.json` exists with `init` step marked `done`
- `mock_systems/schema.json` exists (may be empty)

**Exit criteria**:
- Schema has at least one table defined via `factory schema --add-table`
- OR: `factory from-usecase` was used (auto-derives schema)

**Key artifacts**:
- `mock_systems/pipeline.json`
- `mock_systems/schema.json`
- `brief.json` (optional, from interviewer skill)

**CLI command**: `factory init --dir <dir> --name <name> --domain <domain>`

---

## 2. generated

**Meaning**: Fixture data has been produced from the schema and ADK tools
have been generated to query that data. The agent has runnable code.

**Entry criteria**:
- `briefed` stage complete
- `factory generate` succeeded: fixture files exist in `fixtures/tables/`
- `factory tools` succeeded: `app/tools.py`, `app/agent.py`, `app/__init__.py` exist
- `fixtures/manifest.json` exists and lists all tables
- `pyproject.toml` exists with `google-adk` dependency

**Exit criteria**:
- All generated files are syntactically valid
- `uv sync` can resolve dependencies (not required to run, but recommended)

**Key artifacts**:
- `fixtures/manifest.json`
- `fixtures/tables/<table>.json` (one per table)
- `fixtures/tables/<table>.csv` (one per table)
- `app/tools.py` (generated query functions)
- `app/agent.py` (root agent definition)
- `app/__init__.py` (exports root_agent)
- `pyproject.toml`

**CLI commands**:
```bash
factory generate --dir <dir> [--seed N] [--rows N]
factory tools --dir <dir>
```

**Shortcut**: `factory from-usecase` runs init + schema + generate + tools in
one command, landing the agent directly at `generated`.

---

## 3. tested

**Meaning**: Smoke tests have been generated and they pass. The agent's tools
return data and the fixtures are valid.

**Entry criteria**:
- `generated` stage complete
- `factory test` generated `tests/test_smoke.py`
- `uv run pytest tests/ -v` exits with code 0
- Tests cover: manifest existence, table file existence, tool imports, tool
  function execution

**Exit criteria**:
- All tests pass
- Test report is clean (no warnings about missing fixtures)

**Key artifacts**:
- `tests/test_smoke.py`

**CLI command**: `factory test --dir <dir>`

**Failure handling**: If tests fail, the pipeline marks step as `failed`.
Fix the issue (usually missing fixtures or bad schema), regenerate, and
re-run `factory test`.

---

## 4. serving

**Meaning**: The ADK web preview is running locally. The agent can be
interacted with through the browser UI.

**Entry criteria**:
- `tested` stage complete (tools step is the hard requirement in the CLI)
- `factory serve` starts without error
- Agent is accessible at `http://127.0.0.1:<port>`

**Exit criteria**:
- Agent responds to the workflow trigger question
- Agent cites mock evidence in its response
- No hallucinated data (all responses from fixture queries)

**Key artifacts**:
- No new files. The process itself is the artifact.
- Pipeline marks serve as `running` while the process is active.

**CLI command**: `factory serve --dir <dir> [--port 8080]`

**Notes**: This is a transient stage. The serve process blocks the terminal.
Stage is marked `running` while active and `stopped` when the process ends.

---

## 5. deployed

**Meaning**: The agent has been deployed to Google Cloud infrastructure --
either Agent Runtime (for Gemini Enterprise) or Cloud Run (for MCP/A2A).

**Entry criteria**:
- `tested` stage complete (tools step is the hard requirement)
- GCP project is set (`--project` flag, `GOOGLE_CLOUD_PROJECT` env, or gcloud config)
- Region is set (defaults to `us-central1`)
- User has explicitly approved deployment
- `agents-cli scaffold enhance` has been run (for Agent Runtime)

**Exit criteria**:
- For Agent Runtime: `deployment_metadata.json` exists with `agent_runtime_id`
- For Cloud Run: service is deployed, `serviceUrl` is recorded in pipeline

**Key artifacts**:
- `deployment_metadata.json` (Agent Runtime)
- Service URL in `pipeline.json` (Cloud Run)

**CLI command**:
```bash
factory deploy --dir <dir> --project <p> --target agent_runtime
factory deploy --dir <dir> --project <p> --target cloud_run
```

**Deploy target determines registration path**:
- `agent_runtime` -> register as `adk` -> publish to Gemini Enterprise
- `cloud_run` -> register as `mcp` or `a2a` -> available in Agent Registry

---

## 6. registered

**Meaning**: The agent is registered in the Google Cloud Agent Registry,
making it discoverable by other agents and orchestrators.

**Entry criteria**:
- `deployed` stage complete
- Registration mode matches deploy target:
  - `mcp`: requires Cloud Run deploy with `serviceUrl`
  - `a2a`: requires Cloud Run deploy with `serviceUrl`
  - `adk`: requires Agent Runtime deploy with `agent_runtime_id`
- For MCP: tool spec has been auto-generated from manifest

**Exit criteria**:
- Agent Registry entry exists
- `gcloud alpha agent-registry services describe <name>` returns data

**Key artifacts**:
- `mock_systems/toolspec.json` (MCP mode only -- auto-generated)
- Registry entry (external, not a local file)

**CLI command**:
```bash
factory register --dir <dir> --as mcp   # MCP server
factory register --dir <dir> --as a2a   # A2A remote agent
factory register --dir <dir> --as adk   # Ready for Gemini Enterprise
```

---

## 7. published

**Meaning**: The agent is published to Gemini Enterprise and available to
end users through the Gemini Enterprise app.

**Entry criteria**:
- `deployed` stage complete (register step is not strictly required by CLI)
- Gemini Enterprise app ID provided (`--app-id` or `GEMINI_ENTERPRISE_APP_ID`)
- User has explicitly approved publication

**Exit criteria**:
- `agents-cli publish gemini-enterprise` succeeds
- Agent appears in the Gemini Enterprise app

**Key artifacts**:
- No local files. The publication is an external registration.

**CLI command**:
```bash
factory publish --dir <dir> --app-id <gemini-enterprise-app-id>
```

**Notes**: This is the terminal stage. Once published, changes require a
new version cycle: modify code -> re-deploy -> re-publish.
