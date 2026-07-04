---
type: Query Capability
title: Deliver exposure summary and hedge recommendations to Treasurer. Alert on thr...
description: "Deliver exposure summary and hedge recommendations to Treasurer. Alert on threshold breaches in real-time. Track hedge execution against recommendations."
source_id: "alert-decision-support"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Deliver exposure summary and hedge recommendations to Treasurer. Alert on threshold breaches in real-time. Track hedge execution against recommendations.

## Tools used

- [lookup_fx_exposure_monitor_controls_playbook](/tools/lookup-fx-exposure-monitor-controls-playbook.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

## Runs in

- [alert_decision_support](/workflow/alert-decision-support.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fx-exposure-monitor-end-to-end.md)

# Citations

- [FX Exposure Monitor Controls Playbook](/documents/fx-exposure-monitor-controls-playbook.md)
