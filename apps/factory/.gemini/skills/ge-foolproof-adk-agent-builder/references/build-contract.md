# ADK Build Contract

Use this reference before writing files for a generated ADK workspace.

## Required Layout

```text
<workspace>/
├── pyproject.toml
├── README.md
├── agent_manifest.json
├── app/
│   ├── __init__.py
│   ├── agent.py
│   ├── tools.py
│   └── prompts.py
├── fixtures/
│   ├── manifest.json
│   └── *.json
└── tests/
    └── test_agent_smoke.py
```

## pyproject.toml

Use uv-compatible metadata and include ADK dependencies. Keep versions flexible
unless the repo pins them elsewhere.

```toml
[project]
name = "generated-adk-agent"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "google-adk",
  "pydantic>=2",
  "pytest>=8"
]

[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]
```

## app/agent.py

Expose `root_agent`. Use mocked tools only unless the user explicitly approved
real integrations.

```python
from google.adk.agents import Agent
from .tools import lookup_record

root_agent = Agent(
    name="workflow_agent",
    model="gemini-3-flash-preview",
    description="Local ADK agent for the selected workflow.",
    instruction="Use the behavior contract: call canonical source-system tools, cite required evidence, respect escalation/refusal rules, and never invent source data.",
    tools=[lookup_record],
)
```

## Tools

Tools should be deterministic Python functions with typed arguments where useful.
They must:

- read from `fixtures/`;
- return evidence identifiers;
- fail with helpful messages when records are missing;
- avoid network calls by default.
- match the canonical names in `generationSpec.behaviorContract.toolIntents`.
- implement action/notification/evidence lookup intents as deterministic source-system simulators, not generic mock helpers.

## Behavior Contract

Before writing `app/agent.py`, confirm `mock_systems/usecase-spec.json` contains `behaviorContract`.

The agent instruction must include:

- role and primary objective;
- in-scope and out-of-scope workflow boundaries;
- canonical tool playbook;
- evidence requirements;
- escalation/refusal rules;
- response contract for audit trails and citations.

If the behavior contract is missing, stop and patch the upstream TSX `generationSpec.behaviorContract` instead of generating a hello-world agent.

## Fixture Manifest

`fixtures/manifest.json` must list:

- scenario id and title;
- systems mocked;
- tables/documents included;
- evidence ids;
- data freshness timestamp;
- whether any real integration is required.

## README Commands

Include commands like:

```bash
uv sync
uv run pytest
uv run adk web
```

If `agents-cli` is available:

```bash
uvx google-agents-cli eval
uvx google-agents-cli deploy --help
uvx google-agents-cli publish gemini-enterprise --help
```

Help commands are safe. Deploy/publish commands require approval and real cloud
configuration.

## Validation Checklist

Before finishing:

- `pyproject.toml` exists and is uv-compatible.
- `app/agent.py` exports `root_agent`.
- every tool has fixture data.
- README includes run and test commands.
- smoke test or eval prompt proves the success metric.
- golden evals from the behavior contract are written under `evals/golden.json`.
- `agent_manifest.json` states local/deploy/register/publish boundary.
