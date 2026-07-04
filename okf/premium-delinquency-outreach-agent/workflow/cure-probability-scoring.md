---
type: Workflow Stage
title: "Cure-Probability Scoring"
description: "Score every reconciled billing_accounts record against analytics_events and historical_metrics in BigQuery, weighting payment history, nsf_returns_last_12mo, autopay_eft_enrolled status, and policy tenure to rank accounts by self-cure likelihood."
source_id: cure_probability_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cure-Probability Scoring

Score every reconciled billing_accounts record against analytics_events and historical_metrics in BigQuery, weighting payment history, nsf_returns_last_12mo, autopay_eft_enrolled status, and policy tenure to rank accounts by self-cure likelihood.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)

Next: [Channel Eligibility & Campaign Suppression](/workflow/channel-eligibility-campaign-suppression.md)
