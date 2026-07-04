---
type: Eval Scenario
title: "For loyalty_id 482193017, pos_transactions record with transaction_number 581..."
description: "For loyalty_id 482193017, pos_transactions record with transaction_number 5814203 at store_number 214 on business_date 2026-06-29 posted a discount_amount of $58.00 against gross_sales of $42.00, and campaign_influence 'Summer Beauty Refresh' shows committed spend of $184,500 against Salesforce Marketing Cloud's $150,000 email channel cap. Score this member's next best offer and publish today's send audience."
source_id: "next-best-offer-engine-margin-breach-eval"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For loyalty_id 482193017, pos_transactions record with transaction_number 5814203 at store_number 214 on business_date 2026-06-29 posted a discount_amount of $58.00 against gross_sales of $42.00, and campaign_influence 'Summer Beauty Refresh' shows committed spend of $184,500 against Salesforce Marketing Cloud's $150,000 email channel cap. Score this member's next best offer and publish today's send audience.

## Validates

- [member-signal-unification](/queries/member-signal-unification.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Next Best Offer Engine Retail Execution Playbook](/documents/next-best-offer-engine-execution-playbook.md)
- [Loyalty Offer Margin & Liability Rate Card](/documents/next-best-offer-margin-liability-rate-card.md)
