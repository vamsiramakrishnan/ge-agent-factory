---
type: Query Capability
title: Cloud Architect reviews savings plan. Reservation purchases require approval....
description: "Cloud Architect reviews savings plan. Reservation purchases require approval. Right-sizing changes tracked with before/after cost comparison."
source_id: "approval-tracking"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cloud Architect reviews savings plan. Reservation purchases require approval. Right-sizing changes tracked with before/after cost comparison.

## Tools used

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [lookup_cloud_cost_optimizer_runbook](/tools/lookup-cloud-cost-optimizer-runbook.md)

## Runs in

- [approval_tracking](/workflow/approval-tracking.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cloud-cost-optimizer-end-to-end.md)

# Citations

- [Cloud Cost Optimizer Operations Runbook](/documents/cloud-cost-optimizer-runbook.md)
