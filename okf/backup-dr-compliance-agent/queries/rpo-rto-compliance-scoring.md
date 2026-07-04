---
type: Query Capability
title: Track backup success rates over time. Benchmark restore times against RTO tar...
description: Track backup success rates over time. Benchmark restore times against RTO targets. Score RPO compliance based on backup frequency vs. data change rate. Forecast storage growth.
source_id: "rpo-rto-compliance-scoring"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track backup success rates over time. Benchmark restore times against RTO targets. Score RPO compliance based on backup frequency vs. data change rate. Forecast storage growth.

## Tools used

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [query_gcp_cloud_storage_gcp_cloud_storage_records](/tools/query-gcp-cloud-storage-gcp-cloud-storage-records.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

## Runs in

- [rpo_rto_compliance_scoring](/workflow/rpo-rto-compliance-scoring.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

# Citations

- [Backup & DR Compliance Agent Operations Runbook](/documents/backup-dr-compliance-agent-runbook.md)
