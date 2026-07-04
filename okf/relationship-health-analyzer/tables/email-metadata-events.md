---
type: Data Entity
title: email_metadata_events
description: Data entity email_metadata_events owned by Email Metadata.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# email_metadata_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| email_metadata_record_id | ref | required |

# Citations

- Owned by [Email Metadata](/systems/email-metadata.md)
