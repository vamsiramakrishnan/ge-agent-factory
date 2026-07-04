---
type: Agent Tool
title: query_jira_issues
description: Retrieve issues from Jira for the Developer Experience Surveyor workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_jira_issues

Retrieve issues from Jira for the Developer Experience Surveyor workflow.

- **Kind:** query
- **Source system:** [Jira](/systems/jira.md)

## Inputs

- lookup_key
- date_range

## Outputs

- issues_records
- issues_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Jira](/systems/jira.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/developer-experience-surveyor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- issues_records
- issues_summary

# Examples

```
query_jira_issues(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Jira](/systems/jira.md)
