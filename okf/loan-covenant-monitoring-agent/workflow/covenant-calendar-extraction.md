---
type: Workflow Stage
title: Covenant Calendar Extraction
description: "Extract covenant_type, threshold_value, and test_frequency from executed loan agreements in nCino Loan Origination's covenant_records and loan_applications, building a per-facility testing calendar keyed to next_test_date."
source_id: covenant_calendar_extraction
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Covenant Calendar Extraction

Extract covenant_type, threshold_value, and test_frequency from executed loan agreements in nCino Loan Origination's covenant_records and loan_applications, building a per-facility testing calendar keyed to next_test_date.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Financials Intake & Ratio Computation](/workflow/financials-intake-ratio-computation.md)
