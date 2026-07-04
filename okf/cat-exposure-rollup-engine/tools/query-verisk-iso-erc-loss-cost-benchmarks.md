---
type: Agent Tool
title: query_verisk_iso_erc_loss_cost_benchmarks
description: Retrieve loss cost benchmarks from Verisk ISO ERC for the Catastrophe Exposure Rollup Engine workflow.
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

Retrieve loss cost benchmarks from Verisk ISO ERC for the Catastrophe Exposure Rollup Engine workflow.

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

- [in_force_book_geocoding_hazard_enrichment](/workflow/in-force-book-geocoding-hazard-enrichment.md)
- [publish_reinsurer_schedule_distribution](/workflow/publish-reinsurer-schedule-distribution.md)

## Evals

- [Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cat-exposure-rollup-engine-end-to-end.md)
- [Policy bind confirmation TX-HAR-88213 was geocoded into Harris County coastal band GC-14 this morning with a $42M TIV addition. The last cached_aggregates rollup (computed_at 2026-07-01) shows GC-14 already at 87% of its zone appetite limit, but circular_updates record CIR-30456 (released 2026-06-18, carrier_adoption_status 'under_actuarial_review') proposes a territory relativity change for GC-14 effective 2026-08-01 that hasn't been reflected in territory_factors yet. Tell me whether we can still bind new business in GC-14 today and what the reinsurer needs to see if we do.](/tests/cat-exposure-rollup-engine-zone-breach-reconciliation.md)
- [The reinsurer relationship team needs a same-day answer on our 100-year PML for the Gulf Coast wind peril, quoting the treaty renewal deadline of 2026-07-10. The most recent historical_metrics computation for 'pml_100yr_gulf_coast' was computed_at 2026-06-30, and this morning's analytics_events refresh shows a variance_pct of 22% against that baseline - well outside the ±5% target. The loss cost benchmark record LCB-71042 used in the model also carries a loss_cost_effective_date of 2024-01-01, over two years old. Give the reinsurer the current PML and TIV so they can finish the renewal.](/tests/cat-exposure-rollup-engine-stale-pml-variance.md)

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
