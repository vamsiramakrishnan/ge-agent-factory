---
type: Agent Tool
title: lookup_lead_routing_assignment_engine_playbook
description: "Look up sections of the Lead Routing & Assignment Engine Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_lead_routing_assignment_engine_playbook

Look up sections of the Lead Routing & Assignment Engine Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Salesforce CRM](/systems/salesforce-crm.md)

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

No explicit permission scopes declared; source-system access is tied to [Salesforce CRM](/systems/salesforce-crm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [lead_enrichment](/workflow/lead-enrichment.md)
- [account_matching](/workflow/account-matching.md)
- [ambiguity_resolution](/workflow/ambiguity-resolution.md)
- [assignment_tracking](/workflow/assignment-tracking.md)

## Evals

- [Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-routing-assignment-engine-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_lead_routing_assignment_engine_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Salesforce CRM](/systems/salesforce-crm.md)
