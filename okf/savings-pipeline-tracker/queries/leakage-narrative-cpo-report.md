---
type: Query Capability
title: "Gemini interprets why savings leaked — reads PO exception context: 'supplier ..."
description: "Gemini interprets why savings leaked — reads PO exception context: 'supplier couldn't meet delivery, switched to alternate at higher price' vs. 'requester specified brand name, bypassed contract.' Generates a narrative savings report explaining the gap between identified and realized savings in business terms."
source_id: "leakage-narrative-cpo-report"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets why savings leaked — reads PO exception context: 'supplier couldn't meet delivery, switched to alternate at higher price' vs. 'requester specified brand name, bypassed contract.' Generates a narrative savings report explaining the gap between identified and realized savings in business terms.

## Tools used

- [lookup_savings_pipeline_tracker_policy_guide](/tools/lookup-savings-pipeline-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Runs in

- [leakage_narrative_cpo_report](/workflow/leakage-narrative-cpo-report.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Savings Pipeline Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/savings-pipeline-tracker-end-to-end.md)

# Citations

- [Savings Pipeline Tracker Procurement Policy Guide](/documents/savings-pipeline-tracker-policy-guide.md)
