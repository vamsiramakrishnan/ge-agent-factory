---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull trades, positions, and risk_measures from Murex MX.3 (query_murex_mx_3_trades) for each desk and reconcile the overnight flash P&L run against the final Murex MX.3 end-of-day close before any attribution begins.](/queries/flash-to-final-p-l-capture.md)
- [Decompose each desk's P&L move into market-factor, new-trade, and amendment buckets by pairing positions.unrealized_gain_loss against risk_measures (desk, measure_type, measure_value) from Murex MX.3.](/queries/risk-based-attribution-decomposition.md)
- [Query analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) to match residual, unexplained breaks against the learned break-pattern library and draft a likely-cause narrative.](/queries/break-pattern-matching-against-historical-library.md)
- [Cross-check every proposed explanation against the End-of-Day P&L Attribution Analyzer Banking Compliance Policy and the Daily P&L Substantiation and Break Escalation Runbook (lookup_eod_pnl_attribution_analyzer_compliance_policy) before any recommendation leaves draft.](/queries/evidence-compliance-policy-gating.md)
- [Publish the attribution pack to Looker dashboards, execute action_murex_mx_3_publish with a full audit trail, and escalate any desk whose unexplained P&L remains above threshold to the Product Control Analyst.](/queries/sign-off-publish-desk-escalation.md)
