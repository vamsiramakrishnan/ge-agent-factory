---
type: Eval Scenario
title: Run the Revenue Leakage Detection Analyzer workflow for the current period. C...
description: "Run the Revenue Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "revenue-leakage-detection-analyzer-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Revenue Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [unbilled-service-detection-provisioning-vs-catalog](/queries/unbilled-service-detection-provisioning-vs-catalog.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)

## Success rubric

Action create executed against Amdocs CES Billing, with audit-trail entry and Revenue Assurance Analyst notified of outcomes.

# Citations

- [Revenue Leakage Detection Analyzer Service Assurance Runbook](/documents/revenue-leakage-detection-analyzer-assurance-runbook.md)
