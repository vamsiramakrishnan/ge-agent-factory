---
type: Workflow Stage
title: Remediation PR Generation
description: "Auto-generate PRs to import manual changes into Terraform state or remove stale workarounds. Each PR includes context explanation and blast radius analysis."
source_id: remediation_pr_generation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Remediation PR Generation

Auto-generate PRs to import manual changes into Terraform state or remove stale workarounds. Each PR includes context explanation and blast radius analysis.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_terraform_modules](/tools/query-terraform-modules.md)
- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)
- [action_terraform_generate](/tools/action-terraform-generate.md)
