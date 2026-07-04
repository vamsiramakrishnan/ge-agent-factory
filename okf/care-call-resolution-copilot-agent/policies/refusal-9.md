---
type: Policy
title: Refusal policy 9
description: "Never recommend closing a ticket or logging fcr_resolved = true when the same account_number has an open P1/P2 ticket in Zendesk tied to the same category — a partial fix must stay open until the underlying ticket clears, not get counted as resolved on this contact."
source_id: "refusal-9"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.8
generation_status: generated
ge_status: generated
---

# Refusal policy 9

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.8

## Rule

Never recommend closing a ticket or logging fcr_resolved = true when the same account_number has an open P1/P2 ticket in Zendesk tied to the same category — a partial fix must stay open until the underlying ticket clears, not get counted as resolved on this contact.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
