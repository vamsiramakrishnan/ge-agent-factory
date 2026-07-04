---
type: Query Capability
title: "Auto-generate PRs to import manual changes into Terraform state or remove sta..."
description: "Auto-generate PRs to import manual changes into Terraform state or remove stale workarounds. Each PR includes context explanation and blast radius analysis."
source_id: "remediation-pr-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-generate PRs to import manual changes into Terraform state or remove stale workarounds. Each PR includes context explanation and blast radius analysis.

## Tools used

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

## Runs in

- [remediation_pr_generation](/workflow/remediation-pr-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/iac-drift-detector-end-to-end.md)

# Citations

- [IaC Drift Detector Operations Runbook](/documents/iac-drift-detector-runbook.md)
