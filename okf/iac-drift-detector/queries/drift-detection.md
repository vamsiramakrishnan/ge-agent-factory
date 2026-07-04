---
type: Query Capability
title: "Run terraform plan against all environments — production, staging, developmen..."
description: "Run terraform plan against all environments — production, staging, development. Detect differences between declared Terraform state and actual cloud infrastructure."
source_id: "drift-detection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run terraform plan against all environments — production, staging, development. Detect differences between declared Terraform state and actual cloud infrastructure.

## Tools used

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

## Runs in

- [drift_detection](/workflow/drift-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/iac-drift-detector-end-to-end.md)

# Citations

- [IaC Drift Detector Operations Runbook](/documents/iac-drift-detector-runbook.md)
