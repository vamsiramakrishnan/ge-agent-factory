---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish the current SKU roster, class/subclass ownership (buyer_name, gmroi_target, markdown_budget_pct), and any pending vendor cost movement before scoring begins.](/queries/item-cost-intake.md)
- [Score SKU productivity, incrementality, and transferable demand by comparing analytics_events against historical_metrics and cached_aggregates in BigQuery for the same period and metric_name.](/queries/productivity-transferable-demand-scoring.md)
- [Cite the Assortment Rationalization Engine Retail Execution Playbook for every ranked call, and additionally cite the Vendor Trade-Funds, Allowances & SKU Discontinuation Policy whenever a cost_changes or delist rationale touches vendor allowances or discontinuation funding.](/queries/playbook-trade-terms-evidence-gating.md)
- [Draft the delist and space-reallocation proposal as a Looker dashboards/explore_queries/metric_definitions deck, attaching the evidence trail for Category Manager sign-off.](/queries/space-reallocation-deck-drafting.md)
- [Execute action_oracle_retail_mfcs_route in Oracle Retail MFCS once two-system evidence and playbook citations are attached, emitting a generated_audit_trail and escalating any exception per the escalation rules.](/queries/route-audit.md)
