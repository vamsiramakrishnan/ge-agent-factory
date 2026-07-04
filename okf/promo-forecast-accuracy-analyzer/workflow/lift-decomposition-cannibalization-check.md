---
type: Workflow Stage
title: "Lift Decomposition & Cannibalization Check"
description: "Cross-reference price_recommendations, price_zones, and elasticity_models from Revionics Price Optimization to split each promo_lift_units figure into true incremental, cannibalized, and pulled-forward volume using own_price_elasticity and cross_price_elasticity."
source_id: lift_decomposition_cannibalization_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lift Decomposition & Cannibalization Check

Cross-reference price_recommendations, price_zones, and elasticity_models from Revionics Price Optimization to split each promo_lift_units figure into true incremental, cannibalized, and pulled-forward volume using own_price_elasticity and cross_price_elasticity.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)

Next: [Post-Event Scorecard Build](/workflow/post-event-scorecard-build.md)
