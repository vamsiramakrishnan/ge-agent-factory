---
type: Agent Tool
title: query_duck_creek_policy_policy_forms
description: Retrieve policy forms from Duck Creek Policy for the Policyholder Correspondence Drafting Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_duck_creek_policy_policy_forms

Retrieve policy forms from Duck Creek Policy for the Policyholder Correspondence Drafting Agent workflow.

- **Kind:** query
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)

## Inputs

- form_id
- form_code
- date_range

## Outputs

- policy_forms_records
- policy_forms_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_endorsement_record_pull](/workflow/policy-endorsement-record-pull.md)
- [coverage_language_filed_status_validation](/workflow/coverage-language-filed-status-validation.md)
- [team_lead_routing_audit](/workflow/team-lead-routing-audit.md)

## Evals

- [Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policyholder-correspondence-drafting-agent-end-to-end.md)
- [Zendesk ticket #58321 is a policyholder complaint about the water-backup exclusion wording on form HO_00_03_0322. This is the second letter for this thread — satisfaction_scores record SAT-9042 logged a score of 2 after the first coverage-explanation letter went out on 2026-06-18, and a new satisfaction_scores record SAT-9107 logged this week also shows a score of 2. Draft the follow-up reply and send it out today.](/tests/policyholder-correspondence-drafting-agent-repeat-dissatisfaction.md)
- [The policyholder on form CP_00_10_1012 (endorsement_records ENDORSEMENT-33190, adding a scheduled blanket property limit) is asking us to confirm in writing that the new limit is fully in effect. The linked policy_forms record shows filing_status filed_pending_doi. Draft the confirmation letter now.](/tests/policyholder-correspondence-drafting-agent-pending-filing-confirmation.md)

## Evidence emitted

- source_system_record

## Required inputs

- form_id
- form_code
- date_range

## Produces

- policy_forms_records
- policy_forms_summary

# Examples

```
query_duck_creek_policy_policy_forms(form_id=<form_id>, form_code=<form_code>, date_range=<date_range>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)
