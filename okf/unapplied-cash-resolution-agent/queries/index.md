---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull daily lockbox receipts and agency bulk remittance files alongside open billing_accounts and premium_invoices balances from Guidewire BillingCenter via query_guidewire_billingcenter_billing_accounts, staging every unmatched item as suspense cash.](/queries/lockbox-remittance-intake.md)
- [Score each suspense receipt against payer name, amount, and bank data using BigQuery analytics_events, historical_metrics, and cached_aggregates baselines (query_bigquery_analytics_events) to rank candidate billing_accounts and payment_plans matches.](/queries/fuzzy-suspense-matching.md)
- [Cite the Unapplied Cash Resolution Agent Authority & Referral Guide and the Cash Application Suspense Aging & Escheatment Service Level Schedule (lookup_unapplied_cash_resolution_agent_authority_guide) to confirm the auto-apply confidence tolerance and dunning-suppression rules before any post.](/queries/authority-sla-gate-check.md)
- [Post high-confidence matches straight to the billing_accounts current_balance and payment_plans installment ledger, and queue ambiguous candidates with ranked insurance_3_records case evidence (query_insurance_3_insurance_3_records) for the Cash Applications Specialist's one-click review.](/queries/auto-apply-specialist-queueing.md)
- [Suppress dunning on accounts with a pending matched receipt, execute the posting via action_guidewire_billingcenter_file with a full audit trail, and escalate suspense items aging past 15 days to the Cash Applications Specialist.](/queries/dunning-suppression-filing-audit.md)
