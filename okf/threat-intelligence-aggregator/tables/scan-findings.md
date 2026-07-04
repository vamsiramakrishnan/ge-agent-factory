---
type: Data Entity
title: scan_findings
description: Data entity scan_findings owned by CrowdStrike Falcon.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# scan_findings

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

- Owned by [CrowdStrike Falcon](/systems/crowdstrike-falcon.md)
