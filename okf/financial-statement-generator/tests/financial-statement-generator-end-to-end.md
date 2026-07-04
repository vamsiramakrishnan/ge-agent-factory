---
type: Eval Scenario
title: Run the Financial Statement Generator workflow for the current period. Cite t...
description: "Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "financial-statement-generator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [trial-balance-processing](/queries/trial-balance-processing.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_workiva_workiva_records](/tools/query-workiva-workiva-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_financial_statement_generator_controls_playbook](/tools/lookup-financial-statement-generator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI, with audit-trail entry and Financial Reporting Manager notified of outcomes.

# Citations

- [Financial Statement Generator Controls Playbook](/documents/financial-statement-generator-controls-playbook.md)
