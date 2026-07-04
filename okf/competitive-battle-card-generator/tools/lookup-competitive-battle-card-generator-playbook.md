---
type: Agent Tool
title: lookup_competitive_battle_card_generator_playbook
description: "Look up sections of the Competitive Battle Card Generator Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_competitive_battle_card_generator_playbook

Look up sections of the Competitive Battle Card Generator Playbook to cite in narrative output, escalation rationale, and audit evidence.

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

- [intelligence_collection](/workflow/intelligence-collection.md)
- [win_loss_quantification](/workflow/win-loss-quantification.md)
- [battle_card_generation](/workflow/battle-card-generation.md)
- [sales_distribution](/workflow/sales-distribution.md)

## Evals

- [Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-battle-card-generator-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_competitive_battle_card_generator_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Salesforce CRM](/systems/salesforce-crm.md)
