---
type: Eval Scenario
title: Run the Catastrophe Exposure Rollup Engine workflow for the current period. C...
description: "Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cat-exposure-rollup-engine-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)
- [action_verisk_iso_erc_publish](/tools/action-verisk-iso-erc-publish.md)

## Success rubric

Action publish executed against Verisk ISO ERC, with audit-trail entry and Portfolio Manager notified of outcomes.

# Citations

- [Catastrophe Exposure Rollup Engine Authority & Referral Guide](/documents/cat-exposure-rollup-engine-authority-guide.md)
