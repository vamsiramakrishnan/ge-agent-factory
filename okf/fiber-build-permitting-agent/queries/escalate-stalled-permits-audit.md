---
type: Query Capability
title: Execute action_oracle_field_service_escalate for stalled or rejected permits ...
description: "Execute action_oracle_field_service_escalate for stalled or rejected permits tied to field_work_orders, attach the full audit trail, and hand off to the Construction Program Manager or named specialist per the escalation matrix."
source_id: "escalate-stalled-permits-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_oracle_field_service_escalate for stalled or rejected permits tied to field_work_orders, attach the full audit trail, and hand off to the Construction Program Manager or named specialist per the escalation matrix.

## Tools used

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

## Runs in

- [escalate_stalled_permits_audit](/workflow/escalate-stalled-permits-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Fiber Build Permitting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fiber-build-permitting-agent-end-to-end.md)
- [Work order 34518822 at premise_id 4471203 is queued for install_fiber excavation with dispatch_date 2026-07-08. The 811 locate ticket for that site expires 2026-07-06, and there's an open ServiceNow change_request (CHG0091422, priority P2) for concurrent water-main work at the same premise. Prepare the permit resubmission and confirm we're clear to dig.](/tests/fiber-build-permitting-agent-locate-expiry-conflict.md)
- [Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves.](/tests/fiber-build-permitting-agent-sla-aging-reconciliation.md)

# Citations

- [Fiber Build Permitting Agent Service Assurance Runbook](/documents/fiber-build-permitting-agent-assurance-runbook.md)
- [Municipal Right-of-Way Permitting & 811 Locate Compliance Playbook](/documents/fiber-build-permitting-agent-row-permit-playbook.md)
