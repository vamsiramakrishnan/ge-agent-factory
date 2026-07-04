---
type: Data Entity
title: policy_docs_records
description: Data entity policy_docs_records owned by Policy docs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# policy_docs_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| category | enum | required; values: compliance, operational, financial, security |
| owner | person.fullName | required |
| status | enum | required; values: active, draft, retired |
| last_updated | date | required |

# Citations

- Owned by [Policy docs](/systems/policy-docs.md)
