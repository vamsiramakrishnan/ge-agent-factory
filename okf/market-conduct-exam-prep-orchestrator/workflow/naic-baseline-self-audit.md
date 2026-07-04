---
type: Workflow Stage
title: "NAIC Baseline Self-Audit"
description: "Compare the pulled policies and underwriting_submissions against historical_metrics and analytics_events in BigQuery to test timeliness, disclosure, and handling standards mapped to NAIC market conduct examiner standards."
source_id: naic_baseline_self_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# NAIC Baseline Self-Audit

Compare the pulled policies and underwriting_submissions against historical_metrics and analytics_events in BigQuery to test timeliness, disclosure, and handling standards mapped to NAIC market conduct examiner standards.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)

Next: [Exception Scoring & Queue Prioritization](/workflow/exception-scoring-queue-prioritization.md)
