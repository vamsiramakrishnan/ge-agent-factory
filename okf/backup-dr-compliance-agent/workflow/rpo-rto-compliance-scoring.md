---
type: Workflow Stage
title: RPO/RTO Compliance Scoring
description: Track backup success rates over time. Benchmark restore times against RTO targets. Score RPO compliance based on backup frequency vs. data change rate. Forecast storage growth.
source_id: rpo_rto_compliance_scoring
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# RPO/RTO Compliance Scoring

Track backup success rates over time. Benchmark restore times against RTO targets. Score RPO compliance based on backup frequency vs. data change rate. Forecast storage growth.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [query_gcp_cloud_storage_gcp_cloud_storage_records](/tools/query-gcp-cloud-storage-gcp-cloud-storage-records.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

Next: [DR Readiness Narrative](/workflow/dr-readiness-narrative.md)
