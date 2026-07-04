---
type: Eval Scenario
title: Run the Quality Incident Analyzer workflow for the current period. Cite the r...
description: "Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "quality-incident-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ncr-intake-history-pull](/queries/ncr-intake-history-pull.md)

## Mechanisms to call

- [query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records](/tools/query-sap-qm-qm01-qm02-sap-qm-qm01-qm02-records.md)
- [query_quality_management_systems_quality_management_systems_records](/tools/query-quality-management-systems-quality-management-systems-records.md)
- [query_capa_tools_capa_tools_records](/tools/query-capa-tools-capa-tools-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_quality_incident_analyzer_policy_guide](/tools/lookup-quality-incident-analyzer-policy-guide.md)
- [action_sap_qm_qm01_qm02_generate](/tools/action-sap-qm-qm01-qm02-generate.md)

## Success rubric

Action generate executed against SAP QM (QM01/QM02), with audit-trail entry and Quality Engineer notified of outcomes.

# Citations

- [Quality Incident Analyzer Procurement Policy Guide](/documents/quality-incident-analyzer-policy-guide.md)
