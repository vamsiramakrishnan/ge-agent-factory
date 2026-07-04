---
type: Query Capability
title: "Auto-classify columns containing PII using pattern matching and context analy..."
description: "Auto-classify columns containing PII using pattern matching and context analysis. Apply Dataplex policy tags and enforce access controls based on data sensitivity."
source_id: "pii-classification-governance"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-classify columns containing PII using pattern matching and context analysis. Apply Dataplex policy tags and enforce access controls based on data sensitivity.

## Tools used

- [query_google_dataplex_google_dataplex_records](/tools/query-google-dataplex-google-dataplex-records.md)
- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)
- [action_google_dataplex_log_entry](/tools/action-google-dataplex-log-entry.md)

## Runs in

- [pii_classification_governance](/workflow/pii-classification-governance.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

# Citations

- [Data Catalog & Lineage Agent Operations Runbook](/documents/data-catalog-lineage-agent-runbook.md)
