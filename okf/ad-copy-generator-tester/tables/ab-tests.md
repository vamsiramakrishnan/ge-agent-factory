---
type: Data Entity
title: ab_tests
description: Data entity ab_tests owned by Google Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ab_tests

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| variant_id_a | ref | required |
| variant_id_b | ref | required |
| started_at | date.past | required |
| winner_variant_id | ref |  |

# Citations

- Owned by [Google Ads](/systems/google-ads.md)
