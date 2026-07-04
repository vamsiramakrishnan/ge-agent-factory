---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Batch copper-to-fiber and TDM-to-IP migration candidates from service_orders and network_inventory_items in Netcracker Service Orchestration, grouping by serving terminal (site_id/ne_id) and order_type via query_netcracker_service_orchestration_service_orders.](/queries/serving-terminal-candidate-batching.md)
- [Validate network_inventory_items admin_state, software_version, and capacity_utilization_pct against in-flight provisioning_tasks in Netcracker Service Orchestration to confirm the target network element is actually ready before a cutover is sequenced.](/queries/live-network-state-inventory-validation.md)
- [Cross-check ServiceNow change_requests and tickets for a registered freeze window on the serving terminal via query_servicenow_tickets, then sequence service_orders cutover dates so no two migrations stack against a single contested change window.](/queries/change-freeze-cutover-sequencing.md)
- [Generate per-customer migration orders from service_orders and drive provisioning_tasks (hlr_hss_update, olt_port_assign, e911_address_load, number_activation) to completion, citing the Legacy Service Migration Orchestrator Service Assurance Runbook via lookup_legacy_service_migration_orchestrator_assurance_runbook before calling action_netcracker_service_orchestration_escalate.](/queries/migration-order-generation-task-execution.md)
- [Monitor analytics_events and historical_metrics in BigQuery for circuit health after cutover, and execute action_netcracker_service_orchestration_escalate to roll back or hand off any circuit that fails verification to the Provisioning Engineer.](/queries/post-cutover-health-verification-rollback.md)
