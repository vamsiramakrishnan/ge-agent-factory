---
type: Query Capability
title: "Generate reconciliation workpapers with auto-certification for standard accou..."
description: "Generate reconciliation workpapers with auto-certification for standard accounts and exception flags for Controller review on material accounts."
source_id: "workpaper-generation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate reconciliation workpapers with auto-certification for standard accounts and exception flags for Controller review on material accounts.

## Tools used

- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)

## Runs in

- [workpaper_generation](/workflow/workpaper-generation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-reconciliation-agent-end-to-end.md)

# Citations

- [Account Reconciliation Agent Controls Playbook](/documents/account-reconciliation-agent-controls-playbook.md)
