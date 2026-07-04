---
type: Data Entity
title: dow_jones_risk_compliance_events
description: "Data entity dow_jones_risk_compliance_events owned by Dow Jones Risk & Compliance."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# dow_jones_risk_compliance_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| dow_jones_risk_compliance_record_id | ref | required |

# Citations

- Owned by [Dow Jones Risk & Compliance](/systems/dow-jones-risk-compliance.md)
