---
type: Query Capability
title: "Gemini assesses the real-world impact of each change — distinguishing between..."
description: "Gemini assesses the real-world impact of each change — distinguishing between regulations that require new controls vs. minor policy wording updates. Estimates implementation effort based on gap size."
source_id: "impact-assessment"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini assesses the real-world impact of each change — distinguishing between regulations that require new controls vs. minor policy wording updates. Estimates implementation effort based on gap size.

## Tools used

- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)
- [action_thomson_reuters_update](/tools/action-thomson-reuters-update.md)

## Runs in

- [impact_assessment](/workflow/impact-assessment.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

# Citations

- [Regulatory Change Monitor Operations Runbook](/documents/regulatory-change-monitor-runbook.md)
