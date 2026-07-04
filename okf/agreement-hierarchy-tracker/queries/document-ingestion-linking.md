---
type: Query Capability
title: "Receive new amendment, SOW, or change order. Link to parent agreement in CLM...."
description: "Receive new amendment, SOW, or change order. Link to parent agreement in CLM. Update relationship graph in BigQuery: MSA to SOW to amendments to change orders to POs. Validate linkages on each new document."
source_id: "document-ingestion-linking"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive new amendment, SOW, or change order. Link to parent agreement in CLM. Update relationship graph in BigQuery: MSA to SOW to amendments to change orders to POs. Validate linkages on each new document.

## Tools used

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agreement_hierarchy_tracker_policy_guide](/tools/lookup-agreement-hierarchy-tracker-policy-guide.md)
- [action_icertis_update](/tools/action-icertis-update.md)

## Runs in

- [document_ingestion_linking](/workflow/document-ingestion-linking.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agreement-hierarchy-tracker-end-to-end.md)

# Citations

- [Agreement Hierarchy Tracker Procurement Policy Guide](/documents/agreement-hierarchy-tracker-policy-guide.md)
