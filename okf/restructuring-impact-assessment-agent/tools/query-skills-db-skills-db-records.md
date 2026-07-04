---
type: Agent Tool
title: query_skills_db_skills_db_records
description: Retrieve skills db records from Skills DB for the Restructuring Impact Assessment Agent workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_skills_db_skills_db_records

Retrieve skills db records from Skills DB for the Restructuring Impact Assessment Agent workflow.

- **Kind:** query
- **Source system:** [Skills DB](/systems/skills-db.md)

## Inputs

- lookup_key
- date_range

## Outputs

- skills_db_records_records
- skills_db_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Skills DB](/systems/skills-db.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [scenario_role_mapping](/workflow/scenario-role-mapping.md)

## Evals

- [Run the Restructuring Impact Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/restructuring-impact-assessment-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- skills_db_records_records
- skills_db_records_summary

# Examples

```
query_skills_db_skills_db_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Skills DB](/systems/skills-db.md)
