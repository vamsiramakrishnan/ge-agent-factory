---
type: Workflow Stage
title: "Pack Ratio & Rounding Reconciliation"
description: "Translate the fitted size curve into a case-pack ratio, checking case_pack on item_master and bracket_quantity on cost_changes in Oracle Retail MFCS so the rounded pack stays inside the vendor's negotiated pricing tier."
source_id: pack_ratio_rounding_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pack Ratio & Rounding Reconciliation

Translate the fitted size curve into a case-pack ratio, checking case_pack on item_master and bracket_quantity on cost_changes in Oracle Retail MFCS so the rounded pack stays inside the vendor's negotiated pricing tier.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_recommend](/tools/action-oracle-retail-mfcs-recommend.md)

Next: [Playbook Evidence Gate](/workflow/playbook-evidence-gate.md)
