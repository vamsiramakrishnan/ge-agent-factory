---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the generate step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Trade Promotions Analyst."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the generate step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Trade Promotions Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)
- [action_oracle_retail_mfcs_generate](/tools/action-oracle-retail-mfcs-generate.md)
