---
type: Agent Tool
title: action_fenergo_clm_file
description: Execute the file step in Fenergo CLM after the agent has gathered evidence and validated escalation gates.
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

# action_fenergo_clm_file

Execute the file step in Fenergo CLM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Fenergo CLM](/systems/fenergo-clm.md)
- **API:** POST /api/fenergo_clm/file

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Fenergo CLM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_fenergo_clm_file](/policies/confirmation-action-fenergo-clm-file.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Fenergo CLM](/systems/fenergo-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [due_date_cohort_build](/workflow/due-date-cohort-build.md)
- [activity_vs_profile_comparison](/workflow/activity-vs-profile-comparison.md)
- [no_change_auto_completion_senior_routing](/workflow/no-change-auto-completion-senior-routing.md)
- [policy_gated_filing_audit](/workflow/policy-gated-filing-audit.md)

## Evals

- [Run the Periodic KYC Review Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/periodic-kyc-review-orchestrator-end-to-end.md)

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
action_fenergo_clm_file(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Fenergo CLM](/systems/fenergo-clm.md)
- [Confirmation policy — action_fenergo_clm_file](/policies/confirmation-action-fenergo-clm-file.md)
- [Idempotency policy — action_fenergo_clm_file](/policies/idempotency-action-fenergo-clm-file.md)
