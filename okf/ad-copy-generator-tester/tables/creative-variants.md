---
type: Data Entity
title: creative_variants
description: Data entity creative_variants owned by Google Ads.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# creative_variants

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| brief_id | ref | required |
| platform | enum | required; values: google_rsa, meta_social, linkedin_professional |
| headline | lorem.sentence | required |
| body | lorem.paragraph | required |
| cta | lorem.words | required |
| status | enum | required; values: draft, brand_approved, published, archived |

# Citations

- Owned by [Google Ads](/systems/google-ads.md)
