---
type: Query Capability
title: "Gemini recommends specific actions: negotiate ULA for over-deployed Oracle, r..."
description: "Gemini recommends specific actions: negotiate ULA for over-deployed Oracle, reclaim 40 unused Salesforce licenses, migrate analytics workload to BigQuery to eliminate license cost entirely."
source_id: "optimization-reasoning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini recommends specific actions: negotiate ULA for over-deployed Oracle, reclaim 40 unused Salesforce licenses, migrate analytics workload to BigQuery to eliminate license cost entirely.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_license_compliance_monitor_runbook](/tools/lookup-license-compliance-monitor-runbook.md)

## Runs in

- [optimization_reasoning](/workflow/optimization-reasoning.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/license-compliance-monitor-end-to-end.md)

# Citations

- [License Compliance Monitor Operations Runbook](/documents/license-compliance-monitor-runbook.md)
