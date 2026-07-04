---
type: Agent Tool
title: query_bigquery_peer_access_patterns
description: "Analyze peer access patterns in the employee's team and role to identify common tools beyond the template."
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

# query_bigquery_peer_access_patterns

Analyze peer access patterns in the employee's team and role to identify common tools beyond the template.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- role
- department
- team

## Outputs

- common_groups
- anomaly_score

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_processing](/workflow/event-processing.md)
- [role_based_access_matching](/workflow/role-based-access-matching.md)
- [edge_case_resolution](/workflow/edge-case-resolution.md)
- [multi_system_provisioning](/workflow/multi-system-provisioning.md)

## Evals

- [New hire EMP-8901 with role 'Software Engineer' in 'Platform Services' department joins today. Provision their access.](/tests/new-hire-standard-template.md)

## Evidence emitted

- sql_result

## Required inputs

- role
- department
- team

## Produces

- common_groups
- anomaly_score

# Examples

```
query_bigquery_peer_access_patterns(role=<role>, department=<department>, team=<team>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
