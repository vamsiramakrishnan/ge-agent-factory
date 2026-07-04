---
type: Query Capability
title: "Detect new tables created in BigQuery. Auto-catalog with metadata: schema, ow..."
description: "Detect new tables created in BigQuery. Auto-catalog with metadata: schema, owner, description, PII classification, and quality scores. Index in Dataplex for discovery."
source_id: "auto-cataloging"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect new tables created in BigQuery. Auto-catalog with metadata: schema, owner, description, PII classification, and quality scores. Index in Dataplex for discovery.

## Tools used

- [query_google_dataplex_google_dataplex_records](/tools/query-google-dataplex-google-dataplex-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)
- [action_google_dataplex_log_entry](/tools/action-google-dataplex-log-entry.md)

## Runs in

- [auto_cataloging](/workflow/auto-cataloging.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

# Citations

- [Data Catalog & Lineage Agent Operations Runbook](/documents/data-catalog-lineage-agent-runbook.md)
