---
type: Query Capability
title: "Gemini investigates mismatches that aren't simple timing differences. Traces ..."
description: "Gemini investigates mismatches that aren't simple timing differences. Traces discrepancies to contract amendments, unprocessed entries, or FX differences. Generates correcting entries."
source_id: "mismatch-investigation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini investigates mismatches that aren't simple timing differences. Traces discrepancies to contract amendments, unprocessed entries, or FX differences. Generates correcting entries.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [mismatch_investigation](/workflow/mismatch-investigation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-reconciliation-end-to-end.md)

# Citations

- [Intercompany Reconciliation Controls Playbook](/documents/intercompany-reconciliation-controls-playbook.md)
