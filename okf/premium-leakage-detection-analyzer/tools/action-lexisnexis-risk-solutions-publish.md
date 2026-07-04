---
type: Agent Tool
title: action_lexisnexis_risk_solutions_publish
description: Execute the publish step in LexisNexis Risk Solutions after the agent has gathered evidence and validated escalation gates.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_lexisnexis_risk_solutions_publish

Execute the publish step in LexisNexis Risk Solutions after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
- **API:** POST /api/lexisnexis_risk_solutions/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change LexisNexis Risk Solutions state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_lexisnexis_risk_solutions_publish](/policies/confirmation-action-lexisnexis-risk-solutions-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [exposure_intake_baseline_pull](/workflow/exposure-intake-baseline-pull.md)
- [pre_audit_findings_drafting](/workflow/pre-audit-findings-drafting.md)
- [recovery_publication_audit_trail](/workflow/recovery-publication-audit-trail.md)

## Evals

- [Run the Premium Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/premium-leakage-detection-analyzer-end-to-end.md)

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
action_lexisnexis_risk_solutions_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
- [Confirmation policy — action_lexisnexis_risk_solutions_publish](/policies/confirmation-action-lexisnexis-risk-solutions-publish.md)
- [Idempotency policy — action_lexisnexis_risk_solutions_publish](/policies/idempotency-action-lexisnexis-risk-solutions-publish.md)
