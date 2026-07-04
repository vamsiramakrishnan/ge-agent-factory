---
type: Data Entity
title: campaign_influence
description: Data entity campaign_influence owned by Salesforce Marketing Cloud.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# campaign_influence

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| channel | enum | required; values: email, social, search, display, content, events |
| segment | enum | required; values: enterprise, mid_market, smb |
| impressions | number | required |
| conversions | number | required |
| spend | number | required |
| ctr | float | required |
| launched_on | date | required |

# Citations

- Owned by [Salesforce Marketing Cloud](/systems/salesforce-marketing-cloud.md)
