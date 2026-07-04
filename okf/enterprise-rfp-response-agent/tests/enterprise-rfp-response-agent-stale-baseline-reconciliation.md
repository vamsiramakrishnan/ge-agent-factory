---
type: Eval Scenario
title: "RFP-2026-0417 for Meridian Health Systems requires us to certify a 99.9% netw..."
description: "RFP-2026-0417 for Meridian Health Systems requires us to certify a 99.9% network uptime SLA on the enterprise_dia_100m bundle referenced in service quote SQ-24887215 (mrr_usd 6,400, term_36). The account team wants to cite subscriber account SA-3124890177's low churn_risk_score and the BigQuery uptime baseline in the response, but the last historical_metrics refresh is dated 2026-05-02 (more than 60 days old) and analytics_events shows a variance_pct of -18% against baseline for that period. Draft the compliance-matrix answer for this SLA line item."
source_id: "enterprise-rfp-response-agent-stale-baseline-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# RFP-2026-0417 for Meridian Health Systems requires us to certify a 99.9% network uptime SLA on the enterprise_dia_100m bundle referenced in service quote SQ-24887215 (mrr_usd 6,400, term_36). The account team wants to cite subscriber account SA-3124890177's low churn_risk_score and the BigQuery uptime baseline in the response, but the last historical_metrics refresh is dated 2026-05-02 (more than 60 days old) and analytics_events shows a variance_pct of -18% against baseline for that period. Draft the compliance-matrix answer for this SLA line item.

## Validates

- [response-assembly-submission-audit](/queries/response-assembly-submission-audit.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Enterprise RFP Response Agent Service Assurance Runbook](/documents/enterprise-rfp-response-agent-assurance-runbook.md)
