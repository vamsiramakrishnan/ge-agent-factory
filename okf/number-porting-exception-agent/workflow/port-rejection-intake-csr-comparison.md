---
type: Workflow Stage
title: "Port Rejection Intake & CSR Comparison"
description: "Pull the rejected port-in service_orders record and the losing-carrier CSR fields surfaced through Netcracker Service Orchestration, correlating with any open Zendesk tickets to isolate the single mismatched attribute (account number, billing name, or service address ZIP) that triggered the reject."
source_id: port_rejection_intake_csr_comparison
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Port Rejection Intake & CSR Comparison

Pull the rejected port-in service_orders record and the losing-carrier CSR fields surfaced through Netcracker Service Orchestration, correlating with any open Zendesk tickets to isolate the single mismatched attribute (account number, billing name, or service address ZIP) that triggered the reject.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Provisioning Fallout Correlation](/workflow/provisioning-fallout-correlation.md)
