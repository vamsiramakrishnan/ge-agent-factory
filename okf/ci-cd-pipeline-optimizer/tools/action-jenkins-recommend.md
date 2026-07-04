---
type: Agent Tool
title: action_jenkins_recommend
description: Execute the recommend step in Jenkins after the agent has gathered evidence and validated escalation gates.
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

# action_jenkins_recommend

Execute the recommend step in Jenkins after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Jenkins](/systems/jenkins.md)
- **API:** POST /api/jenkins/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Jenkins state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_jenkins_recommend](/policies/confirmation-action-jenkins-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Jenkins](/systems/jenkins.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [telemetry_collection](/workflow/telemetry-collection.md)
- [contextual_fix_recommendations](/workflow/contextual-fix-recommendations.md)

## Evals

- [Run the CI/CD Pipeline Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ci-cd-pipeline-optimizer-end-to-end.md)

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
action_jenkins_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Jenkins](/systems/jenkins.md)
- [Confirmation policy — action_jenkins_recommend](/policies/confirmation-action-jenkins-recommend.md)
- [Idempotency policy — action_jenkins_recommend](/policies/idempotency-action-jenkins-recommend.md)
