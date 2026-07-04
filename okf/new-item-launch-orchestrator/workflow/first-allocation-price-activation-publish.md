---
type: Workflow Stage
title: "First Allocation & Price Activation Publish"
description: "Cite the New Item Launch Orchestrator Retail Execution Playbook's setup and escalation sections, then call action_oracle_retail_mfcs_publish to activate the item and its opening price/allocation in Oracle Retail MFCS with a full audit trail."
source_id: first_allocation_price_activation_publish
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# First Allocation & Price Activation Publish

Cite the New Item Launch Orchestrator Retail Execution Playbook's setup and escalation sections, then call action_oracle_retail_mfcs_publish to activate the item and its opening price/allocation in Oracle Retail MFCS with a full audit trail.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_publish](/tools/action-oracle-retail-mfcs-publish.md)

Next: [Launch Readiness Scorecard & Escalation](/workflow/launch-readiness-scorecard-escalation.md)
