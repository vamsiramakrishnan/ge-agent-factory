---
type: Eval Scenario
title: Run the Withholding Tax Agent workflow for the current period. Cite the relev...
description: "Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "withholding-tax-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [treaty-provision-interpretation](/queries/treaty-provision-interpretation.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_withholding_tax_agent_controls_playbook](/tools/lookup-withholding-tax-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_provision](/tools/action-sap-s-4hana-fi-provision.md)

## Success rubric

Action provision executed against SAP S/4HANA FI, with audit-trail entry and Tax Analyst notified of outcomes.

# Citations

- [Withholding Tax Agent Controls Playbook](/documents/withholding-tax-agent-controls-playbook.md)
