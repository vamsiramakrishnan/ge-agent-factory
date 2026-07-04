---
type: Agent Tool
title: query_verisk_iso_erc_loss_cost_benchmarks
description: Retrieve loss cost benchmarks from Verisk ISO ERC for the Loss Ratio Trend Monitor workflow.
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

# query_verisk_iso_erc_loss_cost_benchmarks

Retrieve loss cost benchmarks from Verisk ISO ERC for the Loss Ratio Trend Monitor workflow.

- **Kind:** query
- **Source system:** [Verisk ISO ERC](/systems/verisk-iso-erc.md)

## Inputs

- benchmark_id
- class_code
- date_range

## Outputs

- loss_cost_benchmarks_records
- loss_cost_benchmarks_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Verisk ISO ERC](/systems/verisk-iso-erc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [benchmark_circular_intake](/workflow/benchmark-circular-intake.md)
- [segment_loss_ratio_decomposition](/workflow/segment-loss-ratio-decomposition.md)
- [authority_referral_gate](/workflow/authority-referral-gate.md)
- [escalation_rate_review_fast_track](/workflow/escalation-rate-review-fast-track.md)

## Evals

- [Run the Loss Ratio Trend Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loss-ratio-trend-monitor-end-to-end.md)
- [Loss cost benchmark BM-77410 (state TX, class_code 8810, annual_statement_line 19_2_private_passenger_auto_liability) shows advisory_loss_cost up 14% versus last quarter's cached_aggregates snapshot, but circular CIRC-3392 covering that same state and line is still carrier_adoption_status = under_actuarial_review, with doi_filing_required = true and a proposed_effective_date of 2026-08-15. Reconcile whether we can treat the higher loss cost as our current rate basis before recommending a rate-review fast-track for this cell.](/tests/loss-ratio-trend-monitor-circular-adoption-conflict.md)
- [Loss cost benchmark BM-91027 (state FL, class_code 4053, annual_statement_line 04_homeowners_multi_peril) carries credibility_factor 0.14, and analytics_events records AE-40218 (period 2026-05) and AE-40391 (period 2026-06) both show variance_pct at +16% against historical_metrics. The Chief Actuary wants to know whether this cell should be fast-tracked for rate review this week.](/tests/loss-ratio-trend-monitor-low-credibility-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- benchmark_id
- class_code
- date_range

## Produces

- loss_cost_benchmarks_records
- loss_cost_benchmarks_summary

# Examples

```
query_verisk_iso_erc_loss_cost_benchmarks(benchmark_id=<benchmark_id>, class_code=<class_code>, date_range=<date_range>)
```

# Citations

- [Verisk ISO ERC](/systems/verisk-iso-erc.md)
