---
type: Workflow Stage
title: Markdown Ladder Simulation
description: "Simulate first_markdown_25 through final_clearance_75 depth and timing per SKU-zone using own_price_elasticity and cross_price_elasticity from elasticity_models, scoring each option against sell_through_target_pct and margin_impact_dollars in price_recommendations."
source_id: markdown_ladder_simulation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Markdown Ladder Simulation

Simulate first_markdown_25 through final_clearance_75 depth and timing per SKU-zone using own_price_elasticity and cross_price_elasticity from elasticity_models, scoring each option against sell_through_target_pct and margin_impact_dollars in price_recommendations.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)

Next: [Playbook & Guardrail Validation](/workflow/playbook-guardrail-validation.md)
