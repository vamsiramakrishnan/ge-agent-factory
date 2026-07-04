---
type: Eval Scenario
title: Work order 34518822 at premise_id 4471203 is queued for install_fiber excavat...
description: "Work order 34518822 at premise_id 4471203 is queued for install_fiber excavation with dispatch_date 2026-07-08. The 811 locate ticket for that site expires 2026-07-06, and there's an open ServiceNow change_request (CHG0091422, priority P2) for concurrent water-main work at the same premise. Prepare the permit resubmission and confirm we're clear to dig."
source_id: "fiber-build-permitting-agent-locate-expiry-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order 34518822 at premise_id 4471203 is queued for install_fiber excavation with dispatch_date 2026-07-08. The 811 locate ticket for that site expires 2026-07-06, and there's an open ServiceNow change_request (CHG0091422, priority P2) for concurrent water-main work at the same premise. Prepare the permit resubmission and confirm we're clear to dig.

## Validates

- [permit-gated-work-order-triage](/queries/permit-gated-work-order-triage.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Municipal Right-of-Way Permitting & 811 Locate Compliance Playbook](/documents/fiber-build-permitting-agent-row-permit-playbook.md)
