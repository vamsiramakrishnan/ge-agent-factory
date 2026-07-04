---
type: Query Capability
title: "Cross-reference provisioning_tasks (e911_address_load, switch_translation, hl..."
description: "Cross-reference provisioning_tasks (e911_address_load, switch_translation, hlr_hss_update) and network_inventory_items admin_state/vendor in Netcracker Service Orchestration to determine whether the reject originates in the losing carrier's CSR or in the winning carrier's own fallout."
source_id: "provisioning-fallout-correlation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference provisioning_tasks (e911_address_load, switch_translation, hlr_hss_update) and network_inventory_items admin_state/vendor in Netcracker Service Orchestration to determine whether the reject originates in the losing carrier's CSR or in the winning carrier's own fallout.

## Tools used

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

## Runs in

- [provisioning_fallout_correlation](/workflow/provisioning-fallout-correlation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Number Porting Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/number-porting-exception-agent-end-to-end.md)
- [Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch on 2026-06-28, corrected and resubmitted on 2026-07-01, and was just rejected again — this time citing an account-number mismatch instead of the ZIP. Zendesk ticket #48213 shows the customer already threatened to cancel the port. Diagnose whether this is a genuine second CSR discrepancy or a stale CSR pull, and tell me the next action.](/tests/number-porting-exception-agent-csr-resubmission-conflict.md)
- [Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thursday) and is still order_status in_flight with fallout_status none as of this morning, 2026-07-03. It's a simple port with no LNP complexity flags. BigQuery's analytics_events shows the current-week rejection baseline running at 9.5%. Is this order breaching the FCC simple-port interval, and what should the desk do?](/tests/number-porting-exception-agent-fcc-interval-edge.md)

# Citations

- [Number Porting Exception Agent Service Assurance Runbook](/documents/number-porting-exception-agent-assurance-runbook.md)
- [LNP Reject Reason Code & Porting Interval Manual](/documents/lnp-reject-code-and-interval-manual.md)
