---
type: Eval Scenario
title: Run the Dispute Resolution Agent workflow for the current period. Cite the re...
description: "Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dispute-resolution-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [evidence-cross-reference](/queries/evidence-cross-reference.md)

## Mechanisms to call

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_salesforce_accounts](/tools/query-salesforce-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dispute_resolution_agent_controls_playbook](/tools/lookup-dispute-resolution-agent-controls-playbook.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Success rubric

Action recommend executed against HighRadius, with audit-trail entry and AR Specialist notified of outcomes.

# Citations

- [Dispute Resolution Agent Controls Playbook](/documents/dispute-resolution-agent-controls-playbook.md)
