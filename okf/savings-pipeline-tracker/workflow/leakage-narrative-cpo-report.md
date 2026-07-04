---
type: Workflow Stage
title: "Leakage Narrative & CPO Report"
description: "Gemini interprets why savings leaked — reads PO exception context: 'supplier couldn't meet delivery, switched to alternate at higher price' vs. 'requester specified brand name, bypassed contract.' Generates a narrative savings report explaining the gap between identified and realized savings in business terms."
source_id: leakage_narrative_cpo_report
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Leakage Narrative & CPO Report

Gemini interprets why savings leaked — reads PO exception context: 'supplier couldn't meet delivery, switched to alternate at higher price' vs. 'requester specified brand name, bypassed contract.' Generates a narrative savings report explaining the gap between identified and realized savings in business terms.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [lookup_savings_pipeline_tracker_policy_guide](/tools/lookup-savings-pipeline-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)
