---
type: Workflow Stage
title: "Chain Scorecard Publish & Recovery Action"
description: "Publish the chain OSA scorecard to Looker dashboards, execute the cycle-count/inventory-adjustment action in Oracle Xstore POS once two-system evidence is attached, and escalate stores trending below threshold to the Store Operations Director."
source_id: chain_scorecard_publish_recovery_action
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Chain Scorecard Publish & Recovery Action

Publish the chain OSA scorecard to Looker dashboards, execute the cycle-count/inventory-adjustment action in Oracle Xstore POS once two-system evidence is attached, and escalate stores trending below threshold to the Store Operations Director.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)
