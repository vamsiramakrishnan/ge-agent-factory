---
type: Proof Obligation
title: "Golden eval obligation — Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-aml-alert-investigation-agent-end-to-end"
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

# Golden eval obligation — Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [aml-alert-investigation-agent-end-to-end](/tests/aml-alert-investigation-agent-end-to-end.md)


## Mechanisms

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

## Entities that must be referenced

- fraud_alerts
- analytics_events
- banking_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [aml-alert-investigation-agent-compliance-policy](/documents/aml-alert-investigation-agent-compliance-policy.md)
