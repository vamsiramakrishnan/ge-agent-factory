---
type: Policy
title: Escalation policy 8
description: "When LexisNexis prefill_datasets match_confidence is below 0.65 for garaging address or primary driver at bind; action: request_more_info; handoff: Underwriting Fraud Analyst"
source_id: "escalation-8"
tags:
  - insurance
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
| LexisNexis prefill_datasets match_confidence is below 0.65 for garaging address or primary driver at bind | request_more_info | Underwriting Fraud Analyst | A low-confidence identity match cannot support a bind decision; the analyst must order a fresh verification pull before issue. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
