---
type: Data Entity
title: gcp_cloud_storage_records
description: Data entity gcp_cloud_storage_records owned by GCP Cloud Storage.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gcp_cloud_storage_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [GCP Cloud Storage](/systems/gcp-cloud-storage.md)
