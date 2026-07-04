---
type: Workflow Stage
title: "Playbook & Guardrail Validation"
description: "Reconcile the simulated ladder against merchandise_hierarchy markdown_budget_pct and gmroi_target, cross-check cost_changes for cost movements that could push a recommendation below unit_cost, and cite the Markdown Optimization Engine Retail Execution Playbook via lookup_markdown_optimization_engine_execution_playbook before anything is proposed."
source_id: playbook_guardrail_validation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook & Guardrail Validation

Reconcile the simulated ladder against merchandise_hierarchy markdown_budget_pct and gmroi_target, cross-check cost_changes for cost movements that could push a recommendation below unit_cost, and cite the Markdown Optimization Engine Retail Execution Playbook via lookup_markdown_optimization_engine_execution_playbook before anything is proposed.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

Next: [Escalate & Audit](/workflow/escalate-audit.md)
