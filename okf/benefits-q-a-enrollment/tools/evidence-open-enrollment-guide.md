---
type: Agent Tool
title: evidence_open_enrollment_guide
description: "Cite the open-enrollment guide for eligibility/window/carrier-sync claims (citation anchors: eligibility-window, family-tier, carrier-sync)."
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

# evidence_open_enrollment_guide

Cite the open-enrollment guide for eligibility/window/carrier-sync claims (citation anchors: eligibility-window, family-tier, carrier-sync).

- **Kind:** evidence_lookup
- **Source system:** [Benefits Platform](/systems/benefits-platform.md)

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

No explicit permission scopes declared; source-system access is tied to [Benefits Platform](/systems/benefits-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [question_understanding](/workflow/question-understanding.md)
- [personalized_response](/workflow/personalized-response.md)

## Evals

- [I am employee EMP-0012. Can you compare the Gold PPO and Standard PPO for me? I am not ready to enroll yet.](/tests/plan-comparison-no-action.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_open_enrollment_guide(citation_anchor=<citation_anchor>)
```

# Citations

- [Benefits Platform](/systems/benefits-platform.md)
