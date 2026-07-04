---
type: Data Entity
title: gcp_security_command_center_events
description: Data entity gcp_security_command_center_events owned by GCP Security Command Center.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gcp_security_command_center_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| gcp_security_command_center_record_id | ref | required |

# Citations

- Owned by [GCP Security Command Center](/systems/gcp-security-command-center.md)
