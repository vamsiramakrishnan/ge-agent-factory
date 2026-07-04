---
type: Data Entity
title: microsoft_ads_events
description: Data entity microsoft_ads_events owned by Microsoft Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# microsoft_ads_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| microsoft_ads_record_id | ref | required |

# Citations

- Owned by [Microsoft Ads](/systems/microsoft-ads.md)
