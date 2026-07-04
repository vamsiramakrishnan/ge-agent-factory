---
type: Agent Tool
title: action_google_dataplex_log_entry
description: Execute the log entry step in Google Dataplex after the agent has gathered evidence and validated escalation gates.
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

# action_google_dataplex_log_entry

Execute the log entry step in Google Dataplex after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Dataplex](/systems/google-dataplex.md)
- **API:** POST /api/google_dataplex/log_entry

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Dataplex state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_dataplex_log_entry](/policies/confirmation-action-google-dataplex-log-entry.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Dataplex](/systems/google-dataplex.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [auto_cataloging](/workflow/auto-cataloging.md)
- [pii_classification_governance](/workflow/pii-classification-governance.md)

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_google_dataplex_log_entry(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Dataplex](/systems/google-dataplex.md)
- [Confirmation policy — action_google_dataplex_log_entry](/policies/confirmation-action-google-dataplex-log-entry.md)
- [Idempotency policy — action_google_dataplex_log_entry](/policies/idempotency-action-google-dataplex-log-entry.md)
