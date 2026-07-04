---
type: Workflow Stage
title: "Playbook & Rate-Manual Gate"
description: "Use lookup_store_replenishment_orchestrator_execution_playbook to cite the governing sections of the Store Replenishment Orchestrator Retail Execution Playbook and the Presentation Minimums & Case-Pack Rounding Rate Manual before any parameter recommendation is finalized."
source_id: playbook_rate_manual_gate
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook & Rate-Manual Gate

Use lookup_store_replenishment_orchestrator_execution_playbook to cite the governing sections of the Store Replenishment Orchestrator Retail Execution Playbook and the Presentation Minimums & Case-Pack Rounding Rate Manual before any parameter recommendation is finalized.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

Next: [Parameter Push & Audit](/workflow/parameter-push-audit.md)
