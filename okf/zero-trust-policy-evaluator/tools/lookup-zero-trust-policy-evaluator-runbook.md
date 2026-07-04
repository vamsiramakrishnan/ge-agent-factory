---
type: Agent Tool
title: lookup_zero_trust_policy_evaluator_runbook
description: "Look up sections of the Zero Trust Policy Evaluator Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_zero_trust_policy_evaluator_runbook

Look up sections of the Zero Trust Policy Evaluator Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Okta](/systems/okta.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Okta](/systems/okta.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_inventory](/workflow/policy-inventory.md)
- [zero_trust_gap_analysis](/workflow/zero-trust-gap-analysis.md)
- [maturity_assessment_roadmap](/workflow/maturity-assessment-roadmap.md)
- [migration_tracking](/workflow/migration-tracking.md)

## Evals

- [Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/zero-trust-policy-evaluator-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_zero_trust_policy_evaluator_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Okta](/systems/okta.md)
