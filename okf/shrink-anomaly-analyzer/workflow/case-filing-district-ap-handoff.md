---
type: Workflow Stage
title: "Case Filing & District AP Handoff"
description: "Execute the file step in Oracle Xstore POS with a full audit trail, and route confirmed cases to the Loss Prevention Manager or escalate to the district asset protection manager per trigger."
source_id: case_filing_district_ap_handoff
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case Filing & District AP Handoff

Execute the file step in Oracle Xstore POS with a full audit trail, and route confirmed cases to the Loss Prevention Manager or escalate to the district asset protection manager per trigger.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)
