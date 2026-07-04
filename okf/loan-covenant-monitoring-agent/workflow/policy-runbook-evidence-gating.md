---
type: Workflow Stage
title: "Policy & Runbook Evidence Gating"
description: "Cite the Loan Covenant Monitoring Agent Banking Compliance Policy and the Financial Covenant Testing & Waiver Administration Runbook via lookup_loan_covenant_monitoring_agent_compliance_policy before any breach, cure, or waiver determination is finalized."
source_id: policy_runbook_evidence_gating
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy & Runbook Evidence Gating

Cite the Loan Covenant Monitoring Agent Banking Compliance Policy and the Financial Covenant Testing & Waiver Administration Runbook via lookup_loan_covenant_monitoring_agent_compliance_policy before any breach, cure, or waiver determination is finalized.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Escalation & Waiver Memo Drafting](/workflow/escalation-waiver-memo-drafting.md)
