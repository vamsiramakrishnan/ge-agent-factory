---
type: Query Capability
title: "Aggregate spend from AWS Cost Explorer, GCP Billing, and Azure Cost Managemen..."
description: "Aggregate spend from AWS Cost Explorer, GCP Billing, and Azure Cost Management. Normalize into a unified cost model with resource-level attribution."
source_id: "multi-cloud-spend-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate spend from AWS Cost Explorer, GCP Billing, and Azure Cost Management. Normalize into a unified cost model with resource-level attribution.

## Tools used

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [lookup_cloud_cost_optimizer_runbook](/tools/lookup-cloud-cost-optimizer-runbook.md)

## Runs in

- [multi_cloud_spend_aggregation](/workflow/multi-cloud-spend-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cloud-cost-optimizer-end-to-end.md)

# Citations

- [Cloud Cost Optimizer Operations Runbook](/documents/cloud-cost-optimizer-runbook.md)
