---
type: Workflow Stage
title: Budget vs. Actual Extraction
description: "Pull budget and actual data from SAP and Anaplan by cost center, GL account, and profit center. Calculate variances at every level of the hierarchy."
source_id: budget_vs_actual_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Budget vs. Actual Extraction

Pull budget and actual data from SAP and Anaplan by cost center, GL account, and profit center. Calculate variances at every level of the hierarchy.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_variance_analysis_agent_controls_playbook](/tools/lookup-variance-analysis-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

Next: [Statistical Significance & Pareto](/workflow/statistical-significance-pareto.md)
