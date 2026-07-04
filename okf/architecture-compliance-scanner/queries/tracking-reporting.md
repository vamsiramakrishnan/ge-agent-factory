---
type: Query Capability
title: Create Jira tickets for violations requiring remediation. Update compliance d...
description: Create Jira tickets for violations requiring remediation. Update compliance dashboard with trends. Notify service owners of new violations.
source_id: "tracking-reporting"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create Jira tickets for violations requiring remediation. Update compliance dashboard with trends. Notify service owners of new violations.

## Tools used

- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [lookup_architecture_compliance_scanner_runbook](/tools/lookup-architecture-compliance-scanner-runbook.md)
- [action_github_create](/tools/action-github-create.md)

## Runs in

- [tracking_reporting](/workflow/tracking-reporting.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/architecture-compliance-scanner-end-to-end.md)

# Citations

- [Architecture Compliance Scanner Operations Runbook](/documents/architecture-compliance-scanner-runbook.md)
