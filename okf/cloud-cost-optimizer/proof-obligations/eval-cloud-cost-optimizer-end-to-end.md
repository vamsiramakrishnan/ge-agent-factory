---
type: Proof Obligation
title: "Golden eval obligation — Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-cloud-cost-optimizer-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [cloud-cost-optimizer-end-to-end](/tests/cloud-cost-optimizer-end-to-end.md)


## Mechanisms

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cloud_cost_optimizer_runbook](/tools/lookup-cloud-cost-optimizer-runbook.md)

## Entities that must be referenced

- billing_records
- billing_records
- alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [cloud-cost-optimizer-runbook](/documents/cloud-cost-optimizer-runbook.md)
