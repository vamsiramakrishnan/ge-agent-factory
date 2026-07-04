---
type: Agent Tool
title: lookup_background_sanctions_screener_policy_guide
description: "Look up sections of the Background & Sanctions Screener Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_background_sanctions_screener_policy_guide

Look up sections of the Background & Sanctions Screener Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [LexisNexis](/systems/lexisnexis.md)

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

No explicit permission scopes declared; source-system access is tied to [LexisNexis](/systems/lexisnexis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sanctions_watchlist_screening](/workflow/sanctions-watchlist-screening.md)
- [entity_resolution_fuzzy_matching](/workflow/entity-resolution-fuzzy-matching.md)
- [adverse_media_analysis_risk_synthesis](/workflow/adverse-media-analysis-risk-synthesis.md)

## Evals

- [Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/background-sanctions-screener-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_background_sanctions_screener_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [LexisNexis](/systems/lexisnexis.md)
