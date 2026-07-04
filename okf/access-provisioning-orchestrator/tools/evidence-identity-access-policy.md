---
type: Agent Tool
title: evidence_identity_access_policy
description: "Cite the Identity Access Policy for policy-based assertions (citation anchors: manager-approval-thresholds, elevated-access, termination-revocation, segregation-of-duties)."
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

# evidence_identity_access_policy

Cite the Identity Access Policy for policy-based assertions (citation anchors: manager-approval-thresholds, elevated-access, termination-revocation, segregation-of-duties).

- **Kind:** evidence_lookup
- **Source system:** [Okta](/systems/okta.md)

## Inputs

- citation_anchor

## Outputs

- policy_citation

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

- citation_anchor

## Produces

- policy_citation

# Examples

```
evidence_identity_access_policy(citation_anchor=<citation_anchor>)
```

# Citations

- [Okta](/systems/okta.md)
