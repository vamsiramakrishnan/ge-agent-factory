---
type: Data Entity
title: interview_panels
description: Data entity interview_panels owned by Greenhouse.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# interview_panels

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| requisition_id | seq | required |
| interview_stage | enum | required; values: phone_screen, technical_interview, onsite_panel, final_round |
| panel_member_ids | string | required |
| created_at | date.pastDate | required |

# Citations

- Owned by [Greenhouse](/systems/greenhouse.md)
