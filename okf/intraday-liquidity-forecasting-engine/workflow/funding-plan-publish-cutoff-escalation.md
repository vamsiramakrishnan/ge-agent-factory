---
type: Workflow Stage
title: "Funding Plan Publish & Cutoff Escalation"
description: "Publish the hourly funding plan through action_murex_mx_3_publish with ranked money-market actions and costs per currency, refresh Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) for the Treasury Manager's queue, and escalate any projected shortfall ahead of the relevant currency's correspondent cutoff."
source_id: funding_plan_publish_cutoff_escalation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Funding Plan Publish & Cutoff Escalation

Publish the hourly funding plan through action_murex_mx_3_publish with ranked money-market actions and costs per currency, refresh Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) for the Treasury Manager's queue, and escalate any projected shortfall ahead of the relevant currency's correspondent cutoff.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)
