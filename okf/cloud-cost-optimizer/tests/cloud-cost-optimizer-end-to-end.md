---
type: Eval Scenario
title: Run the Cloud Cost Optimizer workflow for the current period. Cite the releva...
description: "Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cloud-cost-optimizer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-cloud-spend-aggregation](/queries/multi-cloud-spend-aggregation.md)

## Mechanisms to call

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cloud_cost_optimizer_runbook](/tools/lookup-cloud-cost-optimizer-runbook.md)

## Success rubric

Cloud Architect receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Cloud Cost Optimizer Operations Runbook](/documents/cloud-cost-optimizer-runbook.md)
