---
type: Eval Scenario
title: Run the SOX Control Testing Agent workflow for the current period. Cite the r...
description: "Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sox-control-testing-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [evidence-collection](/queries/evidence-collection.md)

## Mechanisms to call

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sox_control_testing_agent_controls_playbook](/tools/lookup-sox-control-testing-agent-controls-playbook.md)

## Success rubric

Internal Audit Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [SOX Control Testing Agent Controls Playbook](/documents/sox-control-testing-agent-controls-playbook.md)
