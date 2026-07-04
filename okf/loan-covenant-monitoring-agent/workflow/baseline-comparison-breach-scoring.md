---
type: Workflow Stage
title: "Baseline Comparison & Breach Scoring"
description: "Compare current-period ratios against historical_metrics and analytics_events in BigQuery to score compliance_status (in_compliance/waived/breached/cured) and rank near-breach facilities for the Credit Risk Officer's queue."
source_id: baseline_comparison_breach_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Comparison & Breach Scoring

Compare current-period ratios against historical_metrics and analytics_events in BigQuery to score compliance_status (in_compliance/waived/breached/cured) and rank near-breach facilities for the Credit Risk Officer's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)

Next: [Policy & Runbook Evidence Gating](/workflow/policy-runbook-evidence-gating.md)
