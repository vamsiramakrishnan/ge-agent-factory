---
type: Workflow Stage
title: Spend Aggregation
description: "Aggregate cloud spend from AWS Cost Explorer and GCP Billing, license costs from SAM, headcount from HRIS, and project costs from ServiceNow SPM. Normalize into a unified cost model."
source_id: spend_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Spend Aggregation

Aggregate cloud spend from AWS Cost Explorer and GCP Billing, license costs from SAM, headcount from HRIS, and project costs from ServiceNow SPM. Normalize into a unified cost model.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)

Next: [Forecast Modeling](/workflow/forecast-modeling.md)
