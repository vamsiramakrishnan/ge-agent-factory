---
type: Eval Scenario
title: Run the Agreement Hierarchy Tracker workflow for the current period. Cite the...
description: "Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "agreement-hierarchy-tracker-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [graph-analytics-orphan-detection](/queries/graph-analytics-orphan-detection.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agreement_hierarchy_tracker_policy_guide](/tools/lookup-agreement-hierarchy-tracker-policy-guide.md)
- [action_icertis_update](/tools/action-icertis-update.md)

## Success rubric

Action update executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.

# Citations

- [Agreement Hierarchy Tracker Procurement Policy Guide](/documents/agreement-hierarchy-tracker-policy-guide.md)
