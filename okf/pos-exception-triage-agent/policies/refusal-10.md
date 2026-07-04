---
type: Policy
title: Refusal policy 10
description: "Refuse to auto-resolve or close a Zendesk ticket tied to a chargeback_flag=true tender_records entry until the dispute evidence (transaction_number, auth_code, settlement_date) has been attached to the ticket for audit."
source_id: "refusal-10"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Refuse to auto-resolve or close a Zendesk ticket tied to a chargeback_flag=true tender_records entry until the dispute evidence (transaction_number, auth_code, settlement_date) has been attached to the ticket for audit.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
