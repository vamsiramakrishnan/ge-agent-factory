---
type: Data Entity
title: ad_creatives
description: Data entity ad_creatives owned by Meta Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ad_creatives

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [Meta Ads](/systems/meta-ads.md)
