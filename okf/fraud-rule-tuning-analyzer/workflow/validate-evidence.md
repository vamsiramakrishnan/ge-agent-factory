---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the Fraud Rule Tuning Analyzer Banking Compliance Policy and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the Fraud Rule Tuning Analyzer Banking Compliance Policy and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)
- [action_nice_actimize_recommend](/tools/action-nice-actimize-recommend.md)

Next: [Act & Audit](/workflow/act-audit.md)
