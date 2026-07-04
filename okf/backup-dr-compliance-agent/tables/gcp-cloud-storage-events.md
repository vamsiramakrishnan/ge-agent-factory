---
type: Data Entity
title: gcp_cloud_storage_events
description: Data entity gcp_cloud_storage_events owned by GCP Cloud Storage.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gcp_cloud_storage_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| gcp_cloud_storage_record_id | ref | required |

# Citations

- Owned by [GCP Cloud Storage](/systems/gcp-cloud-storage.md)
