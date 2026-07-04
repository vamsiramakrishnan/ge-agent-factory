---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the multi-site opportunity from Salesforce Communications Cloud — subscriber_accounts and service_quotes (business_name, product_bundle, contract_term, mrr_usd) — via query_salesforce_communications_cloud_subscriber_accounts to fix scope before any line item is priced.](/queries/opportunity-site-intake.md)
- [Confirm serviceability_confirmed per site and credit_check_status on service_quotes before pricing; unconfirmed access or a declined/deposit_required credit result blocks the quote from advancing to the price book step.](/queries/serviceability-credit-gating.md)
- [Apply the current product_bundle price book and discount_pct against the approved delegation-of-authority band, checking query_bigquery_analytics_events and historical_metrics baselines in BigQuery against the Quote turnaround time and configuration error-rate KPIs.](/queries/price-book-discount-band-application.md)
- [Cross-check discount, credit, and serviceability findings against the B2B Quote Configuration Agent Service Assurance Runbook and the B2B Rate & Discount Authority Matrix via lookup_b2b_quote_configuration_agent_assurance_runbook, citing sections before any recommendation and routing out-of-band discount_pct or contract_term exceptions to sales_pricing_desk or enterprise_deal_desk.](/queries/evidence-validation-deal-desk-gate.md)
- [Draft the customer-ready proposal and execute action_salesforce_communications_cloud_route to push the validated quote into order_captures, confirming tpv_completed and esign_completed before the audit trail closes the workflow.](/queries/proposal-drafting-order-capture-routing.md)
