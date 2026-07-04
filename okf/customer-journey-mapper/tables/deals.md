---
type: Data Entity
title: deals
description: Data entity deals owned by HubSpot.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# deals

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| account_name | company.name | required |
| amount | number | required |
| stage | enum | required; values: prospecting, qualification, proposal, negotiation, closed_won, closed_lost |
| owner | person.fullName | required |
| close_date | date | required |

# Citations

- Owned by [HubSpot](/systems/hubspot.md)
