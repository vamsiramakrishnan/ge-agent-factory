---
type: Data Entity
title: spend_records
description: Data entity spend_records owned by LinkedIn Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# spend_records

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

- Owned by [LinkedIn Ads](/systems/linkedin-ads.md)
