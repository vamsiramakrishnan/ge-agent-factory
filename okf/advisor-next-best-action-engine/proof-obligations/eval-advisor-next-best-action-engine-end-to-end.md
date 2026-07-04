---
type: Proof Obligation
title: "Golden eval obligation — Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-advisor-next-best-action-engine-end-to-end"
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

# Golden eval obligation — Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [advisor-next-best-action-engine-end-to-end](/tests/advisor-next-best-action-engine-end-to-end.md)


## Mechanisms

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

## Entities that must be referenced

- client_households
- analytics_events
- banking_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [advisor-next-best-action-engine-compliance-policy](/documents/advisor-next-best-action-engine-compliance-policy.md)
