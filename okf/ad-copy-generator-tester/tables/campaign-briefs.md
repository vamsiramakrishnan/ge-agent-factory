---
type: Data Entity
title: campaign_briefs
description: Data entity campaign_briefs owned by Google Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# campaign_briefs

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| campaign_name | lorem.sentence | required |
| target_audience | lorem.sentence | required |
| funnel_stage | enum | required; values: awareness, consideration, conversion, retention |
| value_prop | lorem.sentence | required |
| platforms | json | required |

# Citations

- Owned by [Google Ads](/systems/google-ads.md)
