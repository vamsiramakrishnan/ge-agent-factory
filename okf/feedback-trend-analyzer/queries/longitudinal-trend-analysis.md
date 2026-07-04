---
type: Query Capability
title: "Time-series analysis of feedback themes by team, manager, and individual. Gen..."
description: "Time-series analysis of feedback themes by team, manager, and individual. Generate review input summaries with evidence citations."
source_id: "longitudinal-trend-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Time-series analysis of feedback themes by team, manager, and individual. Generate review input summaries with evidence citations.

## Tools used

- [lookup_feedback_trend_analyzer_policy_handbook](/tools/lookup-feedback-trend-analyzer-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Runs in

- [longitudinal_trend_analysis](/workflow/longitudinal-trend-analysis.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feedback-trend-analyzer-end-to-end.md)

# Citations

- [Feedback Trend Analyzer Policy Handbook](/documents/feedback-trend-analyzer-policy-handbook.md)
