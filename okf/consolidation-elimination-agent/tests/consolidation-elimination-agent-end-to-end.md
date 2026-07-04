---
type: Eval Scenario
title: "Run the Consolidation & Elimination Agent workflow for the current period. Ci..."
description: "Run the Consolidation & Elimination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "consolidation-elimination-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Consolidation & Elimination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ic-matching-elimination](/queries/ic-matching-elimination.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_consolidation_elimination_agent_controls_playbook](/tools/lookup-consolidation-elimination-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)

## Success rubric

Action match executed against SAP S/4HANA FI, with audit-trail entry and Financial Reporting Manager notified of outcomes.

# Citations

- [Consolidation & Elimination Agent Controls Playbook](/documents/consolidation-elimination-agent-controls-playbook.md)
