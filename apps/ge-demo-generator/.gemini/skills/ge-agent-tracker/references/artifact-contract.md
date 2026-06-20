# Artifact Contract

Every agent produces artifacts as it moves through the pipeline. This
document defines what artifacts are expected at each stage, their purpose,
and how to verify them.

## Artifact Database Schema

Artifacts are tracked in the `artifacts` table:

```sql
CREATE TABLE artifacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  version_number INTEGER,       -- ties to a version snapshot (optional)
  path TEXT NOT NULL,            -- relative to workspace root
  kind TEXT,                     -- classification: code, fixture, test, config, manifest
  size INTEGER,                  -- file size in bytes
  run_id TEXT,                   -- CLI run that produced it (optional)
  created_at INTEGER NOT NULL,
  FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE
);
```

## Artifact Kinds

| Kind | Description | Examples |
|------|-------------|----------|
| `config` | Pipeline and schema configuration | `pipeline.json`, `schema.json` |
| `manifest` | Data manifest describing generated fixtures | `manifest.json` |
| `fixture` | Generated mock data files | `tables/*.json`, `tables/*.csv` |
| `code` | Generated or hand-written Python code | `tools.py`, `agent.py`, `__init__.py` |
| `test` | Test files | `test_smoke.py` |
| `project` | Project configuration | `pyproject.toml` |
| `deployment` | Deployment metadata | `deployment_metadata.json` |
| `spec` | API/tool specifications | `toolspec.json` |

## Stage-by-Stage Artifact Checklist

### briefed

| Path | Kind | Required | Notes |
|------|------|----------|-------|
| `mock_systems/pipeline.json` | config | yes | Tracks pipeline state |
| `mock_systems/schema.json` | config | yes | Table definitions (may be empty) |
| `brief.json` | config | no | Structured brief from interviewer skill |

**Verify**:
```bash
ge-mock status --dir <workspace>
# pipeline.json should show init: done
```

### generated

| Path | Kind | Required | Notes |
|------|------|----------|-------|
| `fixtures/manifest.json` | manifest | yes | Lists all tables, row counts, columns |
| `fixtures/tables/<name>.json` | fixture | yes | One per table, JSON array of rows |
| `fixtures/tables/<name>.csv` | fixture | yes | One per table, CSV format |
| `app/tools.py` | code | yes | `FunctionTool` wrappers for each table |
| `app/agent.py` | code | yes | `root_agent` definition |
| `app/__init__.py` | code | yes | Exports `root_agent` |
| `pyproject.toml` | project | yes | `google-adk` dependency |

**Verify**:
```bash
ge-mock status --dir <workspace>
# Check: generate: done, tools: done
# Verify manifest lists all expected tables
cat <workspace>/fixtures/manifest.json | python3 -c "import sys,json; m=json.load(sys.stdin); print(f'{len(m[\"tables\"])} tables, {m[\"totalRows\"]} rows')"
```

### tested

| Path | Kind | Required | Notes |
|------|------|----------|-------|
| `tests/test_smoke.py` | test | yes | Auto-generated smoke tests |

**Verify**:
```bash
cd <workspace> && uv run pytest tests/ -v --tb=short
# All tests should pass (exit code 0)
```

### serving

No new file artifacts. The running ADK web process is the artifact.

**Verify**:
```bash
# Process is running on the expected port
curl -s http://127.0.0.1:8080/ | head -1
```

### deployed

| Path | Kind | Required | Notes |
|------|------|----------|-------|
| `deployment_metadata.json` | deployment | yes (Agent Runtime) | Contains `agent_runtime_id` |

For Cloud Run deploys, the service URL is recorded in `pipeline.json`
rather than a separate file.

**Verify**:
```bash
# Agent Runtime
cat <workspace>/deployment_metadata.json
# Cloud Run
ge-mock status --dir <workspace>
# Check deploy step for serviceUrl
```

### registered

| Path | Kind | Required | Notes |
|------|------|----------|-------|
| `mock_systems/toolspec.json` | spec | MCP only | Auto-generated tool spec |

For ADK and A2A modes, no local file is created. The registry entry is
external.

**Verify**:
```bash
gcloud alpha agent-registry services describe <name> \
  --project=<project> --location=<region>
```

### published

No local file artifacts. The Gemini Enterprise registration is external.

**Verify**:
- Agent appears in the Gemini Enterprise app UI
- `agents-cli publish` reported success

## Manifest Shape

The `fixtures/manifest.json` file is the central artifact contract. It must
contain:

```json
{
  "id": "<agent-name>",
  "generatedAt": "<ISO-8601>",
  "domain": "<department>",
  "seed": 42,
  "tables": [
    {
      "name": "<table-name>",
      "path": "tables/<name>.csv",
      "jsonPath": "tables/<name>.json",
      "primaryKey": "<pk-column>",
      "columns": [
        { "name": "<col>", "type": "string|number|boolean" }
      ],
      "rowCount": 50
    }
  ],
  "documents": [],
  "totalRows": 50
}
```

## Version Snapshots

When a version is created, the `file_snapshot_json` column in the `versions`
table records the list of files at that point. This enables rollback and
comparison between versions.

```sql
SELECT version_number, file_snapshot_json, test_status
FROM versions
WHERE agent_id = '<aid>'
ORDER BY version_number;
```

## Rules

- Never hand-write fixture files. Use `ge-mock generate`.
- Never hand-write `tools.py`. Use `ge-mock tools`.
- Always verify artifacts exist before advancing to the next stage.
- Artifacts accumulate -- later stages do not delete earlier artifacts.
- The `run_id` field connects artifacts to the CLI execution that produced them.
