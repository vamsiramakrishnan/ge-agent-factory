---
type: Query Capability
title: "Pull all open tickets with SLA timers, current assignment status, and ticket ..."
description: "Pull all open tickets with SLA timers, current assignment status, and ticket age. Calculate time remaining to breach for each SLA target (response, update, resolution)."
source_id: "queue-scanning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull all open tickets with SLA timers, current assignment status, and ticket age. Calculate time remaining to breach for each SLA target (response, update, resolution).

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)

## Runs in

- [queue_scanning](/workflow/queue-scanning.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sla-breach-predictor-end-to-end.md)

# Citations

- [SLA Breach Predictor Operations Runbook](/documents/sla-breach-predictor-runbook.md)
