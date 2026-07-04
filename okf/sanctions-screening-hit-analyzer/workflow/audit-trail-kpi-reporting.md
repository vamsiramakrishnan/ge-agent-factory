---
type: Workflow Stage
title: "Audit Trail & KPI Reporting"
description: "Write the disposition, citation anchors, and audit_record_id back to Fenergo CLM and refresh cached_aggregates in BigQuery so the Screening hits auto-adjudicated and average hit disposition time KPIs reflect the outcome."
source_id: audit_trail_kpi_reporting
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Audit Trail & KPI Reporting

Write the disposition, citation anchors, and audit_record_id back to Fenergo CLM and refresh cached_aggregates in BigQuery so the Screening hits auto-adjudicated and average hit disposition time KPIs reflect the outcome.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)
