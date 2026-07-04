---
type: Workflow Stage
title: Compliance Scoring Against Historical Baseline
description: "Score each store's compliance rate and reset audit coverage against BigQuery historical_metrics and analytics_events baselines to detect the 72%-to-93% gap and prioritize the Planogram Manager's exception queue."
source_id: compliance_scoring_against_historical_baseline
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compliance Scoring Against Historical Baseline

Score each store's compliance rate and reset audit coverage against BigQuery historical_metrics and analytics_events baselines to detect the 72%-to-93% gap and prioritize the Planogram Manager's exception queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)

Next: [Playbook-Gated Evidence Validation](/workflow/playbook-gated-evidence-validation.md)
