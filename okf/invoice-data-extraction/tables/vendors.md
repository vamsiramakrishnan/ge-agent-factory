---
type: Data Entity
title: vendors
description: Data entity vendors owned by SAP S/4HANA.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# vendors

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | text | required |
| alias_names | json | required |
| sap_vendor_id | text | required |
| status | enum | required; values: active, blocked, pending_compliance |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
