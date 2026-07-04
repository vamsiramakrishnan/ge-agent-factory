---
type: Query Capability
title: "Execute the file step in Oracle Xstore POS with a full audit trail, and route..."
description: "Execute the file step in Oracle Xstore POS with a full audit trail, and route confirmed cases to the Loss Prevention Manager or escalate to the district asset protection manager per trigger."
source_id: "case-filing-district-ap-handoff"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in Oracle Xstore POS with a full audit trail, and route confirmed cases to the Loss Prevention Manager or escalate to the district asset protection manager per trigger.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

## Runs in

- [case_filing_district_ap_handoff](/workflow/case-filing-district-ap-handoff.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shrink-anomaly-analyzer-end-to-end.md)
- [Store 482 register 14 pos_transactions show a discount_amount spike (9 transactions between $60-$75 discount, tender_type credit) for business date 2026-06-28, but the matching bigquery analytics_events record for that store-week shows variance_pct of only 1.8%, under the 2% shrink-variance escalation trigger. Reconcile the conflict and decide whether to escalate to the district asset protection manager.](/tests/shrink-anomaly-analyzer-conflicting-signal-reconciliation.md)

# Citations

- [Shrink Anomaly Analyzer Retail Execution Playbook](/documents/shrink-anomaly-analyzer-execution-playbook.md)
- [Register Cash Accountability & Drawer Audit Standard](/documents/shrink-anomaly-analyzer-cash-drawer-accountability-standard.md)
