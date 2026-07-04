---
type: Workflow Stage
title: Pipeline Deal Simulation
description: "Simulate the incremental concentration impact of pending loan_applications in decision_status submitted, underwriting, or conditional_approval before booking, and flag underwriters when a pending deal would breach a limit."
source_id: pipeline_deal_simulation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pipeline Deal Simulation

Simulate the incremental concentration impact of pending loan_applications in decision_status submitted, underwriting, or conditional_approval before booking, and flag underwriters when a pending deal would breach a limit.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)

Next: [Covenant & Exception Cross-Check](/workflow/covenant-exception-cross-check.md)
