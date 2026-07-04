---
type: Query Capability
title: Verify backup completion across AWS Backup and GCP Cloud Storage. Check cross...
description: "Verify backup completion across AWS Backup and GCP Cloud Storage. Check cross-region replication status. Validate backup retention meets policy requirements by system tier."
source_id: "backup-status-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Verify backup completion across AWS Backup and GCP Cloud Storage. Check cross-region replication status. Validate backup retention meets policy requirements by system tier.

## Tools used

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [query_gcp_cloud_storage_gcp_cloud_storage_records](/tools/query-gcp-cloud-storage-gcp-cloud-storage-records.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

## Runs in

- [backup_status_collection](/workflow/backup-status-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

# Citations

- [Backup & DR Compliance Agent Operations Runbook](/documents/backup-dr-compliance-agent-runbook.md)
