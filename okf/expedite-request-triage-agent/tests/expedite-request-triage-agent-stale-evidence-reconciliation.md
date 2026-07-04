---
type: Eval Scenario
title: "ServiceNow ticket TCK-88213 asks us to expedite PO 4500192837 for material 43..."
description: "ServiceNow ticket TCK-88213 asks us to expedite PO 4500192837 for material 431205 by this Friday (2026-07-10), but the Kinaxis RapidResponse supply plan for that material was last revised 40 hours ago and SAP S/4HANA MM shows the PO due_date is already 2026-07-08. Reconcile before you approve anything."
source_id: "expedite-request-triage-agent-stale-evidence-reconciliation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ServiceNow ticket TCK-88213 asks us to expedite PO 4500192837 for material 431205 by this Friday (2026-07-10), but the Kinaxis RapidResponse supply plan for that material was last revised 40 hours ago and SAP S/4HANA MM shows the PO due_date is already 2026-07-08. Reconcile before you approve anything.

## Validates

- [expedite-intake-ticket-triage](/queries/expedite-intake-ticket-triage.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Expedite Request Triage Agent Standard Operating Procedure](/documents/expedite-request-triage-agent-sop.md)
