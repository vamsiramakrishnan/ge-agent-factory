---
type: Data Entity
title: billing_records
description: Data entity billing_records owned by AWS Security Hub.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# billing_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| service | lorem.words | required |
| amount | float | required |
| currency | enum | required; values: USD, EUR |
| period_start | date | required |
| period_end | date | required |

# Citations

- Owned by [AWS Security Hub](/systems/aws-security-hub.md)
