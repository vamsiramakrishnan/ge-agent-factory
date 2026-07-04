---
type: Workflow Stage
title: "Publish & Reinsurer Schedule Distribution"
description: "Execute action_verisk_iso_erc_publish with a full audit trail, refresh Looker dashboards and metric_definitions with live PML/TIV, and generate reinsurer-ready exposure schedules on demand."
source_id: publish_reinsurer_schedule_distribution
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Reinsurer Schedule Distribution

Execute action_verisk_iso_erc_publish with a full audit trail, refresh Looker dashboards and metric_definitions with live PML/TIV, and generate reinsurer-ready exposure schedules on demand.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)
- [action_verisk_iso_erc_publish](/tools/action-verisk-iso-erc-publish.md)
