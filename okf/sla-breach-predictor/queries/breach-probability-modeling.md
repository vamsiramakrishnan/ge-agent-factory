---
type: Query Capability
title: "Predict resolution time based on ticket complexity (text length, attachments,..."
description: "Predict resolution time based on ticket complexity (text length, attachments, category), assignee workload, and historical patterns for similar tickets."
source_id: "breach-probability-modeling"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Predict resolution time based on ticket complexity (text length, attachments, category), assignee workload, and historical patterns for similar tickets.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)

## Runs in

- [breach_probability_modeling](/workflow/breach-probability-modeling.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sla-breach-predictor-end-to-end.md)

# Citations

- [SLA Breach Predictor Operations Runbook](/documents/sla-breach-predictor-runbook.md)
