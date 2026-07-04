---
type: Data Entity
title: campaigns
description: Data entity campaigns owned by HubSpot.
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
| source_record_id | seq | required |
| campaign_name | company.bs | required |
| channel | enum | required; values: email, linkedin, google_ads, facebook, content |
| cost_to_date | number | required |
| start_date | date.past | required |

# Citations

- Owned by [HubSpot](/systems/hubspot.md)
