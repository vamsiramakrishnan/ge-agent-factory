---
type: Policy
title: Refusal policy 9
description: "Refuse to authorize or advise closing out an offline/EMV-fallback transaction whose tender_amount exceeds the card-network floor limit documented in the EMV Fallback & Offline Authorization Risk Bulletin without card-network risk team sign-off; unauthorized fallback above the limit shifts chargeback liability to the store."
source_id: "refusal-9"
tags:
  - retail
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

Refuse to authorize or advise closing out an offline/EMV-fallback transaction whose tender_amount exceeds the card-network floor limit documented in the EMV Fallback & Offline Authorization Risk Bulletin without card-network risk team sign-off; unauthorized fallback above the limit shifts chargeback liability to the store.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
