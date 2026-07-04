---
type: Workflow Stage
title: DR Readiness Narrative
description: "Gemini generates report: 'All tier-1 systems meet RPO targets. The user-uploads S3 bucket hasn't been in the cross-region backup since March migration — violates 4-hour RPO. Adding to backup job immediately.'"
source_id: dr_readiness_narrative
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# DR Readiness Narrative

Gemini generates report: 'All tier-1 systems meet RPO targets. The user-uploads S3 bucket hasn't been in the cross-region backup since March migration — violates 4-hour RPO. Adding to backup job immediately.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

Next: [Report & Remediation](/workflow/report-remediation.md)
