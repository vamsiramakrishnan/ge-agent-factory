---
type: Workflow Stage
title: "Pareto Publish & Kaizen Handoff"
description: "Publish the ranked, dollarized loss Pareto to Looker dashboards via action_siemens_opcenter_mes_publish with a full audit trail, and escalate constraint-asset or capability exceptions to the Continuous Improvement Lead."
source_id: pareto_publish_kaizen_handoff
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pareto Publish & Kaizen Handoff

Publish the ranked, dollarized loss Pareto to Looker dashboards via action_siemens_opcenter_mes_publish with a full audit trail, and escalate constraint-asset or capability exceptions to the Continuous Improvement Lead.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)
