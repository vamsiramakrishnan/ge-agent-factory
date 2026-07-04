---
type: Proof Obligation
title: "Golden eval obligation — Run the Early Delinquency Outreach Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-early-delinquency-outreach-orchestrator-end-to-end"
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

# Golden eval obligation — Run the Early Delinquency Outreach Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [early-delinquency-outreach-orchestrator-end-to-end](/tests/early-delinquency-outreach-orchestrator-end-to-end.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

## Entities that must be referenced

- loan_applications
- analytics_events
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [early-delinquency-outreach-orchestrator-compliance-policy](/documents/early-delinquency-outreach-orchestrator-compliance-policy.md)
