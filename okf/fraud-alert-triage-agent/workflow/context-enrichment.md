---
type: Workflow Stage
title: Context Enrichment
description: "Correlate the account_number against BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) and cross-check open ServiceNow tickets (query_servicenow_tickets) for recent contact-center interactions or account-servicing activity on the same account."
source_id: context_enrichment
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Context Enrichment

Correlate the account_number against BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) and cross-check open ServiceNow tickets (query_servicenow_tickets) for recent contact-center interactions or account-servicing activity on the same account.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)

Next: [Typology & Disposition Scoring](/workflow/typology-disposition-scoring.md)
