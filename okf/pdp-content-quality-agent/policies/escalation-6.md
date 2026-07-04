---
type: Policy
title: Escalation policy 6
description: "When Online price or promotion displays materially below the store shelf price for BOPIS/curbside items without an approved channel-pricing exception.; action: escalate_to_human; handoff: omnichannel_pricing_analyst"
source_id: "escalation-6"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Online price or promotion displays materially below the store shelf price for BOPIS/curbside items without an approved channel-pricing exception. | escalate_to_human | omnichannel_pricing_analyst | Unintended channel divergence on pickup orders creates honor-the-lower-price liability at scale and store-level customer friction. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
