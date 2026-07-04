---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull current price_recommendations and price_zones from Revionics Price Optimization by sku and price_zone_id to establish the price of record for the audit window.](/queries/price-of-record-intake.md)
- [Correlate pos_transactions, tender_records, and store_shift_summaries from Oracle Xstore POS against the Revionics price of record by store_number and transaction_number to surface scan mismatches.](/queries/pos-scan-reconciliation.md)
- [Score detected mismatches against analytics_events, historical_metrics, and cached_aggregates in BigQuery to separate one-off register errors from systemic price-zone feed failures and rank the Pricing Operations Manager's queue.](/queries/variance-scoring-trend-baseline.md)
- [Validate every finding against the Price Execution Audit Monitor Retail Execution Playbook and the Scanner Price Accuracy & Weights-and-Measures Compliance Bulletin, citing the governing section before any fix-it task or escalation is issued.](/queries/guardrail-playbook-validation.md)
- [Execute action_oracle_xstore_pos_escalate to raise store-level fix-it tasks or systemic feed-failure escalations to the Pricing Operations Manager, attaching the full audit trail.](/queries/fix-it-dispatch-escalation.md)
