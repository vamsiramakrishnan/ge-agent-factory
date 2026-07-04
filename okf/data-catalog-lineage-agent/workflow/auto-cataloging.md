---
type: Workflow Stage
title: "Auto-Cataloging"
description: "Detect new tables created in BigQuery. Auto-catalog with metadata: schema, owner, description, PII classification, and quality scores. Index in Dataplex for discovery."
source_id: auto_cataloging
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-Cataloging

Detect new tables created in BigQuery. Auto-catalog with metadata: schema, owner, description, PII classification, and quality scores. Index in Dataplex for discovery.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_google_dataplex_google_dataplex_records](/tools/query-google-dataplex-google-dataplex-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)
- [action_google_dataplex_log_entry](/tools/action-google-dataplex-log-entry.md)

Next: [Lineage Graph Construction](/workflow/lineage-graph-construction.md)
