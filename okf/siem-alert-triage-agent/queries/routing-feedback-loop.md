---
type: Query Capability
title: "Confirmed incidents routed to investigation workflow. Auto-closed alerts logg..."
description: "Confirmed incidents routed to investigation workflow. Auto-closed alerts logged for model improvement. Analyst feedback captured to improve future triage accuracy."
source_id: "routing-feedback-loop"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Confirmed incidents routed to investigation workflow. Auto-closed alerts logged for model improvement. Analyst feedback captured to improve future triage accuracy.

## Tools used

- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

## Runs in

- [routing_feedback_loop](/workflow/routing-feedback-loop.md)

## Evidence expected

- document_reference

## Evals

- [Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siem-alert-triage-agent-end-to-end.md)

# Citations

- [SIEM Alert Triage Agent Operations Runbook](/documents/siem-alert-triage-agent-runbook.md)
