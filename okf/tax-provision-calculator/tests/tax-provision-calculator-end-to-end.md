---
type: Eval Scenario
title: Run the Tax Provision Calculator workflow for the current period. Cite the re...
description: "Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "tax-provision-calculator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [provision-calculation](/queries/provision-calculation.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_longview_onesource_longview_onesource_records](/tools/query-longview-onesource-longview-onesource-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tax_provision_calculator_controls_playbook](/tools/lookup-tax-provision-calculator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI, with audit-trail entry and Tax Director notified of outcomes.

# Citations

- [Tax Provision Calculator Controls Playbook](/documents/tax-provision-calculator-controls-playbook.md)
