---
type: Agent Tool
title: lookup_sole_single_source_justification_drafter_policy_guide
description: "Look up sections of the Sole/Single Source Justification Drafter Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_sole_single_source_justification_drafter_policy_guide

Look up sections of the Sole/Single Source Justification Drafter Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Policy docs](/systems/policy-docs.md)

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

No explicit permission scopes declared; source-system access is tied to [Policy docs](/systems/policy-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [request_intake_policy_check](/workflow/request-intake-policy-check.md)
- [market_alternative_scan](/workflow/market-alternative-scan.md)
- [justification_drafting_challenge](/workflow/justification-drafting-challenge.md)

## Evals

- [Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sole-single-source-justification-drafter-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_sole_single_source_justification_drafter_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Policy docs](/systems/policy-docs.md)
