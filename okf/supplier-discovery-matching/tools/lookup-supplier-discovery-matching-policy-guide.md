---
type: Agent Tool
title: lookup_supplier_discovery_matching_policy_guide
description: "Look up sections of the Supplier Discovery & Matching Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_supplier_discovery_matching_policy_guide

Look up sections of the Supplier Discovery & Matching Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP Ariba Discovery](/systems/sap-ariba-discovery.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP Ariba Discovery](/systems/sap-ariba-discovery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requirement_parsing_taxonomy_translation](/workflow/requirement-parsing-taxonomy-translation.md)
- [multi_source_discovery_filtering](/workflow/multi-source-discovery-filtering.md)
- [semantic_capability_matching_ranking](/workflow/semantic-capability-matching-ranking.md)

## Evals

- [Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-discovery-matching-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_supplier_discovery_matching_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP Ariba Discovery](/systems/sap-ariba-discovery.md)
