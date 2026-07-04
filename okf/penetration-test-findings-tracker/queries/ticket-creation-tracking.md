---
type: Query Capability
title: "Auto-create Jira tickets with remediation guidance, assign to appropriate tea..."
description: "Auto-create Jira tickets with remediation guidance, assign to appropriate teams, and track progress against SLA targets. Verify fixes through automated retesting."
source_id: "ticket-creation-tracking"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-create Jira tickets with remediation guidance, assign to appropriate teams, and track progress against SLA targets. Verify fixes through automated retesting.

## Tools used

- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_penetration_test_findings_tracker_runbook](/tools/lookup-penetration-test-findings-tracker-runbook.md)
- [action_jira_recommend](/tools/action-jira-recommend.md)

## Runs in

- [ticket_creation_tracking](/workflow/ticket-creation-tracking.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/penetration-test-findings-tracker-end-to-end.md)

# Citations

- [Penetration Test Findings Tracker Operations Runbook](/documents/penetration-test-findings-tracker-runbook.md)
