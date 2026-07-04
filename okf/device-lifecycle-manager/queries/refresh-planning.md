---
type: Query Capability
title: "Gemini generates a phased refresh plan considering failure risk, team critica..."
description: "Gemini generates a phased refresh plan considering failure risk, team criticality, budget constraints, and procurement lead times. Prioritizes high-risk, high-impact devices."
source_id: "refresh-planning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates a phased refresh plan considering failure risk, team criticality, budget constraints, and procurement lead times. Prioritizes high-risk, high-impact devices.

## Tools used

- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)
- [action_manageengine_generate](/tools/action-manageengine-generate.md)

## Runs in

- [refresh_planning](/workflow/refresh-planning.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/device-lifecycle-manager-end-to-end.md)

# Citations

- [Device Lifecycle Manager Operations Runbook](/documents/device-lifecycle-manager-runbook.md)
