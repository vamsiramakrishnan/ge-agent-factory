---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull client_households (contracted breakpoint schedule, primary_advisor, risk_tolerance) and financial_accounts (market_value, discretionary_managed, registration_type) from Salesforce Financial Services Cloud via query_salesforce_financial_services_cloud_client_households, then recompute each account's expected advisory fee against the household's breakpoint schedule and householding rules.](/queries/fee-schedule-householding-recompute.md)
- [Compare the recomputed expected fee to the quarter's actual billed fee run captured in BigQuery analytics_events via query_bigquery_analytics_events, and to historical_metrics baselines, surfacing every account where variance_pct exceeds the reconciliation tolerance.](/queries/actual-fee-run-reconciliation.md)
- [Classify each flagged financial_accounts discrepancy by root cause -- breakpoint miss, mis-grouped household, stale registration_type, or an unposted advisor-negotiated exception -- using cached_aggregates context, and prioritize the Advisory Operations Manager's exception queue ahead of invoice release.](/queries/root-cause-exception-classification.md)
- [Cross-check every flagged exception and any claimed fee exception against the Advisory Fee Billing Anomaly Analyzer Banking Compliance Policy and the Advisory Fee Schedule & Breakpoint Rate Manual via lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy, citing the governing sections before any recommendation is issued.](/queries/compliance-rate-manual-citation-gate.md)
- [Execute action_salesforce_financial_services_cloud_publish to release the quarterly billing-accuracy attestation in Salesforce Financial Services Cloud with a full audit trail, publish exception trends to Looker dashboards and metric_definitions, and escalate unresolved items to the Advisory Operations Manager.](/queries/attestation-publish-looker-reporting.md)
