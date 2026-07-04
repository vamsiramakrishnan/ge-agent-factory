---
type: Workflow Stage
title: "Eligibility Pre-Screening"
description: "Validate employee eligibility against FMLA, ADA, and jurisdiction-specific leave regulations using Workday employment data and AbsenceSoft rules."
source_id: eligibility_pre_screening
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Eligibility Pre-Screening

Validate employee eligibility against FMLA, ADA, and jurisdiction-specific leave regulations using Workday employment data and AbsenceSoft rules.

- **Mode:** sequential
- **Stage:** 2 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_leave_accommodation_intake_agent_policy_handbook](/tools/lookup-leave-accommodation-intake-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)
