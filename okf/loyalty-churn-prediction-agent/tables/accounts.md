---
type: Data Entity
title: accounts
description: Data entity accounts owned by Salesforce Marketing Cloud.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# accounts

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

- Owned by [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md)
