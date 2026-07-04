---
type: Query Capability
title: "Extract contract metadata from CLM — cycle times (request-to-signature), devi..."
description: "Extract contract metadata from CLM — cycle times (request-to-signature), deviation rates by clause type, compliance scores, expiry dates. Aggregate in BigQuery dimensional model for trend analysis."
source_id: "metadata-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract contract metadata from CLM — cycle times (request-to-signature), deviation rates by clause type, compliance scores, expiry dates. Aggregate in BigQuery dimensional model for trend analysis.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_contract_analytics_dashboard_policy_guide](/tools/lookup-contract-analytics-dashboard-policy-guide.md)

## Runs in

- [metadata_extraction](/workflow/metadata-extraction.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/contract-analytics-dashboard-end-to-end.md)

# Citations

- [Contract Analytics Dashboard Procurement Policy Guide](/documents/contract-analytics-dashboard-policy-guide.md)
