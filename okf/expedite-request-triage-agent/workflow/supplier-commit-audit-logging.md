---
type: Workflow Stage
title: "Supplier Commit & Audit Logging"
description: "Execute the approve step in SAP S/4HANA MM (action_sap_s_4hana_mm_approve), draft the supplier expedite communication for approved requests, and log cost and outcome to BigQuery for quarterly expedite-spend reporting."
source_id: supplier_commit_audit_logging
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Supplier Commit & Audit Logging

Execute the approve step in SAP S/4HANA MM (action_sap_s_4hana_mm_approve), draft the supplier expedite communication for approved requests, and log cost and outcome to BigQuery for quarterly expedite-spend reporting.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)
- [action_sap_s_4hana_mm_approve](/tools/action-sap-s-4hana-mm-approve.md)
