---
type: Eval Scenario
title: "Run the Backup & DR Compliance Agent workflow for the current period. Cite th..."
description: "Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "backup-dr-compliance-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [backup-status-collection](/queries/backup-status-collection.md)

## Mechanisms to call

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [query_gcp_cloud_storage_gcp_cloud_storage_records](/tools/query-gcp-cloud-storage-gcp-cloud-storage-records.md)
- [query_terraform_modules](/tools/query-terraform-modules.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

## Success rubric

Action validate executed against AWS Backup, with audit-trail entry and Cloud Architect / SRE Manager notified of outcomes.

# Citations

- [Backup & DR Compliance Agent Operations Runbook](/documents/backup-dr-compliance-agent-runbook.md)
