---
type: Agent Tool
title: query_gcp_cloud_storage_gcp_cloud_storage_records
description: "Retrieve gcp cloud storage records from GCP Cloud Storage for the Backup & DR Compliance Agent workflow."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_gcp_cloud_storage_gcp_cloud_storage_records

Retrieve gcp cloud storage records from GCP Cloud Storage for the Backup & DR Compliance Agent workflow.

- **Kind:** query
- **Source system:** [GCP Cloud Storage](/systems/gcp-cloud-storage.md)

## Inputs

- lookup_key
- date_range

## Outputs

- gcp_cloud_storage_records_records
- gcp_cloud_storage_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GCP Cloud Storage](/systems/gcp-cloud-storage.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [backup_status_collection](/workflow/backup-status-collection.md)
- [rpo_rto_compliance_scoring](/workflow/rpo-rto-compliance-scoring.md)

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- gcp_cloud_storage_records_records
- gcp_cloud_storage_records_summary

# Examples

```
query_gcp_cloud_storage_gcp_cloud_storage_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GCP Cloud Storage](/systems/gcp-cloud-storage.md)
