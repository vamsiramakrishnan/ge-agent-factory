---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Planogram Manager."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Oracle Retail MFCS with a full audit trail, and escalate exceptions to the Planogram Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)
