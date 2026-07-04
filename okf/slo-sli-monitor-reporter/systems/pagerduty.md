---
type: Source System
title: PagerDuty
description: Incident data for SLO impact analysis and MTTR tracking
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# PagerDuty

Incident data for SLO impact analysis and MTTR tracking

- **Protocol:** REST API
- **Local backing:** bigquery

# Schema

- [incidents](/tables/incidents.md)
- [oncall_schedules](/tables/oncall-schedules.md)
- [escalation_policies](/tables/escalation-policies.md)

## Tools using this system

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
