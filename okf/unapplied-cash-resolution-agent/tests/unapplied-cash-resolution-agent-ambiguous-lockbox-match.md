---
type: Eval Scenario
title: "Lockbox receipt LB-88214 for $3,412.50 from payer 'J MARTINEZ' posted 2026-07..."
description: "Lockbox receipt LB-88214 for $3,412.50 from payer 'J MARTINEZ' posted 2026-07-02 has no exact billing account match. Billing accounts BA-100542 (policy PA-77213, past_due_amount $3,412.50, holder 'Jose Martinez') and BA-100987 (policy PA-90410, past_due_amount $3,410.00, holder 'Josefina Martinez') are both plausible. Resolve where this cash should be applied."
source_id: "unapplied-cash-resolution-agent-ambiguous-lockbox-match"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lockbox receipt LB-88214 for $3,412.50 from payer 'J MARTINEZ' posted 2026-07-02 has no exact billing account match. Billing accounts BA-100542 (policy PA-77213, past_due_amount $3,412.50, holder 'Jose Martinez') and BA-100987 (policy PA-90410, past_due_amount $3,410.00, holder 'Josefina Martinez') are both plausible. Resolve where this cash should be applied.

## Validates

- [fuzzy-suspense-matching](/queries/fuzzy-suspense-matching.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Unapplied Cash Resolution Agent Authority & Referral Guide](/documents/unapplied-cash-resolution-agent-authority-guide.md)
- [Cash Application Suspense Aging & Escheatment Service Level Schedule](/documents/unapplied-cash-resolution-agent-suspense-aging-sla.md)
