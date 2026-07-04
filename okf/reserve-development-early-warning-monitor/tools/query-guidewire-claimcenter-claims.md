---
type: Agent Tool
title: query_guidewire_claimcenter_claims
description: Retrieve claims from Guidewire ClaimCenter for the Reserve Development Early Warning Monitor workflow.
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

# query_guidewire_claimcenter_claims

Retrieve claims from Guidewire ClaimCenter for the Reserve Development Early Warning Monitor workflow.

- **Kind:** query
- **Source system:** [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

## Inputs

- claim_number
- policy_number
- date_range

## Outputs

- claims_records
- claims_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [reserve_signal_intake](/workflow/reserve-signal-intake.md)
- [gap_scoring_queue_prioritization](/workflow/gap-scoring-queue-prioritization.md)
- [manager_escalation_file_action](/workflow/manager-escalation-file-action.md)

## Evals

- [Run the Reserve Development Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reserve-development-early-warning-monitor-end-to-end.md)
- [Claim CLM-2026-04471 (policy PLC-88291, workers_comp, TX) shows a posted reserve_amount of $42,000 in reserve_lines, but three reserve_increase transactions were logged on 2026-05-02, 2026-05-19, and 2026-06-30, each filed under authority_level_used adjuster_25k. BigQuery historical_metrics puts model-predicted severity for this cohort at $118,000 as of the 2026-06 computed_at period. Reconcile whether this is a stair-stepping pattern, determine the correct next action, and cite your evidence.](/tests/reserve-development-early-warning-monitor-stairstep-reconciliation.md)
- [Claim CLM-2026-05902 (personal_auto, FL) has claim_exposures record EXP-119830 with attorney_represented true, demand_amount blank, and exposure_status pending_coverage_determination; that claim_exposures row was last updated 40 days ago. reserve_lines shows a posted reserve_amount of $61,000 against a BigQuery historical_metrics model severity of $103,500 for the cohort. Should the agent raise the reserve to close the gap right now?](/tests/reserve-development-early-warning-monitor-stale-coverage-gap.md)

## Evidence emitted

- source_system_record

## Required inputs

- claim_number
- policy_number
- date_range

## Produces

- claims_records
- claims_summary

# Examples

```
query_guidewire_claimcenter_claims(claim_number=<claim_number>, policy_number=<policy_number>, date_range=<date_range>)
```

# Citations

- [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)
