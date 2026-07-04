---
type: Query Capability
title: "Gemini explains quality degradations with business context — 'email completen..."
description: "Gemini explains quality degradations with business context — 'email completeness dropped from 98% to 91% after the new registration flow made email optional.' Provides remediation recommendations."
source_id: "root-cause-contextualization"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains quality degradations with business context — 'email completeness dropped from 98% to 91% after the new registration flow made email optional.' Provides remediation recommendations.

## Tools used

- [lookup_data_quality_scorecard_runbook](/tools/lookup-data-quality-scorecard-runbook.md)

## Runs in

- [root_cause_contextualization](/workflow/root-cause-contextualization.md)

## Evidence expected

- document_reference

## Evals

- [Run the Data Quality Scorecard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-scorecard-end-to-end.md)

# Citations

- [Data Quality Scorecard Operations Runbook](/documents/data-quality-scorecard-runbook.md)
