---
type: Workflow Stage
title: "NC Intake & Containment Check"
description: "Pull newly opened nonconformance_records and their linked inspection_lots from SAP S/4HANA QM the same shift they're detected, and verify containment_complete before the ticket moves off the intake queue."
source_id: nc_intake_containment_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# NC Intake & Containment Check

Pull newly opened nonconformance_records and their linked inspection_lots from SAP S/4HANA QM the same shift they're detected, and verify containment_complete before the ticket moves off the intake queue.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_nonconformance_triage_agent_sop](/tools/lookup-nonconformance-triage-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

Next: [MES Genealogy Correlation](/workflow/mes-genealogy-correlation.md)
