---
type: Data Entity
title: peer_access_patterns
description: Data entity peer_access_patterns owned by BigQuery.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# peer_access_patterns

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| role | string | required |
| department | string | required |
| common_groups | json | required |
| anomaly_score | number | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)
