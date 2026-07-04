---
type: Data Entity
title: policy_docs_events
description: Data entity policy_docs_events owned by Policy docs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# policy_docs_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| category | enum | required; values: compliance, operational, financial, security |
| owner | person.fullName | required |
| status | enum | required; values: active, draft, retired |
| last_updated | date | required |
| policy_docs_record_id | ref | required |

# Citations

- Owned by [Policy docs](/systems/policy-docs.md)
