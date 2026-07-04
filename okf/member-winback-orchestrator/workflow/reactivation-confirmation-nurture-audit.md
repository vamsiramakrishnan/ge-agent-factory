---
type: Workflow Stage
title: "Reactivation Confirmation & Nurture Audit"
description: "Execute action_oracle_xstore_pos_generate to launch the post-reactivation nurture sequence with a full audit trail, confirm the return visit against fresh pos_transactions/tender_records, and escalate exceptions to the Retention Marketing Manager."
source_id: reactivation_confirmation_nurture_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reactivation Confirmation & Nurture Audit

Execute action_oracle_xstore_pos_generate to launch the post-reactivation nurture sequence with a full audit trail, confirm the return visit against fresh pos_transactions/tender_records, and escalate exceptions to the Retention Marketing Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)
