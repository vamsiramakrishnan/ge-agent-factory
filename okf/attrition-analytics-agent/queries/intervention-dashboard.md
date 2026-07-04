---
type: Query Capability
title: Publish risk heatmaps and intervention recommendations in Looker. Track reten...
description: Publish risk heatmaps and intervention recommendations in Looker. Track retention action effectiveness and ROI per intervention type.
source_id: "intervention-dashboard"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Publish risk heatmaps and intervention recommendations in Looker. Track retention action effectiveness and ROI per intervention type.

## Tools used

- [query_bigquery_intervention_history](/tools/query-bigquery-intervention-history.md)
- [action_looker_publish_attrition_dashboard](/tools/action-looker-publish-attrition-dashboard.md)
- [action_looker_publish_intervention_recommendations](/tools/action-looker-publish-intervention-recommendations.md)
- [evidence_manager_intervention_playbook](/tools/evidence-manager-intervention-playbook.md)

## Runs in

- [intervention_dashboard](/workflow/intervention-dashboard.md)

## Evidence expected

- sql_result
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)
- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)

# Citations

- [Attrition Prediction Model Methodology & Fairness Audit](/documents/attrition-modeling-methodology.md)
- [Manager Intervention Playbook for High-Risk Attrition Scenarios](/documents/manager-intervention-playbook.md)
