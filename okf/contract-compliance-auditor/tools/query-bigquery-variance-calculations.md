---
type: Agent Tool
title: query_bigquery_variance_calculations
description: "Run variance analysis: contracted price vs. actual invoice price per SKU, cumulative volumes vs. commitments."
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

# query_bigquery_variance_calculations

Run variance analysis: contracted price vs. actual invoice price per SKU, cumulative volumes vs. commitments.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- contract_id

## Outputs

- variance_report

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

## Evals

- [Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.](/tests/monthly-compliance-happy-path.md)

## Evidence emitted

- sql_result

## Required inputs

- contract_id

## Produces

- variance_report

# Examples

```
query_bigquery_variance_calculations(contract_id=<contract_id>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
