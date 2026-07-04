---
type: Data Entity
title: gcp_cloud_storage_audit_trail
description: Data entity gcp_cloud_storage_audit_trail owned by GCP Cloud Storage.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gcp_cloud_storage_audit_trail

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

- Owned by [GCP Cloud Storage](/systems/gcp-cloud-storage.md)
