---
type: Query Capability
title: "Gemini stratifies employees into risk tiers with human-readable driver explan..."
description: "Gemini stratifies employees into risk tiers with human-readable driver explanations. Identifies systemic patterns versus individual risk factors for appropriate intervention level."
source_id: "risk-stratification"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini stratifies employees into risk tiers with human-readable driver explanations. Identifies systemic patterns versus individual risk factors for appropriate intervention level.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_attrition_prediction_intervention_policy_handbook](/tools/lookup-attrition-prediction-intervention-policy-handbook.md)

## Runs in

- [risk_stratification](/workflow/risk-stratification.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Attrition Prediction & Intervention workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/attrition-prediction-intervention-end-to-end.md)

# Citations

- [Attrition Prediction & Intervention Policy Handbook](/documents/attrition-prediction-intervention-policy-handbook.md)
