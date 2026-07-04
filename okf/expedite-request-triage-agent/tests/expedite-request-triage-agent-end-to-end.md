---
type: Eval Scenario
title: Run the Expedite Request Triage Agent workflow for the current period. Cite t...
description: "Run the Expedite Request Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "expedite-request-triage-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Expedite Request Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [alternate-stock-po-verification](/queries/alternate-stock-po-verification.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)
- [action_sap_s_4hana_mm_approve](/tools/action-sap-s-4hana-mm-approve.md)

## Success rubric

Action approve executed against SAP S/4HANA MM, with audit-trail entry and Procurement Buyer notified of outcomes.

# Citations

- [Expedite Request Triage Agent Standard Operating Procedure](/documents/expedite-request-triage-agent-sop.md)
