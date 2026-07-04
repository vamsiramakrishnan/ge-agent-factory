---
type: Eval Scenario
title: Run the Architecture Compliance Scanner workflow for the current period. Cite...
description: "Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "architecture-compliance-scanner-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-source-scanning](/queries/multi-source-scanning.md)

## Mechanisms to call

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_architecture_compliance_scanner_runbook](/tools/lookup-architecture-compliance-scanner-runbook.md)
- [action_github_create](/tools/action-github-create.md)

## Success rubric

Action create executed against GitHub, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [Architecture Compliance Scanner Operations Runbook](/documents/architecture-compliance-scanner-runbook.md)
