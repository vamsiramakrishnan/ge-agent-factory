---
type: Query Capability
title: "Raise Splunk alert_actions and route unresolved order_fallout_swat, lnp_opera..."
description: "Raise Splunk alert_actions and route unresolved order_fallout_swat, lnp_operations_desk, or provisioning_engineering escalations, and notify the customer with device-specific recovery steps when a handset-side action is the blocker."
source_id: "escalation-customer-notification-handoff"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Raise Splunk alert_actions and route unresolved order_fallout_swat, lnp_operations_desk, or provisioning_engineering escalations, and notify the customer with device-specific recovery steps when a handset-side action is the blocker.

## Tools used

- [query_splunk_log_events](/tools/query-splunk-log-events.md)

## Runs in

- [escalation_customer_notification_handoff](/workflow/escalation-customer-notification-handoff.md)

## Evidence expected

- sql_result

## Evals

- [Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/esim-activation-orchestrator-end-to-end.md)
- [Order 74213890 shows order_status = completed in service_orders, but the linked provisioning_task 954102233 still reports task_status = failed with error_code = data_mismatch and retry_count = 4. Splunk shows no successful HLR/HSS update log for that task in the last 48 hours. Reconcile the record and tell me whether it's safe to close the ticket.](/tests/esim-activation-orchestrator-status-fallout-mismatch.md)

# Citations

- [eSIM Activation Orchestrator Service Assurance Runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
- [eSIM Remote SIM Provisioning (SGP.22) Fraud Controls & Activation Security Playbook](/documents/esim-sgp22-fraud-controls-playbook.md)
