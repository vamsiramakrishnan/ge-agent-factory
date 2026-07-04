---
type: Proof Obligation
title: "Golden eval obligation — Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-quality-incident-analyzer-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [quality-incident-analyzer-end-to-end](/tests/quality-incident-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_qm_qm01_qm02_sap_qm_qm01_qm02_records](/tools/query-sap-qm-qm01-qm02-sap-qm-qm01-qm02-records.md)
- [query_quality_management_systems_quality_management_systems_records](/tools/query-quality-management-systems-quality-management-systems-records.md)
- [query_capa_tools_capa_tools_records](/tools/query-capa-tools-capa-tools-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_quality_incident_analyzer_policy_guide](/tools/lookup-quality-incident-analyzer-policy-guide.md)
- [action_sap_qm_qm01_qm02_generate](/tools/action-sap-qm-qm01-qm02-generate.md)

## Entities that must be referenced

- sap_qm_qm01_qm02_records
- quality_management_systems_records
- capa_tools_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [quality-incident-analyzer-policy-guide](/documents/quality-incident-analyzer-policy-guide.md)
