---
type: Query Capability
title: "If self-service fails, create ServiceNow ticket with full conversation contex..."
description: "If self-service fails, create ServiceNow ticket with full conversation context for human agent. Log resolution patterns to improve future auto-resolution."
source_id: "escalation-learning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# If self-service fails, create ServiceNow ticket with full conversation context for human agent. Log resolution patterns to improve future auto-resolution.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_self_service_it_bot_runbook](/tools/lookup-self-service-it-bot-runbook.md)

## Runs in

- [escalation_learning](/workflow/escalation-learning.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/self-service-it-bot-end-to-end.md)

# Citations

- [Self-Service IT Bot Operations Runbook](/documents/self-service-it-bot-runbook.md)
