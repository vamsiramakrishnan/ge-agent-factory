---
type: Eval Scenario
title: Run the Dunning Communication Drafter workflow for the current period. Cite t...
description: "Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dunning-communication-drafter-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [dunning-context-assembly](/queries/dunning-context-assembly.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dunning_communication_drafter_controls_playbook](/tools/lookup-dunning-communication-drafter-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

## Success rubric

Action draft executed against SAP S/4HANA FI, with audit-trail entry and AR Specialist notified of outcomes.

# Citations

- [Dunning Communication Drafter Controls Playbook](/documents/dunning-communication-drafter-controls-playbook.md)
