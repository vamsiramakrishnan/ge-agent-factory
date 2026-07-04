---
type: Query Capability
title: "Collect service-to-service call data from Datadog APM traces, declared relati..."
description: "Collect service-to-service call data from Datadog APM traces, declared relationships from CMDB, and code-level dependency declarations from GitHub. Merge into a unified graph."
source_id: "multi-source-discovery"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect service-to-service call data from Datadog APM traces, declared relationships from CMDB, and code-level dependency declarations from GitHub. Merge into a unified graph.

## Tools used

- [query_datadog_apm_alerts](/tools/query-datadog-apm-alerts.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_system_dependency_mapper_runbook](/tools/lookup-system-dependency-mapper-runbook.md)
- [action_servicenow_cmdb_recommend](/tools/action-servicenow-cmdb-recommend.md)

## Runs in

- [multi_source_discovery](/workflow/multi-source-discovery.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

# Citations

- [System Dependency Mapper Operations Runbook](/documents/system-dependency-mapper-runbook.md)
