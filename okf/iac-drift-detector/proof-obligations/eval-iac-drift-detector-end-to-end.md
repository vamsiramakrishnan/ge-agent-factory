---
type: Proof Obligation
title: "Golden eval obligation — Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-iac-drift-detector-end-to-end"
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

# Golden eval obligation — Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [iac-drift-detector-end-to-end](/tests/iac-drift-detector-end-to-end.md)


## Mechanisms

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [query_aws_cloudformation_billing_records](/tools/query-aws-cloudformation-billing-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

## Entities that must be referenced

- modules
- billing_records
- pull_requests

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [iac-drift-detector-runbook](/documents/iac-drift-detector-runbook.md)
