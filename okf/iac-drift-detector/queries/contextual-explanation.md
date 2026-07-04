---
type: Query Capability
title: "Gemini explains drift: 'Production VPC has 3 security group rules not in Terr..."
description: "Gemini explains drift: 'Production VPC has 3 security group rules not in Terraform — added manually during the March 15 incident response. Recommend importing into Terraform or removing if workaround no longer needed.'"
source_id: "contextual-explanation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains drift: 'Production VPC has 3 security group rules not in Terraform — added manually during the March 15 incident response. Recommend importing into Terraform or removing if workaround no longer needed.'

## Tools used

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

## Runs in

- [contextual_explanation](/workflow/contextual-explanation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/iac-drift-detector-end-to-end.md)

# Citations

- [IaC Drift Detector Operations Runbook](/documents/iac-drift-detector-runbook.md)
