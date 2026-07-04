---
type: Data Entity
title: google_search_api_audit_trail
description: Data entity google_search_api_audit_trail owned by Google Search API.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_search_api_audit_trail

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [Google Search API](/systems/google-search-api.md)
