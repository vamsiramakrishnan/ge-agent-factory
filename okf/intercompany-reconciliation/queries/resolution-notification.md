---
type: Query Capability
title: Post correcting entries and notify responsible entity controllers of actions ...
description: Post correcting entries and notify responsible entity controllers of actions taken and remaining items requiring manual resolution.
source_id: "resolution-notification"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Post correcting entries and notify responsible entity controllers of actions taken and remaining items requiring manual resolution.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)

## Runs in

- [resolution_notification](/workflow/resolution-notification.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-reconciliation-end-to-end.md)

# Citations

- [Intercompany Reconciliation Controls Playbook](/documents/intercompany-reconciliation-controls-playbook.md)
