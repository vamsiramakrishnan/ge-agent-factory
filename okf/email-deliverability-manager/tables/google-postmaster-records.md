---
type: Data Entity
title: google_postmaster_records
description: Data entity google_postmaster_records owned by Google Postmaster.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_postmaster_records

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

- Owned by [Google Postmaster](/systems/google-postmaster.md)
