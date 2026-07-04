---
type: Eval Scenario
title: Run the Commodity Price Forecaster workflow for the current period. Cite the ...
description: "Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "commodity-price-forecaster-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [event-interpretation-briefing](/queries/event-interpretation-briefing.md)

## Mechanisms to call

- [query_s_p_global_platts_s_p_global_platts_records](/tools/query-s-p-global-platts-s-p-global-platts-records.md)
- [query_icis_icis_records](/tools/query-icis-icis-records.md)
- [query_mintec_mintec_records](/tools/query-mintec-mintec-records.md)
- [query_lme_lme_records](/tools/query-lme-lme-records.md)
- [lookup_commodity_price_forecaster_policy_guide](/tools/lookup-commodity-price-forecaster-policy-guide.md)
- [action_s_p_global_platts_recommend](/tools/action-s-p-global-platts-recommend.md)

## Success rubric

Action recommend executed against S&P Global Platts, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Commodity Price Forecaster Procurement Policy Guide](/documents/commodity-price-forecaster-policy-guide.md)
