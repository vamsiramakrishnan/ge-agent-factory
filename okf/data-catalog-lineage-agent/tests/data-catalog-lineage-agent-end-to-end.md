---
type: Eval Scenario
title: "Run the Data Catalog & Lineage Agent workflow for the current period. Cite th..."
description: "Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "data-catalog-lineage-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [auto-cataloging](/queries/auto-cataloging.md)

## Mechanisms to call

- [query_google_dataplex_google_dataplex_records](/tools/query-google-dataplex-google-dataplex-records.md)
- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)
- [action_google_dataplex_log_entry](/tools/action-google-dataplex-log-entry.md)

## Success rubric

Action log entry executed against Google Dataplex, with audit-trail entry and Data Platform Lead notified of outcomes.

# Citations

- [Data Catalog & Lineage Agent Operations Runbook](/documents/data-catalog-lineage-agent-runbook.md)
