---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the Loan Covenant Monitoring Agent Banking Compliance Policy and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the Loan Covenant Monitoring Agent Banking Compliance Policy and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Act & Audit](/workflow/act-audit.md)
