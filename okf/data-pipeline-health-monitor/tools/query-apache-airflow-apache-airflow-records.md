---
type: Agent Tool
title: query_apache_airflow_apache_airflow_records
description: Retrieve apache airflow records from Apache Airflow for the Data Pipeline Health Monitor workflow.
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

# query_apache_airflow_apache_airflow_records

Retrieve apache airflow records from Apache Airflow for the Data Pipeline Health Monitor workflow.

- **Kind:** query
- **Source system:** [Apache Airflow](/systems/apache-airflow.md)

## Inputs

- lookup_key
- date_range

## Outputs

- apache_airflow_records_records
- apache_airflow_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Apache Airflow](/systems/apache-airflow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [failure_detection_alerting](/workflow/failure-detection-alerting.md)

## Evals

- [Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-pipeline-health-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- apache_airflow_records_records
- apache_airflow_records_summary

# Examples

```
query_apache_airflow_apache_airflow_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Apache Airflow](/systems/apache-airflow.md)
