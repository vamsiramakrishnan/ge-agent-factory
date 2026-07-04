---
type: Query Capability
title: "Aggregate cloud spend from AWS Cost Explorer and GCP Billing, license costs f..."
description: "Aggregate cloud spend from AWS Cost Explorer and GCP Billing, license costs from SAM, headcount from HRIS, and project costs from ServiceNow SPM. Normalize into a unified cost model."
source_id: "spend-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate cloud spend from AWS Cost Explorer and GCP Billing, license costs from SAM, headcount from HRIS, and project costs from ServiceNow SPM. Normalize into a unified cost model.

## Tools used

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)

## Runs in

- [spend_aggregation](/workflow/spend-aggregation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-budget-forecast-agent-end-to-end.md)

# Citations

- [IT Budget Forecast Agent Operations Runbook](/documents/it-budget-forecast-agent-runbook.md)
