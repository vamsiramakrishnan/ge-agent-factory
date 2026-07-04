---
type: Workflow Stage
title: "Multi-Cloud Spend Aggregation"
description: "Aggregate spend from AWS Cost Explorer, GCP Billing, and Azure Cost Management. Normalize into a unified cost model with resource-level attribution."
source_id: multi_cloud_spend_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Cloud Spend Aggregation

Aggregate spend from AWS Cost Explorer, GCP Billing, and Azure Cost Management. Normalize into a unified cost model with resource-level attribution.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [lookup_cloud_cost_optimizer_runbook](/tools/lookup-cloud-cost-optimizer-runbook.md)

Next: [Waste & Right-Sizing Analysis](/workflow/waste-right-sizing-analysis.md)
