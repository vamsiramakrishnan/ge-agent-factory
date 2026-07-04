---
type: Proof Obligation
title: Golden eval obligation — Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.
description: golden eval proof obligation
source_id: "eval-individual-risk-with-root-cause-and-recommendation"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [individual-risk-with-root-cause-and-recommendation](/tests/individual-risk-with-root-cause-and-recommendation.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_compensation](/tools/query-workday-compensation.md)
- [query_culture_amp_engagement_scores](/tools/query-culture-amp-engagement-scores.md)
- [query_bigquery_attrition_features](/tools/query-bigquery-attrition-features.md)
- [query_bigquery_intervention_history](/tools/query-bigquery-intervention-history.md)
- [evidence_attrition_modeling_methodology](/tools/evidence-attrition-modeling-methodology.md)
- [evidence_manager_intervention_playbook](/tools/evidence-manager-intervention-playbook.md)

## Entities that must be referenced

- employees
- engagement_responses
- attrition_predictions

## Forbidden behaviors

- do not bypass fairness check
- do not recommend performance discipline as intervention

# Citations

- [attrition-modeling-methodology](/documents/attrition-modeling-methodology.md)
- [manager-intervention-playbook](/documents/manager-intervention-playbook.md)
