---
type: Eval Scenario
title: Elasticity model 542871 for SKU 71098234 in price_zone_id 23 shows a holdout_...
description: "Elasticity model 542871 for SKU 71098234 in price_zone_id 23 shows a holdout_wmape of 0.29 and a promo_lift_multiplier of 6.4. The matching Revionics price_recommendations record proposes dropping current_retail from $8.99 to $4.49 (a 50% markdown) effective 2026-07-11, with margin_impact_dollars of -$268,000. Decide whether to publish the corrected lift factor into Blue Yonder now."
source_id: "promo-forecast-accuracy-analyzer-markdown-threshold-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Elasticity model 542871 for SKU 71098234 in price_zone_id 23 shows a holdout_wmape of 0.29 and a promo_lift_multiplier of 6.4. The matching Revionics price_recommendations record proposes dropping current_retail from $8.99 to $4.49 (a 50% markdown) effective 2026-07-11, with margin_impact_dollars of -$268,000. Decide whether to publish the corrected lift factor into Blue Yonder now.

## Validates

- [lift-decomposition-cannibalization-check](/queries/lift-decomposition-cannibalization-check.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Promo Forecast Accuracy Analyzer Retail Execution Playbook](/documents/promo-forecast-accuracy-analyzer-execution-playbook.md)
- [Markdown & Trade Promotion Guardrail Manual](/documents/promo-forecast-accuracy-analyzer-markdown-guardrail-manual.md)
