---
type: Query Capability
title: Route classified violations to control owners. Track remediation and update c...
description: Route classified violations to control owners. Track remediation and update control effectiveness metrics.
source_id: "alert-track"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Route classified violations to control owners. Track remediation and update control effectiveness metrics.

## Tools used

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)

## Runs in

- [alert_track](/workflow/alert-track.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/continuous-controls-monitor-end-to-end.md)

# Citations

- [Continuous Controls Monitor Controls Playbook](/documents/continuous-controls-monitor-controls-playbook.md)
