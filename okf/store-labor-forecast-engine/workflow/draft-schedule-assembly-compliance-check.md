---
type: Workflow Stage
title: "Draft Schedule Assembly & Compliance Check"
description: "Draft UKG Dimensions shift_schedules against timecards-derived availability, role/skill mix, clopening_flag rest gaps, and overtime_hours exposure, blocking any draft that would breach fair-workweek posting-window rules."
source_id: draft_schedule_assembly_compliance_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft Schedule Assembly & Compliance Check

Draft UKG Dimensions shift_schedules against timecards-derived availability, role/skill mix, clopening_flag rest gaps, and overtime_hours exposure, blocking any draft that would breach fair-workweek posting-window rules.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

Next: [Playbook-Gated Recommend & Publish](/workflow/playbook-gated-recommend-publish.md)
