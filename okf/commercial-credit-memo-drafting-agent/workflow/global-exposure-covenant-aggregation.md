---
type: Workflow Stage
title: "Global Exposure & Covenant Aggregation"
description: "Aggregate obligor-level committed exposure and covenant_records compliance_status from nCino, cross-referencing banking_3_records via query_banking_3_banking_3_records to compute the borrower's aggregate exposure against the house limit."
source_id: global_exposure_covenant_aggregation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Global Exposure & Covenant Aggregation

Aggregate obligor-level committed exposure and covenant_records compliance_status from nCino, cross-referencing banking_3_records via query_banking_3_banking_3_records to compute the borrower's aggregate exposure against the house limit.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)

Next: [Policy & Authority Threshold Screening](/workflow/policy-authority-threshold-screening.md)
