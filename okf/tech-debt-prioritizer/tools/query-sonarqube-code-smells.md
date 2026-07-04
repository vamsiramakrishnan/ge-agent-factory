---
type: Agent Tool
title: query_sonarqube_code_smells
description: Retrieve code smells from SonarQube for the Tech Debt Prioritizer workflow.
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

# query_sonarqube_code_smells

Retrieve code smells from SonarQube for the Tech Debt Prioritizer workflow.

- **Kind:** query
- **Source system:** [SonarQube](/systems/sonarqube.md)

## Inputs

- lookup_key
- date_range

## Outputs

- code_smells_records
- code_smells_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SonarQube](/systems/sonarqube.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [metric_aggregation](/workflow/metric-aggregation.md)
- [debt_scoring_roi_estimation](/workflow/debt-scoring-roi-estimation.md)

## Evals

- [Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tech-debt-prioritizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- code_smells_records
- code_smells_summary

# Examples

```
query_sonarqube_code_smells(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SonarQube](/systems/sonarqube.md)
