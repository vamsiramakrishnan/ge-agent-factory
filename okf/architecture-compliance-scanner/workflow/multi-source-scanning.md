---
type: Workflow Stage
title: "Multi-Source Scanning"
description: "Scan GitHub repositories for code-level violations (direct DB queries across boundaries, unauthorized imports). Check SonarQube for architectural rules. Compare Datadog runtime traces against declared CMDB boundaries."
source_id: multi_source_scanning
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Source Scanning

Scan GitHub repositories for code-level violations (direct DB queries across boundaries, unauthorized imports). Check SonarQube for architectural rules. Compare Datadog runtime traces against declared CMDB boundaries.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_architecture_compliance_scanner_runbook](/tools/lookup-architecture-compliance-scanner-runbook.md)
- [action_github_create](/tools/action-github-create.md)

Next: [Violation Classification](/workflow/violation-classification.md)
