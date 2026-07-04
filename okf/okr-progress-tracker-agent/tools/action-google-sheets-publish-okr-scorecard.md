---
type: Agent Tool
title: action_google_sheets_publish_okr_scorecard
description: "Publish the refreshed OKR scorecard back to the team's tracking sheet with per-key-result status, blockers, and cited evidence so managers see the same view as the agent."
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

# action_google_sheets_publish_okr_scorecard

Publish the refreshed OKR scorecard back to the team's tracking sheet with per-key-result status, blockers, and cited evidence so managers see the same view as the agent.

- **Kind:** action
- **Source system:** [Google Sheets](/systems/google-sheets.md)
- **API:** POST /v4/spreadsheets/{spreadsheet_id}/values/{range}:batchUpdate

## Inputs

- team_id
- period
- scorecard_rows

## Outputs

- sheet_revision_id
- publish_timestamp

## Side Effects

- May change Google Sheets state because the spec classifies it as action.

## Idempotency

Declared idempotency key: spreadsheet_id+period+revision_hash.

## Confirmation

- [Confirmation policy — action_google_sheets_publish_okr_scorecard](/policies/confirmation-action-google-sheets-publish-okr-scorecard.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Sheets](/systems/google-sheets.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- team_id
- period
- scorecard_rows

## Produces

- sheet_revision_id
- publish_timestamp

# Examples

```
action_google_sheets_publish_okr_scorecard(team_id=<team_id>, period=<period>, scorecard_rows=<scorecard_rows>)
```

# Citations

- [Google Sheets](/systems/google-sheets.md)
- [Confirmation policy — action_google_sheets_publish_okr_scorecard](/policies/confirmation-action-google-sheets-publish-okr-scorecard.md)
- [Idempotency policy — action_google_sheets_publish_okr_scorecard](/policies/idempotency-action-google-sheets-publish-okr-scorecard.md)
