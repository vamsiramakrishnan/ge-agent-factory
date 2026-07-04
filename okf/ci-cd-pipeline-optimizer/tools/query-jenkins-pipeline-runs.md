---
type: Agent Tool
title: query_jenkins_pipeline_runs
description: Retrieve pipeline runs from Jenkins for the CI/CD Pipeline Optimizer workflow.
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

# query_jenkins_pipeline_runs

Retrieve pipeline runs from Jenkins for the CI/CD Pipeline Optimizer workflow.

- **Kind:** query
- **Source system:** [Jenkins](/systems/jenkins.md)

## Inputs

- lookup_key
- date_range

## Outputs

- pipeline_runs_records
- pipeline_runs_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Jenkins](/systems/jenkins.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [telemetry_collection](/workflow/telemetry-collection.md)
- [bottleneck_flaky_test_detection](/workflow/bottleneck-flaky-test-detection.md)
- [contextual_fix_recommendations](/workflow/contextual-fix-recommendations.md)
- [action_reporting](/workflow/action-reporting.md)

## Evals

- [Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ci-cd-pipeline-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- pipeline_runs_records
- pipeline_runs_summary

# Examples

```
query_jenkins_pipeline_runs(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Jenkins](/systems/jenkins.md)
