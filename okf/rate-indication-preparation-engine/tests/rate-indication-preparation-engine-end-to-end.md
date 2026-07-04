---
type: Eval Scenario
title: Run the Rate Indication Preparation Engine workflow for the current period. C...
description: "Run the Rate Indication Preparation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "rate-indication-preparation-engine-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Rate Indication Preparation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_rate_indication_preparation_engine_authority_guide](/tools/lookup-rate-indication-preparation-engine-authority-guide.md)
- [action_insurance_3_generate](/tools/action-insurance-3-generate.md)

## Success rubric

Action generate executed against INSURANCE 3, with audit-trail entry and Pricing Actuary notified of outcomes.

# Citations

- [Rate Indication Preparation Engine Authority & Referral Guide](/documents/rate-indication-preparation-engine-authority-guide.md)
