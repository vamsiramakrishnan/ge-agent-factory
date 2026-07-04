---
type: Data Entity
title: quality_gates
description: Data entity quality_gates owned by SonarQube.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# quality_gates

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| severity | enum | required; values: low, medium, high, critical |
| status | enum | required; values: open, triaged, mitigated, accepted_risk, closed |
| detected_at | date | required |
| asset | lorem.words | required |

# Citations

- Owned by [SonarQube](/systems/sonarqube.md)
