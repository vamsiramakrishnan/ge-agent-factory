---
type: Policy
title: Escalation policy 8
description: "When The form_code edition_date on file predates the filing_status effective date, or the form carries file_and_use_effective/use_and_file_pending status in the risk's filing_state; action: escalate_to_human; handoff: Forms & compliance filing analyst"
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
| The form_code edition_date on file predates the filing_status effective date, or the form carries file_and_use_effective/use_and_file_pending status in the risk's filing_state | escalate_to_human | Forms & compliance filing analyst | Using a form edition outside its approved filing window in that state risks issuing a non-compliant policy contract; only the filing analyst can confirm the correct edition to bind. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
