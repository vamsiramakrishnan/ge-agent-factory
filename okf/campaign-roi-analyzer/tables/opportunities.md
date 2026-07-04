---
type: Data Entity
title: opportunities
description: Data entity opportunities owned by Salesforce CRM.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# opportunities

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| account_id | seq | required |
| amount | number | required |
| stage | enum | required; values: prospecting, qualification, proposal, negotiation, closed_won, closed_lost |
| first_touch_campaign_id | ref | required |
| last_touch_campaign_id | ref | required |

# Citations

- Owned by [Salesforce CRM](/systems/salesforce-crm.md)
