---
type: Query Capability
title: "Generate variance report with trend charts, root cause narratives, and recomm..."
description: "Generate variance report with trend charts, root cause narratives, and recommended actions. Highlight items requiring standard cost revision."
source_id: reporting
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate variance report with trend charts, root cause narratives, and recommended actions. Highlight items requiring standard cost revision.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_standard_cost_variance_agent_controls_playbook](/tools/lookup-standard-cost-variance-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Runs in

- [reporting](/workflow/reporting.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Standard Cost Variance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/standard-cost-variance-agent-end-to-end.md)

# Citations

- [Standard Cost Variance Agent Controls Playbook](/documents/standard-cost-variance-agent-controls-playbook.md)
