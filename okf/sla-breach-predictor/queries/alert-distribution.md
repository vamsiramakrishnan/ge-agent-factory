---
type: Query Capability
title: Priority alerts sent to Service Desk Manager with recommended actions. Track ...
description: "Priority alerts sent to Service Desk Manager with recommended actions. Track intervention effectiveness — did the manager's action prevent the breach?"
source_id: "alert-distribution"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Priority alerts sent to Service Desk Manager with recommended actions. Track intervention effectiveness — did the manager's action prevent the breach?

## Tools used

- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [alert_distribution](/workflow/alert-distribution.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sla-breach-predictor-end-to-end.md)

# Citations

- [SLA Breach Predictor Operations Runbook](/documents/sla-breach-predictor-runbook.md)
