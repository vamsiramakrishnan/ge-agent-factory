---
type: Policy
title: Escalation policy 8
description: "When Unit cost from Oracle Retail MFCS item_master disagrees with the BigQuery invoice-matched analytics_events value for the same SKU-vendor pair by more than 5%; action: request_more_info; handoff: Accounts Payable"
source_id: "escalation-8"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Unit cost from Oracle Retail MFCS item_master disagrees with the BigQuery invoice-matched analytics_events value for the same SKU-vendor pair by more than 5% | request_more_info | Accounts Payable | A gap this large usually signals a system-of-record mismatch rather than a true vendor miss, and must be reconciled with AP before the invoice-accuracy score is published. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
