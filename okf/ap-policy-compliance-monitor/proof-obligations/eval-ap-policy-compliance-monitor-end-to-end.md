---
type: Proof Obligation
title: "Golden eval obligation — Run the AP Policy Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ap-policy-compliance-monitor-end-to-end"
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

# Golden eval obligation — Run the AP Policy Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ap-policy-compliance-monitor-end-to-end](/tests/ap-policy-compliance-monitor-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ap_policy_compliance_monitor_controls_playbook](/tools/lookup-ap-policy-compliance-monitor-controls-playbook.md)

## Entities that must be referenced

- gl_entries
- requisitions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [ap-policy-compliance-monitor-controls-playbook](/documents/ap-policy-compliance-monitor-controls-playbook.md)
