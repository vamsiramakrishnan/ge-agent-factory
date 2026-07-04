---
type: Query Capability
title: "Gemini generates report: 'All tier-1 systems meet RPO targets. The user-uploa..."
description: "Gemini generates report: 'All tier-1 systems meet RPO targets. The user-uploads S3 bucket hasn't been in the cross-region backup since March migration — violates 4-hour RPO. Adding to backup job immediately.'"
source_id: "dr-readiness-narrative"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates report: 'All tier-1 systems meet RPO targets. The user-uploads S3 bucket hasn't been in the cross-region backup since March migration — violates 4-hour RPO. Adding to backup job immediately.'

## Tools used

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

## Runs in

- [dr_readiness_narrative](/workflow/dr-readiness-narrative.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

# Citations

- [Backup & DR Compliance Agent Operations Runbook](/documents/backup-dr-compliance-agent-runbook.md)
