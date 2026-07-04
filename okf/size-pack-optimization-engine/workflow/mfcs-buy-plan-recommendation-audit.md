---
type: Workflow Stage
title: "MFCS Buy-Plan Recommendation & Audit"
description: "Execute action_oracle_retail_mfcs_recommend to push the optimized size-pack ratio into the Oracle Retail MFCS buy plan ahead of PO cut, emitting a generated_audit_trail record."
source_id: mfcs_buy_plan_recommendation_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# MFCS Buy-Plan Recommendation & Audit

Execute action_oracle_retail_mfcs_recommend to push the optimized size-pack ratio into the Oracle Retail MFCS buy plan ahead of PO cut, emitting a generated_audit_trail record.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_recommend](/tools/action-oracle-retail-mfcs-recommend.md)

Next: [In-Season Divergence Monitoring](/workflow/in-season-divergence-monitoring.md)
