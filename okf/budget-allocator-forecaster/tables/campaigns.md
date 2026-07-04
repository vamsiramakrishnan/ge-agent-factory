---
type: Data Entity
title: campaigns
description: Data entity campaigns owned by Google Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# campaigns

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

- Owned by [Google Ads](/systems/google-ads.md)
