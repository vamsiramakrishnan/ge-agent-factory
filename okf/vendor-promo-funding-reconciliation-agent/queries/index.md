---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish which SKUs carry active vendor deal terms, allowance-driven cost changes, and department/class ownership (buyer_name, gmroi_target) before any funding is reconciled.](/queries/deal-cost-intake.md)
- [Match analytics_events and historical_metrics in BigQuery — the scan, markdown, and ad-placement execution feed — against the vendor's committed deal terms recorded in cost_changes to determine what should have been funded for the period.](/queries/scan-markdown-execution-matching.md)
- [Score the gap between funding collected and funding committed using cached_aggregates alongside historical_metrics in BigQuery, flagging under-collected deals and commitments approaching their claim-filing window.](/queries/collected-vs-committed-variance-scoring.md)
- [Cite the Vendor Promo Funding Reconciliation Agent Retail Execution Playbook for every flagged gap, and additionally cite the Vendor Deal Terms & Claim Substantiation Manual whenever a cost_changes allowance record or claim-filing deadline is in play.](/queries/playbook-deal-terms-evidence-gating.md)
- [Draft the substantiated funding claim or dispute response as a Looker dashboards/explore_queries/metric_definitions package with transaction-level backup, routed for Trade Promotions Analyst review.](/queries/claim-dispute-drafting.md)
- [Execute action_oracle_retail_mfcs_generate in Oracle Retail MFCS once two-system evidence and playbook/manual citations are attached, emitting a generated_audit_trail and escalating exceptions per the escalation rules.](/queries/generate-audit.md)
