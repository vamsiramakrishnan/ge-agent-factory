---
type: Workflow Stage
title: "Worklist Assignment & Recommend"
description: "Execute action_ncino_loan_origination_recommend to push the prioritized outreach recommendation into nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor for review."
source_id: worklist_assignment_recommend
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Worklist Assignment & Recommend

Execute action_ncino_loan_origination_recommend to push the prioritized outreach recommendation into nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor for review.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)
