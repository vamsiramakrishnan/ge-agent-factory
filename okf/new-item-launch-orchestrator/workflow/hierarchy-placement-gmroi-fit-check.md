---
type: Workflow Stage
title: "Hierarchy Placement & GMROI Fit Check"
description: "Compare the item's proposed department_number/class_number placement and margin against merchandise_hierarchy.gmroi_target and markdown_budget_pct, using BigQuery historical_metrics and analytics_events as the baseline for cycle-time and cost-error variance."
source_id: hierarchy_placement_gmroi_fit_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Hierarchy Placement & GMROI Fit Check

Compare the item's proposed department_number/class_number placement and margin against merchandise_hierarchy.gmroi_target and markdown_budget_pct, using BigQuery historical_metrics and analytics_events as the baseline for cycle-time and cost-error variance.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)

Next: [First Allocation & Price Activation Publish](/workflow/first-allocation-price-activation-publish.md)
