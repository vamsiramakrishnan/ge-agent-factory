---
type: Data Entity
title: role_templates
description: Data entity role_templates owned by Okta.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# role_templates

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| role_name | string | required |
| department | string | required |
| group_assignments | json | required |
| requires_manager_approval | boolean | required |
| segregation_of_duties_tags | json |  |

# Citations

- Owned by [Okta](/systems/okta.md)
