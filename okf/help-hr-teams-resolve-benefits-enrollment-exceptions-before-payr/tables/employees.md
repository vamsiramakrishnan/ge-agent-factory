---
type: Data Entity
title: employees
description: Data entity employees owned by SAP S/4HANA FI.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# employees

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | string | required |
| email | string | required |
| status | enum | required; values: active, terminated, on_leave |
| benefit_status | enum | required; values: eligible, ineligible |

# Citations

- Owned by [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
