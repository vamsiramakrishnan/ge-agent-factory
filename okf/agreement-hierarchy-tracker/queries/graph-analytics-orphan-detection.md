---
type: Query Capability
title: Knowledge graph construction with lineage tracking. Detect orphan POs without...
description: Knowledge graph construction with lineage tracking. Detect orphan POs without valid parent agreements. Identify POs referencing expired or incorrect contracts. Track graph completeness metrics.
source_id: "graph-analytics-orphan-detection"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Knowledge graph construction with lineage tracking. Detect orphan POs without valid parent agreements. Identify POs referencing expired or incorrect contracts. Track graph completeness metrics.

## Tools used

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agreement_hierarchy_tracker_policy_guide](/tools/lookup-agreement-hierarchy-tracker-policy-guide.md)

## Runs in

- [graph_analytics_orphan_detection](/workflow/graph-analytics-orphan-detection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agreement-hierarchy-tracker-end-to-end.md)

# Citations

- [Agreement Hierarchy Tracker Procurement Policy Guide](/documents/agreement-hierarchy-tracker-policy-guide.md)
