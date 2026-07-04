---
type: Workflow Stage
title: "Compliance Matrix & Gap Detection"
description: "Compare current mrr_usd, discount_pct, and contract_term commitments in service_quotes against BigQuery historical_metrics and analytics_events baselines to auto-build the compliance matrix, scoring each mandatory requirement the standard portfolio cannot meet."
source_id: compliance_matrix_gap_detection
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compliance Matrix & Gap Detection

Compare current mrr_usd, discount_pct, and contract_term commitments in service_quotes against BigQuery historical_metrics and analytics_events baselines to auto-build the compliance matrix, scoring each mandatory requirement the standard portfolio cannot meet.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)

Next: [Exception Routing & SME Sign-off](/workflow/exception-routing-sme-sign-off.md)
