---
type: Agent Tool
title: evidence_role_template_catalog
description: "Cite the Role-Based Access Template Catalog for template match justification."
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

# evidence_role_template_catalog

Cite the Role-Based Access Template Catalog for template match justification.

- **Kind:** evidence_lookup
- **Source system:** [Okta](/systems/okta.md)

## Inputs

- role
- department

## Outputs

- template_citation

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

- [event_processing](/workflow/event-processing.md)
- [role_based_access_matching](/workflow/role-based-access-matching.md)
- [edge_case_resolution](/workflow/edge-case-resolution.md)
- [multi_system_provisioning](/workflow/multi-system-provisioning.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- role
- department

## Produces

- template_citation

# Examples

```
evidence_role_template_catalog(role=<role>, department=<department>)
```

# Citations

- [Okta](/systems/okta.md)
