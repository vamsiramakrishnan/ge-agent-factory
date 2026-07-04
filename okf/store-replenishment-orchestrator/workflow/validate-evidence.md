---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the Store Replenishment Orchestrator Retail Execution Playbook and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the Store Replenishment Orchestrator Retail Execution Playbook and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

Next: [Act & Audit](/workflow/act-audit.md)
