---
type: Workflow Stage
title: "Runbook-Gated Remediation Decision"
description: "Cross-check the diagnostic and risk-scoring outputs against the Truck Roll Avoidance Agent Service Assurance Runbook's remediation and escalation sections, citing the governing anchor before recommending a remote fix or a dispatch."
source_id: runbook_gated_remediation_decision
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Runbook-Gated Remediation Decision

Cross-check the diagnostic and risk-scoring outputs against the Truck Roll Avoidance Agent Service Assurance Runbook's remediation and escalation sections, citing the governing anchor before recommending a remote fix or a dispatch.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

Next: [Dispatch Filing & Technician Brief](/workflow/dispatch-filing-technician-brief.md)
