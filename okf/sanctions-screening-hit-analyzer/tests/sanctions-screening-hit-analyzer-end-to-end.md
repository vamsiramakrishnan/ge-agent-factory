---
type: Eval Scenario
title: Run the Sanctions Screening Hit Analyzer workflow for the current period. Cit...
description: "Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sanctions-screening-hit-analyzer-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)

## Success rubric

Action escalate executed against Fenergo CLM, with audit-trail entry and Sanctions Screening Analyst notified of outcomes.

# Citations

- [Sanctions Screening Hit Analyzer Banking Compliance Policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
