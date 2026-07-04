---
type: Query Capability
title: "Scan GitHub repositories for code-level violations (direct DB queries across ..."
description: "Scan GitHub repositories for code-level violations (direct DB queries across boundaries, unauthorized imports). Check SonarQube for architectural rules. Compare Datadog runtime traces against declared CMDB boundaries."
source_id: "multi-source-scanning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan GitHub repositories for code-level violations (direct DB queries across boundaries, unauthorized imports). Check SonarQube for architectural rules. Compare Datadog runtime traces against declared CMDB boundaries.

## Tools used

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_architecture_compliance_scanner_runbook](/tools/lookup-architecture-compliance-scanner-runbook.md)
- [action_github_create](/tools/action-github-create.md)

## Runs in

- [multi_source_scanning](/workflow/multi-source-scanning.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/architecture-compliance-scanner-end-to-end.md)

# Citations

- [Architecture Compliance Scanner Operations Runbook](/documents/architecture-compliance-scanner-runbook.md)
