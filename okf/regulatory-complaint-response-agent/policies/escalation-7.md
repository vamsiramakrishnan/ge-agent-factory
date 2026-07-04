---
type: Policy
title: Escalation policy 7
description: "When A DOI complaint's statutory response deadline falls within 2 business days and the customer file assembly across policies, policy_quotes, or underwriting_submissions is still incomplete; action: escalate_to_human; handoff: Compliance Officer"
source_id: "escalation-7"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A DOI complaint's statutory response deadline falls within 2 business days and the customer file assembly across policies, policy_quotes, or underwriting_submissions is still incomplete | escalate_to_human | Compliance Officer | A near-term statutory deadline with an incomplete file cannot be closed safely by automation; the Compliance Officer must decide whether to request an extension or expedite manual assembly. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
