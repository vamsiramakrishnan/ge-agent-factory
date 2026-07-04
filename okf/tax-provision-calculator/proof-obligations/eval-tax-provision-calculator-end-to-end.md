---
type: Proof Obligation
title: "Golden eval obligation — Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-tax-provision-calculator-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [tax-provision-calculator-end-to-end](/tests/tax-provision-calculator-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_longview_onesource_longview_onesource_records](/tools/query-longview-onesource-longview-onesource-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tax_provision_calculator_controls_playbook](/tools/lookup-tax-provision-calculator-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Entities that must be referenced

- gl_entries
- longview_onesource_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [tax-provision-calculator-controls-playbook](/documents/tax-provision-calculator-controls-playbook.md)
