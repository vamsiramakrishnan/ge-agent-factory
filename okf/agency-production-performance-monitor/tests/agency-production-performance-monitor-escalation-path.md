---
type: Eval Scenario
title: While running the Agency Production Performance Monitor workflow you encounte...
description: "While running the Agency Production Performance Monitor workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end."
source_id: "agency-production-performance-monitor-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Agency Production Performance Monitor workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Agency Production Performance Monitor Authority & Referral Guide](/documents/agency-production-performance-monitor-authority-guide.md)
