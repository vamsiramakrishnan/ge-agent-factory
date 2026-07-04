---
type: Proof Obligation
title: "Golden eval obligation — Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-backup-dr-compliance-agent-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [backup-dr-compliance-agent-end-to-end](/tests/backup-dr-compliance-agent-end-to-end.md)


## Mechanisms

- [query_aws_backup_billing_records](/tools/query-aws-backup-billing-records.md)
- [query_gcp_cloud_storage_gcp_cloud_storage_records](/tools/query-gcp-cloud-storage-gcp-cloud-storage-records.md)
- [query_terraform_modules](/tools/query-terraform-modules.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
- [action_aws_backup_validate](/tools/action-aws-backup-validate.md)

## Entities that must be referenced

- billing_records
- gcp_cloud_storage_records
- modules
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute validate without two-system evidence

# Citations

- [backup-dr-compliance-agent-runbook](/documents/backup-dr-compliance-agent-runbook.md)
