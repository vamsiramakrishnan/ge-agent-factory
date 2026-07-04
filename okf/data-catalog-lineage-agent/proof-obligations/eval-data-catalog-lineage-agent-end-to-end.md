---
type: Proof Obligation
title: "Golden eval obligation — Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-data-catalog-lineage-agent-end-to-end"
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

# Golden eval obligation — Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [data-catalog-lineage-agent-end-to-end](/tests/data-catalog-lineage-agent-end-to-end.md)


## Mechanisms

- [query_google_dataplex_google_dataplex_records](/tools/query-google-dataplex-google-dataplex-records.md)
- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)
- [action_google_dataplex_log_entry](/tools/action-google-dataplex-log-entry.md)

## Entities that must be referenced

- google_dataplex_records
- dbt_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute log entry without two-system evidence

# Citations

- [data-catalog-lineage-agent-runbook](/documents/data-catalog-lineage-agent-runbook.md)
