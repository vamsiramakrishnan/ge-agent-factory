---
type: Workflow Stage
title: Backup Status Collection
description: "Verify backup completion across AWS Backup and GCP Cloud Storage. Check cross-region replication status. Validate backup retention meets policy requirements by system tier."
source_id: backup_status_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Backup Status Collection

Verify backup completion across AWS Backup and GCP Cloud Storage. Check cross-region replication status. Validate backup retention meets policy requirements by system tier.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [query_gcp_cloud_storage_gcp_cloud_storage_records](/tools/query-gcp-cloud-storage-gcp-cloud-storage-records.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

Next: [RPO/RTO Compliance Scoring](/workflow/rpo-rto-compliance-scoring.md)
