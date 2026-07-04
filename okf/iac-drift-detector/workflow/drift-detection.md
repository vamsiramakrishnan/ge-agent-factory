---
type: Workflow Stage
title: Drift Detection
description: "Run terraform plan against all environments — production, staging, development. Detect differences between declared Terraform state and actual cloud infrastructure."
source_id: drift_detection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Drift Detection

Run terraform plan against all environments — production, staging, development. Detect differences between declared Terraform state and actual cloud infrastructure.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

Next: [Drift Classification & Analysis](/workflow/drift-classification-analysis.md)
