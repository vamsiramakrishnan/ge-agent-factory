---
type: Query Capability
title: Pull standard costs and actual production costs from SAP CO. Calculate materi...
description: "Pull standard costs and actual production costs from SAP CO. Calculate material price, material usage, labor rate, labor efficiency, and overhead variances."
source_id: "variance-calculation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull standard costs and actual production costs from SAP CO. Calculate material price, material usage, labor rate, labor efficiency, and overhead variances.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_standard_cost_variance_agent_controls_playbook](/tools/lookup-standard-cost-variance-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Runs in

- [variance_calculation](/workflow/variance-calculation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Standard Cost Variance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/standard-cost-variance-agent-end-to-end.md)

# Citations

- [Standard Cost Variance Agent Controls Playbook](/documents/standard-cost-variance-agent-controls-playbook.md)
