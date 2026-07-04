---
type: Query Capability
title: "Route approved communication via email or CRM. Track open, read, and response..."
description: "Route approved communication via email or CRM. Track open, read, and response events. Feed response data back for model improvement."
source_id: "delivery-tracking"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Route approved communication via email or CRM. Track open, read, and response events. Feed response data back for model improvement.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)

## Runs in

- [delivery_tracking](/workflow/delivery-tracking.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dunning-communication-drafter-end-to-end.md)

# Citations

- [Dunning Communication Drafter Controls Playbook](/documents/dunning-communication-drafter-controls-playbook.md)
