---
type: Workflow Stage
title: "Graph Analytics & Orphan Detection"
description: Knowledge graph construction with lineage tracking. Detect orphan POs without valid parent agreements. Identify POs referencing expired or incorrect contracts. Track graph completeness metrics.
source_id: graph_analytics_orphan_detection
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Graph Analytics & Orphan Detection

Knowledge graph construction with lineage tracking. Detect orphan POs without valid parent agreements. Identify POs referencing expired or incorrect contracts. Track graph completeness metrics.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agreement_hierarchy_tracker_policy_guide](/tools/lookup-agreement-hierarchy-tracker-policy-guide.md)

Next: [Conflict & Scope Resolution](/workflow/conflict-scope-resolution.md)
