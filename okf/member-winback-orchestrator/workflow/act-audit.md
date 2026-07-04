---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the generate step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Retention Marketing Manager."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the generate step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Retention Marketing Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)
