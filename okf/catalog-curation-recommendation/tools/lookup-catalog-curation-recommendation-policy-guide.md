---
type: Agent Tool
title: lookup_catalog_curation_recommendation_policy_guide
description: "Look up sections of the Catalog Curation & Recommendation Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_catalog_curation_recommendation_policy_guide

Look up sections of the Catalog Curation & Recommendation Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Coupa catalog](/systems/coupa-catalog.md)

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

No explicit permission scopes declared; source-system access is tied to [Coupa catalog](/systems/coupa-catalog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [query_interpretation](/workflow/query-interpretation.md)
- [result_presentation](/workflow/result-presentation.md)

## Evals

- [Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/catalog-curation-recommendation-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_catalog_curation_recommendation_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Coupa catalog](/systems/coupa-catalog.md)
