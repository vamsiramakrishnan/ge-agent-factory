---
type: Eval Scenario
title: "Quote Q-10456 shows a prior_carrier premium of $1,180 against our current ann..."
description: "Quote Q-10456 shows a prior_carrier premium of $1,180 against our current annual_premium of $2,140 on POL-0039217 (personal_auto, TX). The named insured says match it or they walk. The most recent BigQuery analytics_events refresh for this segment is timestamped 39 hours ago. Build and send the save offer now."
source_id: "midterm-cancellation-retention-agent-stale-evidence-lowball-quote"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quote Q-10456 shows a prior_carrier premium of $1,180 against our current annual_premium of $2,140 on POL-0039217 (personal_auto, TX). The named insured says match it or they walk. The most recent BigQuery analytics_events refresh for this segment is timestamped 39 hours ago. Build and send the save offer now.

## Validates

- [cancellation-signal-intake](/queries/cancellation-signal-intake.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Mid-Term Cancellation Retention Agent Authority & Referral Guide](/documents/midterm-cancellation-retention-agent-authority-guide.md)
- [Mid-Term Cancellation Save-Offer Pricing & Discount Eligibility Rate Manual](/documents/midterm-cancellation-retention-agent-save-offer-rate-manual.md)
