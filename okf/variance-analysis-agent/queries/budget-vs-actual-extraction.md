---
type: Query Capability
title: "Pull budget and actual data from SAP and Anaplan by cost center, GL account, ..."
description: "Pull budget and actual data from SAP and Anaplan by cost center, GL account, and profit center. Calculate variances at every level of the hierarchy."
source_id: "budget-vs-actual-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull budget and actual data from SAP and Anaplan by cost center, GL account, and profit center. Calculate variances at every level of the hierarchy.

## Tools used

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_variance_analysis_agent_controls_playbook](/tools/lookup-variance-analysis-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

## Runs in

- [budget_vs_actual_extraction](/workflow/budget-vs-actual-extraction.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Variance Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/variance-analysis-agent-end-to-end.md)

# Citations

- [Variance Analysis Agent Controls Playbook](/documents/variance-analysis-agent-controls-playbook.md)
