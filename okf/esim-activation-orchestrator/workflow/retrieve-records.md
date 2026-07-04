---
type: Workflow Stage
title: Retrieve Records
description: Query service orders and provisioning tasks from Netcracker Service Orchestration and correlate with Splunk for the eSIM Activation Orchestrator workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query service orders and provisioning tasks from Netcracker Service Orchestration and correlate with Splunk for the eSIM Activation Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
