---
type: Workflow Stage
title: "Attribute & Cost Validation Gate"
description: "Check item_master attribute completeness and the approval_status of cost_changes against merchandise_hierarchy placement in Oracle Retail MFCS, rejecting incomplete GS1/UPC or case-pack data back to the vendor before it can reach publish."
source_id: attribute_cost_validation_gate
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Attribute & Cost Validation Gate

Check item_master attribute completeness and the approval_status of cost_changes against merchandise_hierarchy placement in Oracle Retail MFCS, rejecting incomplete GS1/UPC or case-pack data back to the vendor before it can reach publish.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_publish](/tools/action-oracle-retail-mfcs-publish.md)

Next: [Hierarchy Placement & GMROI Fit Check](/workflow/hierarchy-placement-gmroi-fit-check.md)
