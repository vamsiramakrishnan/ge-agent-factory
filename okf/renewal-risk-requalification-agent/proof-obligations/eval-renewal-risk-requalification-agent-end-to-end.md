---
type: Proof Obligation
title: "Golden eval obligation — Run the Renewal Risk Requalification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-renewal-risk-requalification-agent-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Renewal Risk Requalification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [renewal-risk-requalification-agent-end-to-end](/tests/renewal-risk-requalification-agent-end-to-end.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

## Entities that must be referenced

- policies
- risk_reports
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [renewal-risk-requalification-agent-authority-guide](/documents/renewal-risk-requalification-agent-authority-guide.md)
