---
type: Data Entity
title: vendors
description: Data entity vendors owned by Coupa.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# vendors

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| vendor_name | person.fullName | required |
| vendor_status | enum | required; values: active, inactive, on_hold, blocked |
| country | enum | required; values: US, DE, UK, APAC |
| payment_terms | enum | required; values: NET30, NET60, NET90 |

# Citations

- Owned by [Coupa](/systems/coupa.md)
