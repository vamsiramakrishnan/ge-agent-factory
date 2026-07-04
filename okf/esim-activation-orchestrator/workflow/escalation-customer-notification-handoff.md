---
type: Workflow Stage
title: "Escalation & Customer Notification Handoff"
description: "Raise Splunk alert_actions and route unresolved order_fallout_swat, lnp_operations_desk, or provisioning_engineering escalations, and notify the customer with device-specific recovery steps when a handset-side action is the blocker."
source_id: escalation_customer_notification_handoff
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Customer Notification Handoff

Raise Splunk alert_actions and route unresolved order_fallout_swat, lnp_operations_desk, or provisioning_engineering escalations, and notify the customer with device-specific recovery steps when a handset-side action is the blocker.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_splunk_log_events](/tools/query-splunk-log-events.md)
