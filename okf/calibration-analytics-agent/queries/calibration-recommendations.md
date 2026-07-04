---
type: Query Capability
title: "Gemini generates data-backed calibration suggestions anchored in objective ev..."
description: "Gemini generates data-backed calibration suggestions anchored in objective evidence. Surfaces specific manager patterns and equity concerns."
source_id: "calibration-recommendations"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates data-backed calibration suggestions anchored in objective evidence. Surfaces specific manager patterns and equity concerns.

## Tools used

- [lookup_calibration_analytics_agent_policy_handbook](/tools/lookup-calibration-analytics-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Runs in

- [calibration_recommendations](/workflow/calibration-recommendations.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Calibration Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/calibration-analytics-agent-end-to-end.md)

# Citations

- [Calibration Analytics Agent Policy Handbook](/documents/calibration-analytics-agent-policy-handbook.md)
