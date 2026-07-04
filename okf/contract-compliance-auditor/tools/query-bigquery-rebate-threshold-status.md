---
type: Agent Tool
title: query_bigquery_rebate_threshold_status
description: "Check rebate cliff status: current volume % of threshold, days remaining in contract term, proximity alerts."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_rebate_threshold_status

Check rebate cliff status: current volume % of threshold, days remaining in contract term, proximity alerts.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- contract_id

## Outputs

- rebate_threshold_status

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [terms_actuals_extraction](/workflow/terms-actuals-extraction.md)
- [pricing_volume_compliance_analysis](/workflow/pricing-volume-compliance-analysis.md)
- [formula_interpretation_advisory](/workflow/formula-interpretation-advisory.md)

## Evals

- [Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.](/tests/monthly-compliance-happy-path.md)
- [Contract-4107 has a rebate tier: 90% volume commitment = $500K rebate. Current volume is at 88% with 45 days remaining in the term. Recommend action.](/tests/rebate-cliff-opportunity-narrative.md)

## Evidence emitted

- sql_result

## Required inputs

- contract_id

## Produces

- rebate_threshold_status

# Examples

```
query_bigquery_rebate_threshold_status(contract_id=<contract_id>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
