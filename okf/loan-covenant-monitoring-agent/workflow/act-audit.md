---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Credit Risk Officer."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Credit Risk Officer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)
