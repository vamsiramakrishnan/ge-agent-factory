---
type: Policy
title: Escalation policy 8
description: "When sar_decision is continuing_activity_supplemental but no prior SAR filing reference exists in the case file for the same subject_name and account_number; action: request_more_info; handoff: financial_intelligence_unit"
source_id: "escalation-8"
tags:
  - banking
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
| sar_decision is continuing_activity_supplemental but no prior SAR filing reference exists in the case file for the same subject_name and account_number | request_more_info | financial_intelligence_unit | A supplemental continuing-activity filing presumes an initial SAR of record; without that reference the agent cannot confirm this is a valid 90-day continuation rather than a new, separately reportable case. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
