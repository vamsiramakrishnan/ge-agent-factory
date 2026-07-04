---
type: Data Entity
title: legal_knowledge_base_audit_trail
description: Data entity legal_knowledge_base_audit_trail owned by Legal Knowledge Base.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# legal_knowledge_base_audit_trail

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| owner | person.fullName | required |
| status | enum | required; values: draft, review, published, archived |
| last_updated | date | required |

# Citations

- Owned by [Legal Knowledge Base](/systems/legal-knowledge-base.md)
