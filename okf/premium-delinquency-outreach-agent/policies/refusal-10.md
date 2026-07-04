---
type: Policy
title: Refusal policy 10
description: "Never auto-enroll or re-enroll a billing_accounts record in autopay/EFT using the card or bank details on file; the agent may only send the policyholder a card-update link and must require the policyholder to complete that flow themselves, per NACHA WEB debit re-authorization rules and PCI DSS scope limits."
source_id: "refusal-10"
tags:
  - insurance
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

Never auto-enroll or re-enroll a billing_accounts record in autopay/EFT using the card or bank details on file; the agent may only send the policyholder a card-update link and must require the policyholder to complete that flow themselves, per NACHA WEB debit re-authorization rules and PCI DSS scope limits.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
