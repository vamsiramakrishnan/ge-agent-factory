---
type: Query Capability
title: "Gemini identifies ticket clusters related to systemic issues (ISP outages, so..."
description: "Gemini identifies ticket clusters related to systemic issues (ISP outages, software rollouts) and recommends bulk actions like mass communication or temporary SLA pauses."
source_id: "systemic-correlation-recommendations"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini identifies ticket clusters related to systemic issues (ISP outages, software rollouts) and recommends bulk actions like mass communication or temporary SLA pauses.

## Tools used

- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [systemic_correlation_recommendations](/workflow/systemic-correlation-recommendations.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sla-breach-predictor-end-to-end.md)

# Citations

- [SLA Breach Predictor Operations Runbook](/documents/sla-breach-predictor-runbook.md)
