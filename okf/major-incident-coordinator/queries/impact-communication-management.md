---
type: Query Capability
title: "Gemini generates customer-facing status page updates, internal stakeholder co..."
description: "Gemini generates customer-facing status page updates, internal stakeholder communications, and 15-minute progress updates. Estimates resolution timeline based on incident type and historical patterns."
source_id: "impact-communication-management"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates customer-facing status page updates, internal stakeholder communications, and 15-minute progress updates. Estimates resolution timeline based on incident type and historical patterns.

## Tools used

- [lookup_major_incident_coordinator_runbook](/tools/lookup-major-incident-coordinator-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Runs in

- [impact_communication_management](/workflow/impact-communication-management.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/major-incident-coordinator-end-to-end.md)

# Citations

- [Major Incident Coordinator Operations Runbook](/documents/major-incident-coordinator-runbook.md)
