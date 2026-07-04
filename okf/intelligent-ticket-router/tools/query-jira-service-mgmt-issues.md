---
type: Agent Tool
title: query_jira_service_mgmt_issues
description: Retrieve issues from Jira Service Mgmt for the Intelligent Ticket Router workflow.
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

# query_jira_service_mgmt_issues

Retrieve issues from Jira Service Mgmt for the Intelligent Ticket Router workflow.

- **Kind:** query
- **Source system:** [Jira Service Mgmt](/systems/jira-service-mgmt.md)

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

No explicit permission scopes declared; source-system access is tied to [Jira Service Mgmt](/systems/jira-service-mgmt.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_channel_intake](/workflow/multi-channel-intake.md)

## Evals

- [Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intelligent-ticket-router-end-to-end.md)

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
query_jira_service_mgmt_issues(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Jira Service Mgmt](/systems/jira-service-mgmt.md)
