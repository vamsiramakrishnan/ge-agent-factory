---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull billing_accounts, premium_invoices, and payment_plans for the closing period from Guidewire BillingCenter via query_guidewire_billingcenter_billing_accounts to assemble the raw commission run before any statement math begins.](/queries/commission-run-intake.md)
- [Cross-check each premium_invoices installment and payment_plans status against the Commission Chargeback & Rate Adjustment Runbook and the Authority & Referral Guide via lookup_agent_commission_reconciliation_engine_authority_guide to confirm the contracted commission rate and chargeback eligibility.](/queries/agency-rate-chargeback-verification.md)
- [Compare billing_accounts and premium_invoices against BigQuery historical_metrics and cached_aggregates baselines using query_bigquery_analytics_events to flag rate mismatches, missed chargebacks, and duplicate commission payments before they reach the statement.](/queries/variance-duplicate-payment-detection.md)
- [Draft transaction-level dispute-response evidence and publish the monthly variance dashboard in Looker's dashboards and metric_definitions via query_looker_dashboards, citing the governing runbook sections for every flagged line.](/queries/dispute-evidence-variance-reporting.md)
- [Execute action_guidewire_billingcenter_publish to release the reconciled statement in Guidewire BillingCenter once two-system evidence is gathered, emit the audit trail, and escalate exceptions above threshold to the Commission Accountant or Premium accounting supervisor.](/queries/statement-release-audit-publish.md)
