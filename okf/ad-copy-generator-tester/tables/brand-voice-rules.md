---
type: Data Entity
title: brand_voice_rules
description: Data entity brand_voice_rules owned by Google Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# brand_voice_rules

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| category | enum | required; values: tone, claims, vocabulary, compliance |
| must_use | lorem.sentence | required |
| must_avoid | lorem.sentence | required |
| citation | lorem.words |  |

# Citations

- Owned by [Google Ads](/systems/google-ads.md)
