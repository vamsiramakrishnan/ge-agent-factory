---
type: Data Entity
title: legal_playbook_audit_trail
description: Data entity legal_playbook_audit_trail owned by Legal Playbook.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# legal_playbook_audit_trail

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

- Owned by [Legal Playbook](/systems/legal-playbook.md)
