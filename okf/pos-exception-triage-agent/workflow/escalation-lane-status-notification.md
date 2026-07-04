---
type: Workflow Stage
title: "Escalation & Lane-Status Notification"
description: "Call action_oracle_xstore_pos_escalate against Oracle Xstore POS with the evidence trail attached, then notify the Store Manager of lane-down status and expected time-to-resolve."
source_id: escalation_lane_status_notification
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Lane-Status Notification

Call action_oracle_xstore_pos_escalate against Oracle Xstore POS with the evidence trail attached, then notify the Store Manager of lane-down status and expected time-to-resolve.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)
