---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the vendor-submitted item_master record (SKU, UPC, department, brand, unit_cost, base_retail, case_pack) and the linked cost_changes row from Oracle Retail MFCS as soon as the new-item form lands, before any hierarchy or price work begins.](/queries/vendor-item-setup-intake.md)
- [Check item_master attribute completeness and the approval_status of cost_changes against merchandise_hierarchy placement in Oracle Retail MFCS, rejecting incomplete GS1/UPC or case-pack data back to the vendor before it can reach publish.](/queries/attribute-cost-validation-gate.md)
- [Compare the item's proposed department_number/class_number placement and margin against merchandise_hierarchy.gmroi_target and markdown_budget_pct, using BigQuery historical_metrics and analytics_events as the baseline for cycle-time and cost-error variance.](/queries/hierarchy-placement-gmroi-fit-check.md)
- [Cite the New Item Launch Orchestrator Retail Execution Playbook's setup and escalation sections, then call action_oracle_retail_mfcs_publish to activate the item and its opening price/allocation in Oracle Retail MFCS with a full audit trail.](/queries/first-allocation-price-activation-publish.md)
- [Query Looker dashboards to publish the launch-readiness scorecard for the item and escalate any blocked setup, allocation, or GMROI step to the Category Manager queue.](/queries/launch-readiness-scorecard-escalation.md)
