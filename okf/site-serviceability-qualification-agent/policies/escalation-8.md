---
type: Policy
title: Escalation policy 8
description: "When Fuzzy address match confidence between the CRM-submitted address (subscriber_accounts/service_quotes) and the TELCO 3 facilities record falls below 90%; action: request_more_info; handoff: sales_solution_consultant"
source_id: "escalation-8"
tags:
  - telco
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
| Fuzzy address match confidence between the CRM-submitted address (subscriber_accounts/service_quotes) and the TELCO 3 facilities record falls below 90% | request_more_info | sales_solution_consultant | Low-confidence address matches produce the false negatives and false positives that kill viable deals or misqualify ineligible sites; a human must confirm the canonical address before the serviceability matrix publishes. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
