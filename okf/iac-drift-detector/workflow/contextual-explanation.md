---
type: Workflow Stage
title: Contextual Explanation
description: "Gemini explains drift: 'Production VPC has 3 security group rules not in Terraform — added manually during the March 15 incident response. Recommend importing into Terraform or removing if workaround no longer needed.'"
source_id: contextual_explanation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Contextual Explanation

Gemini explains drift: 'Production VPC has 3 security group rules not in Terraform — added manually during the March 15 incident response. Recommend importing into Terraform or removing if workaround no longer needed.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)

Next: [Remediation PR Generation](/workflow/remediation-pr-generation.md)
