---
type: Query Capability
title: "Maintain ETL/ELT pipelines from SAP, banking systems, CRM, and operational pl..."
description: "Maintain ETL/ELT pipelines from SAP, banking systems, CRM, and operational platforms into BigQuery. Validate data quality and completeness."
source_id: "data-ingestion"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Maintain ETL/ELT pipelines from SAP, banking systems, CRM, and operational platforms into BigQuery. Validate data quality and completeness.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_kpi_dashboard_builder_controls_playbook](/tools/lookup-kpi-dashboard-builder-controls-playbook.md)

## Runs in

- [data_ingestion](/workflow/data-ingestion.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/kpi-dashboard-builder-end-to-end.md)

# Citations

- [KPI Dashboard Builder Controls Playbook](/documents/kpi-dashboard-builder-controls-playbook.md)
