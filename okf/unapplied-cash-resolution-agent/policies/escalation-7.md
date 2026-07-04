---
type: Policy
title: Escalation policy 7
description: "When A single lockbox batch has more than 15% of receipts fail fuzzy-match against billing_accounts and premium_invoices after two automated passes; action: escalate_to_human; handoff: Cash Applications Team Lead"
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
| A single lockbox batch has more than 15% of receipts fail fuzzy-match against billing_accounts and premium_invoices after two automated passes | escalate_to_human | Cash Applications Team Lead | Systemic batch failures usually signal a lockbox bank file format change or a corrupted agency bulk remittance file, not a run of individually hard-to-match items, and need lead-level triage. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
