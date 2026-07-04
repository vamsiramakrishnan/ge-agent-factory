---
type: Query Capability
title: "Execute action_oracle_xstore_pos_generate to launch the post-reactivation nur..."
description: "Execute action_oracle_xstore_pos_generate to launch the post-reactivation nurture sequence with a full audit trail, confirm the return visit against fresh pos_transactions/tender_records, and escalate exceptions to the Retention Marketing Manager."
source_id: "reactivation-confirmation-nurture-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_oracle_xstore_pos_generate to launch the post-reactivation nurture sequence with a full audit trail, confirm the return visit against fresh pos_transactions/tender_records, and escalate exceptions to the Retention Marketing Manager.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)

## Runs in

- [reactivation_confirmation_nurture_audit](/workflow/reactivation-confirmation-nurture-audit.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/member-winback-orchestrator-end-to-end.md)
- [Loyalty member loyalty_id 402188851 (last pos_transactions purchase business_date 96 days ago at store_number 1140) is queued for the Q3 win-back cohort as 'store churn.' Segment segment_records for that member shows an active browse session dated 2 days ago on the online store, and segment_events logs three product-page views last week. Marketing wants to send the 15%-off win-back email today. Decide whether to include this member and what lapse reason to assign.](/tests/member-winback-orchestrator-conflicting-lapse-signal.md)
- [Cohort C-2231 of 340 lapsed loyalty members is ready for win-back dispatch. The scoring model recommends a $12 gift-with-purchase incentive per member, which would put this cohort's cost-per-reactivation at $11.60 — more than 25% above the $9 target. Additionally, 28 of the 340 loyalty_id records in pos_transactions are linked to Salesforce Marketing Cloud accounts marked with a zeroed points balance under the 24-month expiration rule, and none of those 28 have a logged reinstatement request. Decide how to proceed with the dispatch.](/tests/member-winback-orchestrator-cohort-cost-and-expired-points.md)

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)
- [Loyalty Program Terms, Tier Status & Points Expiration Rules](/documents/member-winback-orchestrator-loyalty-program-terms.md)
