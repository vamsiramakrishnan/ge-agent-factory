---
type: Workflow Stage
title: KPI Reporting to Pricing Manager
description: "Publish resulting competitive_price_index and margin movement to Looker dashboards so the Pricing Manager can track Price-index drift on KVIs against the +/-1.5% weekly target."
source_id: kpi_reporting_to_pricing_manager
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# KPI Reporting to Pricing Manager

Publish resulting competitive_price_index and margin movement to Looker dashboards so the Pricing Manager can track Price-index drift on KVIs against the +/-1.5% weekly target.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)
