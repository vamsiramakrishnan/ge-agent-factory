---
type: Workflow Stage
title: "Alert Intake & Queue Prioritization"
description: "Pull new and in_review fraud_alerts and their linked transaction_risk_scores from NICE Actimize (query_nice_actimize_fraud_alerts) and re-rank the analyst queue by fraud_risk_score, score_band, velocity_rule_triggered, and mule_account_indicator so the Fraud Operations Analyst works the highest-risk alerts first instead of FIFO."
source_id: alert_intake_queue_prioritization
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alert Intake & Queue Prioritization

Pull new and in_review fraud_alerts and their linked transaction_risk_scores from NICE Actimize (query_nice_actimize_fraud_alerts) and re-rank the analyst queue by fraud_risk_score, score_band, velocity_rule_triggered, and mule_account_indicator so the Fraud Operations Analyst works the highest-risk alerts first instead of FIFO.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Context Enrichment](/workflow/context-enrichment.md)
