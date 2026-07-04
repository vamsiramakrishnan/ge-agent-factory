---
type: Policy
title: Escalation policy 5
description: "When A proposed bulk catalog action would suppress, discontinue, or re-categorize more than 500 live SKUs in one operation.; action: request_more_info; handoff: site_merchandising_lead"
source_id: "escalation-5"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A proposed bulk catalog action would suppress, discontinue, or re-categorize more than 500 live SKUs in one operation. | request_more_info | site_merchandising_lead | Bulk suppressions destroy SEO equity and active cart lines; the change set needs review against traffic and open-order exposure before execution. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
