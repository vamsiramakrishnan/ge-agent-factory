---
type: Data Entity
title: social_posts
description: Data entity social_posts owned by Sprout Social.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# social_posts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| channel | lorem.words | required |
| author | person.fullName | required |
| body | lorem.sentence | required |
| sentiment | enum | required; values: positive, neutral, negative |
| sent_at | date | required |

# Citations

- Owned by [Sprout Social](/systems/sprout-social.md)
