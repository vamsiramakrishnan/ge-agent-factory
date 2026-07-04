---
type: Proof Obligation
title: "Golden eval obligation — Run the Wealth Client Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-wealth-client-onboarding-orchestrator-end-to-end"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Wealth Client Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [wealth-client-onboarding-orchestrator-end-to-end](/tests/wealth-client-onboarding-orchestrator-end-to-end.md)


## Mechanisms

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

## Entities that must be referenced

- client_households
- analytics_events
- envelopes
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [wealth-client-onboarding-orchestrator-compliance-policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
