---
type: Query Capability
title: "Track resolution progress, generate post-incident timeline, and initiate post..."
description: "Track resolution progress, generate post-incident timeline, and initiate post-mortem process with automated evidence collection."
source_id: "resolution-post-mortem"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track resolution progress, generate post-incident timeline, and initiate post-mortem process with automated evidence collection.

## Tools used

- [lookup_major_incident_coordinator_runbook](/tools/lookup-major-incident-coordinator-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Runs in

- [resolution_post_mortem](/workflow/resolution-post-mortem.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/major-incident-coordinator-end-to-end.md)

# Citations

- [Major Incident Coordinator Operations Runbook](/documents/major-incident-coordinator-runbook.md)
