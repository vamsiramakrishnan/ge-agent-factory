---
type: Query Capability
title: "Generate reconciliation report showing opening break, identified items, and c..."
description: "Generate reconciliation report showing opening break, identified items, and correcting entries. Post approved corrections."
source_id: "reconciliation-posting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate reconciliation report showing opening break, identified items, and correcting entries. Post approved corrections.

## Tools used

- [lookup_cogs_reconciliation_agent_controls_playbook](/tools/lookup-cogs-reconciliation-agent-controls-playbook.md)
- [action_sap_s_4hana_co_fi_generate](/tools/action-sap-s-4hana-co-fi-generate.md)

## Runs in

- [reconciliation_posting](/workflow/reconciliation-posting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cogs-reconciliation-agent-end-to-end.md)

# Citations

- [COGS Reconciliation Agent Controls Playbook](/documents/cogs-reconciliation-agent-controls-playbook.md)
