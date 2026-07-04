---
type: Workflow Stage
title: "Threshold Simulation & Retirement Screening"
description: "Simulate threshold shifts against transaction_risk_scores score_band, velocity_rule_triggered, and mule_account_indicator flags to project alert-volume and detection-rate impact, flagging decayed rules as retirement candidates."
source_id: threshold_simulation_retirement_screening
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Threshold Simulation & Retirement Screening

Simulate threshold shifts against transaction_risk_scores score_band, velocity_rule_triggered, and mule_account_indicator flags to project alert-volume and detection-rate impact, flagging decayed rules as retirement candidates.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)

Next: [Governance Evidence Packaging](/workflow/governance-evidence-packaging.md)
