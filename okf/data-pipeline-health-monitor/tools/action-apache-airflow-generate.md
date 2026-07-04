---
type: Agent Tool
title: action_apache_airflow_generate
description: Execute the generate step in Apache Airflow after the agent has gathered evidence and validated escalation gates.
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

# action_apache_airflow_generate

Execute the generate step in Apache Airflow after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Apache Airflow](/systems/apache-airflow.md)
- **API:** POST /api/apache_airflow/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Apache Airflow state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_apache_airflow_generate](/policies/confirmation-action-apache-airflow-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Apache Airflow](/systems/apache-airflow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [failure_detection_alerting](/workflow/failure-detection-alerting.md)
- [fix_proposal_generation](/workflow/fix-proposal-generation.md)

## Evals

- [Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-pipeline-health-monitor-end-to-end.md)

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
action_apache_airflow_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Apache Airflow](/systems/apache-airflow.md)
- [Confirmation policy — action_apache_airflow_generate](/policies/confirmation-action-apache-airflow-generate.md)
- [Idempotency policy — action_apache_airflow_generate](/policies/idempotency-action-apache-airflow-generate.md)
