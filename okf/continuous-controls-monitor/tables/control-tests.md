---
type: Data Entity
title: control_tests
description: Data entity control_tests owned by SAP GRC.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# control_tests

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| status | enum | required; values: open, in_progress, certified, exception |
| owner | person.fullName | required |
| match_rate | float | required |
| last_run | date | required |

# Citations

- Owned by [SAP GRC](/systems/sap-grc.md)
