---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull new expedite tickets from ServiceNow (query_servicenow_tickets) and capture the requested material_number, priority, and need date the Procurement Buyer must adjudicate before any supply check runs.](/queries/expedite-intake-ticket-triage.md)
- [Query supply_plans and demand_signals in Kinaxis RapidResponse (query_kinaxis_rapidresponse_supply_plans) to confirm the true requirement date and flag any plan that was published, committed, or revised after the ticket was opened.](/queries/requirement-date-reconciliation.md)
- [Check open purchase_orders and vendor standing in SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) for existing coverage, alternate-plant supply, or a due_date that already beats the requested need — the evidence basis for rejecting an unnecessary expedite.](/queries/alternate-stock-po-verification.md)
- [Rank surviving requests by production impact and expedite cost using BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) against the quarterly expedite-cost baseline the Procurement Buyer reports against.](/queries/impact-cost-scoring.md)
- [Cite the Expedite Request Triage Agent Standard Operating Procedure and the Premium Freight & Expedite Rate Schedule (lookup_expedite_request_triage_agent_sop) before any disposition, confirming vendor risk_score and authorized tier ceiling.](/queries/sop-rate-schedule-evidence-gate.md)
- [Execute the approve step in SAP S/4HANA MM (action_sap_s_4hana_mm_approve), draft the supplier expedite communication for approved requests, and log cost and outcome to BigQuery for quarterly expedite-spend reporting.](/queries/supplier-commit-audit-logging.md)
