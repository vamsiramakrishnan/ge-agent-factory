---
type: Eval Scenario
title: Run the Nonconformance Triage Agent workflow for the current period. Cite the...
description: "Run the Nonconformance Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "nonconformance-triage-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Nonconformance Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonconformance_triage_agent_sop](/tools/lookup-nonconformance-triage-agent-sop.md)
- [action_sap_s_4hana_qm_escalate](/tools/action-sap-s-4hana-qm-escalate.md)

## Success rubric

Action escalate executed against SAP S/4HANA QM, with audit-trail entry and Shift Quality Lead notified of outcomes.

# Citations

- [Nonconformance Triage Agent Standard Operating Procedure](/documents/nonconformance-triage-agent-sop.md)
