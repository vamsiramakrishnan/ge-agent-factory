---
type: Query Capability
title: Gemini traces each material discrepancy to its source document — was it a man...
description: "Gemini traces each material discrepancy to its source document — was it a manual reclassification that should have been in R&D? A posting to the wrong GL account? Generates the correcting entry."
source_id: "root-cause-tracing"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini traces each material discrepancy to its source document — was it a manual reclassification that should have been in R&D? A posting to the wrong GL account? Generates the correcting entry.

## Tools used

- [action_sap_s_4hana_co_fi_generate](/tools/action-sap-s-4hana-co-fi-generate.md)

## Runs in

- [root_cause_tracing](/workflow/root-cause-tracing.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cogs-reconciliation-agent-end-to-end.md)

# Citations

- [COGS Reconciliation Agent Controls Playbook](/documents/cogs-reconciliation-agent-controls-playbook.md)
