---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)
