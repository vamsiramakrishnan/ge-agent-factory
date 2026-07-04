---
type: Agent Tool
title: action_aws_backup_validate
description: Execute the validate step in AWS Backup after the agent has gathered evidence and validated escalation gates.
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

# action_aws_backup_validate

Execute the validate step in AWS Backup after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [AWS Backup](/systems/aws-backup.md)
- **API:** POST /api/aws_backup/validate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change AWS Backup state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_aws_backup_validate](/policies/confirmation-action-aws-backup-validate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [AWS Backup](/systems/aws-backup.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [backup_status_collection](/workflow/backup-status-collection.md)
- [rpo_rto_compliance_scoring](/workflow/rpo-rto-compliance-scoring.md)
- [dr_readiness_narrative](/workflow/dr-readiness-narrative.md)

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_aws_backup_validate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [AWS Backup](/systems/aws-backup.md)
- [Confirmation policy — action_aws_backup_validate](/policies/confirmation-action-aws-backup-validate.md)
- [Idempotency policy — action_aws_backup_validate](/policies/idempotency-action-aws-backup-validate.md)
