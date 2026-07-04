---
type: Query Capability
title: "Risk assessment formatted for Change Advisory Board review. High-risk changes..."
description: "Risk assessment formatted for Change Advisory Board review. High-risk changes flagged with specific concerns and recommended mitigations."
source_id: "cab-preparation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Risk assessment formatted for Change Advisory Board review. High-risk changes flagged with specific concerns and recommended mitigations.

## Tools used

- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [cab_preparation](/workflow/cab-preparation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-risk-assessor-end-to-end.md)

# Citations

- [Change Risk Assessor Operations Runbook](/documents/change-risk-assessor-runbook.md)
