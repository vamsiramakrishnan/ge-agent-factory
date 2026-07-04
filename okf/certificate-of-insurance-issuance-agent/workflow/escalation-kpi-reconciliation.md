---
type: Workflow Stage
title: "Escalation & KPI Reconciliation"
description: "Escalate non-standard wording or additional-insured requests via action_duck_creek_policy_escalate to an authorized reviewer, and reconcile COI issuance turnaround and error-rate KPIs against analytics_events and historical_metrics in BigQuery."
source_id: escalation_kpi_reconciliation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & KPI Reconciliation

Escalate non-standard wording or additional-insured requests via action_duck_creek_policy_escalate to an authorized reviewer, and reconcile COI issuance turnaround and error-rate KPIs against analytics_events and historical_metrics in BigQuery.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)
