---
type: Policy
title: Escalation policy 8
description: "When Three consecutive Salesforce Marketing Cloud re-engagement campaigns for the same agency in campaign_influence produce zero conversions; action: request_more_info; handoff: Agency Distribution Manager"
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
| Three consecutive Salesforce Marketing Cloud re-engagement campaigns for the same agency in campaign_influence produce zero conversions | request_more_info | Agency Distribution Manager | Repeated non-response suggests the outreach channel or offer is wrong, not that more automated campaigns will help; the distribution manager needs to confirm the agency's current status before another campaign is queued. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
