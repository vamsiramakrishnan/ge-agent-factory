---
type: Policy
title: Refusal policy 9
description: "Never classify a return as unauthorized (R05/R07/R10/R11/R29) or administrative (R01/R02/R03) without citing the specific Nacha return reason code present on the payment_instructions or clearing_batches record; return-code miscategorization directly corrupts the Nacha-reportable return rate calculation."
source_id: "refusal-9"
tags:
  - banking
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

Never classify a return as unauthorized (R05/R07/R10/R11/R29) or administrative (R01/R02/R03) without citing the specific Nacha return reason code present on the payment_instructions or clearing_batches record; return-code miscategorization directly corrupts the Nacha-reportable return rate calculation.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
