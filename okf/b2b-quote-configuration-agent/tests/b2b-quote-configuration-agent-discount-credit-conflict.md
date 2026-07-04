---
type: Eval Scenario
title: "Quote #24783011 for 'Meridian Logistics Group' shows mrr_usd=$5,240 on a term..."
description: "Quote #24783011 for 'Meridian Logistics Group' shows mrr_usd=$5,240 on a term_36 contract, discount_pct=22.5%, and credit_check_status=deposit_required. The seller wants to push this straight to order capture today to hit end-of-month. Reconcile the discrepancy and tell me what has to happen before this quote can move."
source_id: "b2b-quote-configuration-agent-discount-credit-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quote #24783011 for 'Meridian Logistics Group' shows mrr_usd=$5,240 on a term_36 contract, discount_pct=22.5%, and credit_check_status=deposit_required. The seller wants to push this straight to order capture today to hit end-of-month. Reconcile the discrepancy and tell me what has to happen before this quote can move.

## Validates

- [opportunity-site-intake](/queries/opportunity-site-intake.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [B2B Quote Configuration Agent Service Assurance Runbook](/documents/b2b-quote-configuration-agent-assurance-runbook.md)
- [B2B Rate Card & Discount Authority Matrix](/documents/b2b-quote-configuration-agent-rate-discount-manual.md)
