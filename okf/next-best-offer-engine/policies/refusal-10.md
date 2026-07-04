---
type: Policy
title: Refusal policy 10
description: "Refuse to include a member in a decisioned send audience whose most recent tender_record shows a chargeback_flag or offline_authorization_flag still pending settlement, since payment-integrity holds must clear before further promotional spend is committed to that account."
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

Refuse to include a member in a decisioned send audience whose most recent tender_record shows a chargeback_flag or offline_authorization_flag still pending settlement, since payment-integrity holds must clear before further promotional spend is committed to that account.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
