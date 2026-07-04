---
type: Eval Scenario
title: Run the Collections Priority Engine workflow for the current period. Cite the...
description: "Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "collections-priority-engine-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [receivables-aggregation](/queries/receivables-aggregation.md)

## Mechanisms to call

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_collections_priority_engine_controls_playbook](/tools/lookup-collections-priority-engine-controls-playbook.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Success rubric

Action recommend executed against HighRadius, with audit-trail entry and Collections Manager notified of outcomes.

# Citations

- [Collections Priority Engine Controls Playbook](/documents/collections-priority-engine-controls-playbook.md)
