---
type: Proof Obligation
title: "Golden eval obligation — Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-architecture-compliance-scanner-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [architecture-compliance-scanner-end-to-end](/tests/architecture-compliance-scanner-end-to-end.md)


## Mechanisms

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_architecture_compliance_scanner_runbook](/tools/lookup-architecture-compliance-scanner-runbook.md)
- [action_github_create](/tools/action-github-create.md)

## Entities that must be referenced

- pull_requests
- code_smells
- tickets
- alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute create without two-system evidence

# Citations

- [architecture-compliance-scanner-runbook](/documents/architecture-compliance-scanner-runbook.md)
