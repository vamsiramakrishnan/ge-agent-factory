---
type: Proof Obligation
title: "Golden eval obligation — Household 6041288's account 80417723 (rollover_401k) had its DocuSign envelope rejected NIGO twice this week -- the custodian cites a missing spousal consent on today's third resubmission -- but Salesforce Financial Services Cloud still shows the account as 'active' with the ACAT transfer marked complete in yesterday's BigQuery analytics_events snapshot. Reconcile the record and tell me whether we can publish the funded status to the advisor."
description: golden eval proof obligation
source_id: "eval-wealth-client-onboarding-orchestrator-nigo-resubmission-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Household 6041288's account 80417723 (rollover_401k) had its DocuSign envelope rejected NIGO twice this week -- the custodian cites a missing spousal consent on today's third resubmission -- but Salesforce Financial Services Cloud still shows the account as 'active' with the ACAT transfer marked complete in yesterday's BigQuery analytics_events snapshot. Reconcile the record and tell me whether we can publish the funded status to the advisor.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [wealth-client-onboarding-orchestrator-nigo-resubmission-conflict](/tests/wealth-client-onboarding-orchestrator-nigo-resubmission-conflict.md)


## Mechanisms

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)

## Entities that must be referenced

- financial_accounts
- envelopes
- analytics_events

## Forbidden behaviors

- publishing a funded status without a matching DocuSign audit_trails confirmation
- treating the BigQuery analytics_events snapshot as authoritative over an unresolved custodian rejection

# Citations

- [wealth-client-onboarding-orchestrator-compliance-policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
- [wealth-client-onboarding-orchestrator-acat-nigo-runbook](/documents/wealth-client-onboarding-orchestrator-acat-nigo-runbook.md)
