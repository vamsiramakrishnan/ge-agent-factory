---
type: Workflow Stage
title: "Corrective Task Assignment & Chronic-Non-Compliance Escalation"
description: "Execute the escalate action in Oracle Retail MFCS to open corrective tasks for store teams, with full audit trail, and escalate chronic non-compliance patterns to the Planogram Manager."
source_id: corrective_task_assignment_chronic_non_compliance_escalation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Corrective Task Assignment & Chronic-Non-Compliance Escalation

Execute the escalate action in Oracle Retail MFCS to open corrective tasks for store teams, with full audit trail, and escalate chronic non-compliance patterns to the Planogram Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)
