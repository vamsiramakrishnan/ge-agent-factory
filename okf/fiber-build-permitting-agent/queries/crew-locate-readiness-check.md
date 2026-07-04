---
type: Query Capability
title: Confirm technician_schedules primary_skill and tower_climb_certified status a...
description: "Confirm technician_schedules primary_skill and tower_climb_certified status against the job's traffic-control and elevated-work requirements, and validate that an 811 one-call locate ticket is in a valid window relative to service_appointments arrival_window and dispatch_date."
source_id: "crew-locate-readiness-check"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Confirm technician_schedules primary_skill and tower_climb_certified status against the job's traffic-control and elevated-work requirements, and validate that an 811 one-call locate ticket is in a valid window relative to service_appointments arrival_window and dispatch_date.

## Tools used

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

## Runs in

- [crew_locate_readiness_check](/workflow/crew-locate-readiness-check.md)

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
