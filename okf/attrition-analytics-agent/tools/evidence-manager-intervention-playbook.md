---
type: Agent Tool
title: evidence_manager_intervention_playbook
description: "Cite the intervention playbook for recommended retention actions (compensation review, career conversation, manager coaching)."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# evidence_manager_intervention_playbook

Cite the intervention playbook for recommended retention actions (compensation review, career conversation, manager coaching).

- **Kind:** evidence_lookup
- **Source system:** [Culture Amp](/systems/culture-amp.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Culture Amp](/systems/culture-amp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [feature_engineering](/workflow/feature-engineering.md)
- [intervention_dashboard](/workflow/intervention-dashboard.md)

## Evals

- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_manager_intervention_playbook(citation_anchor=<citation_anchor>)
```

# Citations

- [Culture Amp](/systems/culture-amp.md)
