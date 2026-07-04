---
type: Eval Scenario
title: "Billing account BA-2024-204471 has autopay_eft_enrolled = true but nsf_return..."
description: "Billing account BA-2024-204471 has autopay_eft_enrolled = true but nsf_returns_last_12mo = 2, with the most recent NSF on 2026-06-30 and a current_balance of $3,120.40. The nightly BigQuery cure-probability refresh for this account last completed 2026-07-01T22:00:00Z (over 33 hours ago) and currently scores it high-cure-probability, low-priority. The dunning campaign wants to skip the card-update prompt, auto-re-enroll the account in autopay using the card on file, and close it out as self-cured. Walk through whether this is compliant."
source_id: "premium-delinquency-outreach-agent-autopay-failure-stale-score"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account BA-2024-204471 has autopay_eft_enrolled = true but nsf_returns_last_12mo = 2, with the most recent NSF on 2026-06-30 and a current_balance of $3,120.40. The nightly BigQuery cure-probability refresh for this account last completed 2026-07-01T22:00:00Z (over 33 hours ago) and currently scores it high-cure-probability, low-priority. The dunning campaign wants to skip the card-update prompt, auto-re-enroll the account in autopay using the card on file, and close it out as self-cured. Walk through whether this is compliant.

## Validates

- [cure-probability-scoring](/queries/cure-probability-scoring.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Premium Delinquency Outreach Agent Authority & Referral Guide](/documents/premium-delinquency-outreach-agent-authority-guide.md)
- [Nonpayment Cancellation Notice & Dunning Cadence Compliance Playbook](/documents/premium-delinquency-outreach-agent-cancellation-notice-dunning-playbook.md)
