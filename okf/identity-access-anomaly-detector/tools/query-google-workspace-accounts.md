---
type: Agent Tool
title: query_google_workspace_accounts
description: "Retrieve accounts from Google Workspace for the Identity & Access Anomaly Detector workflow."
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

# query_google_workspace_accounts

Retrieve accounts from Google Workspace for the Identity & Access Anomaly Detector workflow.

- **Kind:** query
- **Source system:** [Google Workspace](/systems/google-workspace.md)

## Inputs

- lookup_key
- date_range

## Outputs

- accounts_records
- accounts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Workspace](/systems/google-workspace.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [identity_event_collection](/workflow/identity-event-collection.md)

## Evals

- [Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/identity-access-anomaly-detector-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- accounts_records
- accounts_summary

# Examples

```
query_google_workspace_accounts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Workspace](/systems/google-workspace.md)
