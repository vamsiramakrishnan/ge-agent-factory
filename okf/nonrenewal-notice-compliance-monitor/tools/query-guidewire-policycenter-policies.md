---
type: Agent Tool
title: query_guidewire_policycenter_policies
description: "Retrieve policies from Guidewire PolicyCenter for the Non-Renewal Notice Compliance Monitor workflow."
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

# query_guidewire_policycenter_policies

Retrieve policies from Guidewire PolicyCenter for the Non-Renewal Notice Compliance Monitor workflow.

- **Kind:** query
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

## Inputs

- policy_number
- named_insured
- date_range

## Outputs

- policies_records
- policies_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [non_renewal_candidate_identification](/workflow/non-renewal-candidate-identification.md)
- [publish_audit_trail](/workflow/publish-audit-trail.md)

## Evals

- [Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nonrenewal-notice-compliance-monitor-end-to-end.md)
- [Policy POL-88421 (jurisdiction_state FL, homeowners) shows policy_status = reinstated as of 2026-06-18 in Guidewire PolicyCenter, but a non-renewal notice for the same policy_number was staged and dispatched on 2026-05-02 against an expiration_date of 2026-07-20. Reconcile whether the non-renewal notice is still valid or must be withdrawn before the 07-20 expiration, and tell me what to do next.](/tests/nonrenewal-notice-compliance-monitor-reinstatement-conflict.md)
- [Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expiration_date 2026-08-05) is subject to a 60-day TX statutory non-renewal notice deadline, meaning notice must be dispatched by 2026-06-06. Guidewire PolicyCenter's policies extract is timestamped 2026-07-01T00:00Z and the BigQuery analytics_events baseline was last computed 2026-06-29. Confirm whether the deadline was met and whether it's safe to publish this policy into today's compliance exception report.](/tests/nonrenewal-notice-compliance-monitor-stale-evidence-deadline-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- policy_number
- named_insured
- date_range

## Produces

- policies_records
- policies_summary

# Examples

```
query_guidewire_policycenter_policies(policy_number=<policy_number>, named_insured=<named_insured>, date_range=<date_range>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
