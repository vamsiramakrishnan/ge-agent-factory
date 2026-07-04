---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull provisioning_tasks and run query_splunk_log_events against Splunk to spot SM-DP+ profile downloads stuck on hlr_hss_update or number_activation task_type, keying on retry_count and error_code.](/queries/profile-download-triage.md)
- [Cross-check service_orders and network_inventory_items from Netcracker Service Orchestration against analytics_events and historical_metrics surfaced by query_bigquery_analytics_events to confirm HSS, entitlement, and billing agree before an activation is called done.](/queries/cross-system-state-reconciliation.md)
- [Score fallout_status and task_status severity against BigQuery historical baselines, then validate every finding against the eSIM Activation Orchestrator Service Assurance Runbook citation anchors via lookup_esim_activation_orchestrator_assurance_runbook.](/queries/fallout-severity-scoring-runbook-validation.md)
- [Invoke action_netcracker_service_orchestration_file to retry or re-sequence the profile download in Netcracker Service Orchestration only once two-system evidence and runbook gates on the service_orders / provisioning_tasks pair are satisfied.](/queries/guarded-retry-provisioning-action.md)
- [Raise Splunk alert_actions and route unresolved order_fallout_swat, lnp_operations_desk, or provisioning_engineering escalations, and notify the customer with device-specific recovery steps when a handset-side action is the blocker.](/queries/escalation-customer-notification-handoff.md)
