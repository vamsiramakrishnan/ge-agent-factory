---
type: Data Entity
title: engagement_events
description: Data entity engagement_events owned by HubSpot.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# engagement_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | person.fullName | required |
| email | internet.email | required |
| company | company.name | required |
| score | number | required |
| stage | enum | required; values: new, qualified, engaged, opportunity, lost |
| created_at | date | required |
| contact_id | ref | required |

# Citations

- Owned by [HubSpot](/systems/hubspot.md)
