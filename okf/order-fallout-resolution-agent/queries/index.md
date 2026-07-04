---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull failed and stalled service_orders and provisioning_tasks off the Netcracker Service Orchestration fallout queue and correlate each order_number against open tickets, change_requests, and incidents in ServiceNow so the specialist isn't triaging the same failure in two systems.](/queries/fallout-queue-intake-correlation.md)
- [Classify each record's fallout_status and error_code (address_validation, switch_reject, lnp_delay, inventory_shortfall, manual_task_pending, ne_timeout, data_mismatch, port_unavailable, address_invalid) against known-pattern signatures to decide whether it is auto-remediable or needs a human.](/queries/error-signature-classification.md)
- [Compare current fallout volume and dwell time in service_orders against historical_metrics and cached_aggregates analytics_events in BigQuery to confirm whether the queue is tracking toward the 4% target or regressing past baseline.](/queries/baseline-benchmarking.md)
- [Apply the known-pattern fix (address normalization, port/NE conflict resolution) to the affected provisioning_tasks and replay the corrected service_orders record through the Netcracker Service Orchestration flow-through engine, watching task_status for completed.](/queries/auto-remediation-replay.md)
- [Cross-check unresolved fallout and any planned escalate action against the Order Fallout Resolution Agent Service Assurance Runbook and, where LNP or E911 tasks are involved, the LNP/E911 compliance bulletin, citing the governing anchors before anything is authorized.](/queries/runbook-gated-escalation-review.md)
- [Execute action_netcracker_service_orchestration_escalate with a full audit trail, open or update the linked ServiceNow ticket or change_request, and notify the Order Management Specialist or named handoff target of the outcome.](/queries/escalate-audit.md)
