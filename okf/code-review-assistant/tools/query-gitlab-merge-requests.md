---
type: Agent Tool
title: query_gitlab_merge_requests
description: Retrieve merge requests from GitLab for the Code Review Assistant workflow.
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

# query_gitlab_merge_requests

Retrieve merge requests from GitLab for the Code Review Assistant workflow.

- **Kind:** query
- **Source system:** [GitLab](/systems/gitlab.md)

## Inputs

- lookup_key
- date_range

## Outputs

- merge_requests_records
- merge_requests_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GitLab](/systems/gitlab.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/code-review-assistant-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- merge_requests_records
- merge_requests_summary

# Examples

```
query_gitlab_merge_requests(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GitLab](/systems/gitlab.md)
