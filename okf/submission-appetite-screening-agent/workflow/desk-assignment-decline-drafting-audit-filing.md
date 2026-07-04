---
type: Workflow Stage
title: "Desk Assignment, Decline Drafting & Audit Filing"
description: "Execute action_guidewire_policycenter_file to route in-appetite submissions to the assigned_underwriter's desk or draft the decline letter for submission_status = declined_appetite risk, logging generated_audit_trail on every disposition."
source_id: desk_assignment_decline_drafting_audit_filing
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Desk Assignment, Decline Drafting & Audit Filing

Execute action_guidewire_policycenter_file to route in-appetite submissions to the assigned_underwriter's desk or draft the decline letter for submission_status = declined_appetite risk, logging generated_audit_trail on every disposition.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)
- [action_guidewire_policycenter_file](/tools/action-guidewire-policycenter-file.md)
