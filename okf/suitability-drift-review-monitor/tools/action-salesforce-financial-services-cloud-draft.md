---
type: Agent Tool
title: action_salesforce_financial_services_cloud_draft
description: Execute the draft step in Salesforce Financial Services Cloud after the agent has gathered evidence and validated escalation gates.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_salesforce_financial_services_cloud_draft

Execute the draft step in Salesforce Financial Services Cloud after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
- **API:** POST /api/salesforce_financial_services_cloud/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Salesforce Financial Services Cloud state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_salesforce_financial_services_cloud_draft](/policies/confirmation-action-salesforce-financial-services-cloud-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [monthly_household_account_roster_pull](/workflow/monthly-household-account-roster-pull.md)
- [risk_tolerance_vs_portfolio_drift_scoring](/workflow/risk-tolerance-vs-portfolio-drift-scoring.md)
- [advisor_re_profiling_outreach_draft_audit_log](/workflow/advisor-re-profiling-outreach-draft-audit-log.md)

## Evals

- [Run the Suitability Drift Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/suitability-drift-review-monitor-end-to-end.md)

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
action_salesforce_financial_services_cloud_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
- [Confirmation policy — action_salesforce_financial_services_cloud_draft](/policies/confirmation-action-salesforce-financial-services-cloud-draft.md)
- [Idempotency policy — action_salesforce_financial_services_cloud_draft](/policies/idempotency-action-salesforce-financial-services-cloud-draft.md)
