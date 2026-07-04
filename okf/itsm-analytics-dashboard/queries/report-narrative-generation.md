---
type: Query Capability
title: "Gemini generates human-readable weekly report explaining trends, calling out ..."
description: "Gemini generates human-readable weekly report explaining trends, calling out anomalies, and recommending actions. Separates signal from noise — 'ticket volume up 15% due to MFA rollout, underlying volume flat.'"
source_id: "report-narrative-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates human-readable weekly report explaining trends, calling out anomalies, and recommending actions. Separates signal from noise — 'ticket volume up 15% due to MFA rollout, underlying volume flat.'

## Tools used

- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Runs in

- [report_narrative_generation](/workflow/report-narrative-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the ITSM Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/itsm-analytics-dashboard-end-to-end.md)

# Citations

- [ITSM Analytics Dashboard Operations Runbook](/documents/itsm-analytics-dashboard-runbook.md)
