---
type: Eval Scenario
title: Run the IaC Drift Detector workflow for the current period. Cite the relevant...
description: "Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "iac-drift-detector-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [drift-detection](/queries/drift-detection.md)

## Mechanisms to call

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [query_aws_cloudformation_billing_records](/tools/query-aws-cloudformation-billing-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

## Success rubric

Action generate executed against Terraform, with audit-trail entry and DevOps Lead notified of outcomes.

# Citations

- [IaC Drift Detector Operations Runbook](/documents/iac-drift-detector-runbook.md)
