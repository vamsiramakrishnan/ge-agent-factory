---
type: Data Entity
title: lead_touchpoints
description: Data entity lead_touchpoints owned by HubSpot.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# lead_touchpoints

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| campaign_id | ref | required |
| lead_id | seq | required |
| touchpoint_type | enum | required; values: web_visit, email_click, ad_view, form_submit |
| weight | float | required |
| timestamp | date.recent | required |

# Citations

- Owned by [HubSpot](/systems/hubspot.md)
