---
type: Workflow Stage
title: "Financials Intake & Ratio Computation"
description: "Ingest incoming borrower financials against credit_memos and loan_applications DSCR/LTV data, computing leverage, coverage, and liquidity ratios and posting the result to covenant_records.most_recent_test_value via query_ncino_loan_origination_loan_applications."
source_id: financials_intake_ratio_computation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Financials Intake & Ratio Computation

Ingest incoming borrower financials against credit_memos and loan_applications DSCR/LTV data, computing leverage, coverage, and liquidity ratios and posting the result to covenant_records.most_recent_test_value via query_ncino_loan_origination_loan_applications.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Baseline Comparison & Breach Scoring](/workflow/baseline-comparison-breach-scoring.md)
