---
type: Data Entity
title: iot_rfid_events
description: Data entity iot_rfid_events owned by IoT/RFID.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# iot_rfid_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| iot_rfid_record_id | ref | required |

# Citations

- Owned by [IoT/RFID](/systems/iot-rfid.md)
