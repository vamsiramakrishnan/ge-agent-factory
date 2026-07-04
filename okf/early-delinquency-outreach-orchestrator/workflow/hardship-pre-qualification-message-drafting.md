---
type: Workflow Stage
title: "Hardship Pre-Qualification & Message Drafting"
description: "Pre-qualify hardship program options against covenant_records compliance_status and credit_memos guarantor_strength, then draft a compliant outreach message naming the recommended contact channel and time window for each surviving loan_applications record."
source_id: hardship_pre_qualification_message_drafting
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Hardship Pre-Qualification & Message Drafting

Pre-qualify hardship program options against covenant_records compliance_status and credit_memos guarantor_strength, then draft a compliant outreach message naming the recommended contact channel and time window for each surviving loan_applications record.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

Next: [Worklist Assignment & Recommend](/workflow/worklist-assignment-recommend.md)
