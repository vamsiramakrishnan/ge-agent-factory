---
type: Workflow Stage
title: Variance Calculation
description: "Pull standard costs and actual production costs from SAP CO. Calculate material price, material usage, labor rate, labor efficiency, and overhead variances."
source_id: variance_calculation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Variance Calculation

Pull standard costs and actual production costs from SAP CO. Calculate material price, material usage, labor rate, labor efficiency, and overhead variances.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_standard_cost_variance_agent_controls_playbook](/tools/lookup-standard-cost-variance-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

Next: [Statistical Analysis](/workflow/statistical-analysis.md)
