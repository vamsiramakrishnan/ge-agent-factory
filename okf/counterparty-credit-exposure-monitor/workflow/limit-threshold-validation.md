---
type: Workflow Stage
title: "Limit & Threshold Validation"
description: "Cross-check desk-level VaR, limit_utilization_pct, and backtest_exceptions_250d in risk_measures, plus CSA and LCR thresholds, against the Counterparty Credit Exposure Monitor Banking Compliance Policy before any recommendation is finalized."
source_id: limit_threshold_validation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Limit & Threshold Validation

Cross-check desk-level VaR, limit_utilization_pct, and backtest_exceptions_250d in risk_measures, plus CSA and LCR thresholds, against the Counterparty Credit Exposure Monitor Banking Compliance Policy before any recommendation is finalized.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)

Next: [File & Escalate](/workflow/file-escalate.md)
