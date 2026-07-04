---
type: Workflow Stage
title: Segment Heatmap Publication to Looker
description: "Publish the attrition heatmap and worklist summary to Looker dashboards (query_looker_dashboards) and notify Retail Deposits Product Managers when a segment's outflow variance breaches the metric_definitions threshold."
source_id: segment_heatmap_publication_to_looker
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Segment Heatmap Publication to Looker

Publish the attrition heatmap and worklist summary to Looker dashboards (query_looker_dashboards) and notify Retail Deposits Product Managers when a segment's outflow variance breaches the metric_definitions threshold.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

Next: [Evidence-Gated Publish & Escalation](/workflow/evidence-gated-publish-escalation.md)
