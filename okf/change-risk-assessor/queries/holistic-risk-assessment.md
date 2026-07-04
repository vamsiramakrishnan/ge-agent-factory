---
type: Query Capability
title: "Gemini assesses change risk holistically — considering dependency chains, act..."
description: "Gemini assesses change risk holistically — considering dependency chains, active feature flags, deployment window risks, and rollback plan completeness. Recommends optimal deployment timing."
source_id: "holistic-risk-assessment"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini assesses change risk holistically — considering dependency chains, active feature flags, deployment window risks, and rollback plan completeness. Recommends optimal deployment timing.

## Tools used

- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [holistic_risk_assessment](/workflow/holistic-risk-assessment.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-risk-assessor-end-to-end.md)

# Citations

- [Change Risk Assessor Operations Runbook](/documents/change-risk-assessor-runbook.md)
