---
type: Policy
title: Escalation policy 7
description: "When service_quotes.valid_until has lapsed and order_captures.tpv_completed is still false for a b2b_direct sales_channel capture attempting to close at the original price; action: request_more_info; handoff: B2B Sales Engineer"
source_id: "escalation-7"
tags:
  - telco
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
| service_quotes.valid_until has lapsed and order_captures.tpv_completed is still false for a b2b_direct sales_channel capture attempting to close at the original price | request_more_info | B2B Sales Engineer | An expired quote must be re-priced against the current price book before capture; honoring a lapsed discount or MRR figure understates revenue and breaks quote-to-bill reconciliation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
