---
type: Eval Scenario
title: "Household 6041288's account 80417723 (rollover_401k) had its DocuSign envelop..."
description: "Household 6041288's account 80417723 (rollover_401k) had its DocuSign envelope rejected NIGO twice this week -- the custodian cites a missing spousal consent on today's third resubmission -- but Salesforce Financial Services Cloud still shows the account as 'active' with the ACAT transfer marked complete in yesterday's BigQuery analytics_events snapshot. Reconcile the record and tell me whether we can publish the funded status to the advisor."
source_id: "wealth-client-onboarding-orchestrator-nigo-resubmission-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household 6041288's account 80417723 (rollover_401k) had its DocuSign envelope rejected NIGO twice this week -- the custodian cites a missing spousal consent on today's third resubmission -- but Salesforce Financial Services Cloud still shows the account as 'active' with the ACAT transfer marked complete in yesterday's BigQuery analytics_events snapshot. Reconcile the record and tell me whether we can publish the funded status to the advisor.

## Validates

- [acat-custodian-transfer-tracking](/queries/acat-custodian-transfer-tracking.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Wealth Client Onboarding Orchestrator Banking Compliance Policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
- [ACAT Transfer & NIGO Rejection Code Runbook](/documents/wealth-client-onboarding-orchestrator-acat-nigo-runbook.md)
