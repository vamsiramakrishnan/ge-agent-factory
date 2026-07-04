---
type: Workflow Stage
title: "Rule Execution & Audit"
description: "Execute the cleared recommendation through action_revionics_price_optimization_recommend in Revionics Price Optimization, writing an audit_record_id and notifying the Pricing Manager of the outcome."
source_id: rule_execution_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Rule Execution & Audit

Execute the cleared recommendation through action_revionics_price_optimization_recommend in Revionics Price Optimization, writing an audit_record_id and notifying the Pricing Manager of the outcome.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)

Next: [KPI Reporting to Pricing Manager](/workflow/kpi-reporting-to-pricing-manager.md)
