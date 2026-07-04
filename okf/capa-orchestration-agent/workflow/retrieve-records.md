---
type: Workflow Stage
title: Retrieve Records
description: Query inspection lots and nonconformance records from SAP S/4HANA QM and correlate with ServiceNow for the CAPA Orchestration Agent workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query inspection lots and nonconformance records from SAP S/4HANA QM and correlate with ServiceNow for the CAPA Orchestration Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
