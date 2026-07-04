---
type: Workflow Stage
title: "Severity Scoring & Disposition Recommendation"
description: "Score true-match likelihood against historical_metrics and analytics_events baselines in BigQuery, and cite the Sanctions Screening Hit Analyzer Banking Compliance Policy section that governs the proposed disposition (cleared, blocked_property, payment_rejected, pending)."
source_id: severity_scoring_disposition_recommendation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Severity Scoring & Disposition Recommendation

Score true-match likelihood against historical_metrics and analytics_events baselines in BigQuery, and cite the Sanctions Screening Hit Analyzer Banking Compliance Policy section that governs the proposed disposition (cleared, blocked_property, payment_rejected, pending).

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)

Next: [Escalation & Payment Release Decision](/workflow/escalation-payment-release-decision.md)
