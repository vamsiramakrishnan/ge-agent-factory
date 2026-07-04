---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull online_orders from Salesforce Commerce Cloud filtered to fulfillment_method of bopis or curbside and start the 2-hour SLA clock off order_date, using query_salesforce_commerce_cloud_online_orders.](/queries/bopis-curbside-order-intake-sla-clock-start.md)
- [Correlate each order against its Manhattan Active WM pick_tasks record -- pick_status, cases_per_hour, wave_id, and pick_zone -- via query_manhattan_active_wm_pick_tasks and query_manhattan_active_wm_warehouse_orders to see where the pick actually stands.](/queries/pick-task-telemetry-correlation.md)
- [Compare current pick-rate telemetry against BigQuery historical_metrics and analytics_events (query_bigquery_historical_metrics, query_bigquery_analytics_events) to predict which orders will miss the 2-hour SLA before the picker finishes.](/queries/breach-risk-scoring-against-historical-baselines.md)
- [Check inventory_snapshots on_hand_units and negative_on_hand_flag in Manhattan Active WM (query_manhattan_active_wm_inventory_snapshots) against product_catalog_entries catalog_status in Salesforce Commerce Cloud (query_salesforce_commerce_cloud_product_catalog_entries) to find a live substitute for any short-picked SKU.](/queries/inventory-substitution-validation.md)
- [Cite the Click-and-Collect SLA Monitor Retail Execution Playbook (lookup_click_and_collect_sla_monitor_execution_playbook) before escalating at-risk orders to store leadership or rerouting overflow via action_salesforce_commerce_cloud_escalate, then notify the customer of the accurate ready time.](/queries/playbook-gated-escalation-customer-notification.md)
