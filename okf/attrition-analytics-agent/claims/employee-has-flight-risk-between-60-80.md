---
type: Claim
title: "Employee has flight risk between 60-80%"
description: "Evidence-backed claim: Employee has flight risk between 60-80%"
source_id: "employee-has-flight-risk-between-60-80"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.0
generation_status: generated
ge_status: generated
---

# Employee has flight risk between 60-80%

## Authority

- [bigquery](/systems/bigquery.md)
- [workday](/systems/workday.md)

## Required Evidence

- attrition_predictions.risk_score
- attrition_features.tenure_months
- attrition_features.engagement_trend
- model-features

## Citation Requirements

Must cite: attrition_predictions.risk_score, attrition_features.tenure_months, attrition_features.engagement_trend, model-features

## Proof obligations

- [Evidence obligation — Employee has flight risk between 60-80%](/proof-obligations/evidence-employee-has-flight-risk-between-60-80.md)

# Citations

- [Attrition Prediction Model Methodology & Fairness Audit](/documents/attrition-modeling-methodology.md)
- [Manager Intervention Playbook for High-Risk Attrition Scenarios](/documents/manager-intervention-playbook.md)
