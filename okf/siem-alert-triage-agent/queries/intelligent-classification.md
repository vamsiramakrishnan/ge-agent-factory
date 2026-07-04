---
type: Query Capability
title: Gemini reasons about alert legitimacy by comparing enriched context against k...
description: "Gemini reasons about alert legitimacy by comparing enriched context against known benign patterns and historical analyst decisions. Provides evidence-based triage recommendation."
source_id: "intelligent-classification"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reasons about alert legitimacy by comparing enriched context against known benign patterns and historical analyst decisions. Provides evidence-based triage recommendation.

## Tools used

- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

## Runs in

- [intelligent_classification](/workflow/intelligent-classification.md)

## Evidence expected

- document_reference

## Evals

- [Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siem-alert-triage-agent-end-to-end.md)

# Citations

- [SIEM Alert Triage Agent Operations Runbook](/documents/siem-alert-triage-agent-runbook.md)
