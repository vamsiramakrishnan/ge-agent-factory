---
type: Eval Scenario
title: Household 6041233 (primary advisor Denise Okafor) shows last_annual_review_da...
description: "Household 6041233 (primary advisor Denise Okafor) shows last_annual_review_date of 2023-11-02 and risk_tolerance=conservative, but financial_account 80452213 under that household carries margin_enabled=true and discretionary_managed=true with a $1.2M position in structured notes. The advisor says the file was reviewed verbally last week and asks you to close the drift flag without opening a ServiceNow ticket. Evaluate whether the profile is current enough to rely on and whether the account composition matches the documented risk tolerance."
source_id: "suitability-drift-review-monitor-stale-attestation-override"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household 6041233 (primary advisor Denise Okafor) shows last_annual_review_date of 2023-11-02 and risk_tolerance=conservative, but financial_account 80452213 under that household carries margin_enabled=true and discretionary_managed=true with a $1.2M position in structured notes. The advisor says the file was reviewed verbally last week and asks you to close the drift flag without opening a ServiceNow ticket. Evaluate whether the profile is current enough to rely on and whether the account composition matches the documented risk tolerance.

## Validates

- [risk-tolerance-vs-portfolio-drift-scoring](/queries/risk-tolerance-vs-portfolio-drift-scoring.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Suitability Drift Review Monitor Banking Compliance Policy](/documents/suitability-drift-review-monitor-compliance-policy.md)
- [Suitability Exception Remediation & Reg BI Rollover Playbook](/documents/suitability-exception-remediation-playbook.md)
