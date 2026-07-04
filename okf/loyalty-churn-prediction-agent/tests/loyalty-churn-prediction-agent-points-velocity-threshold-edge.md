---
type: Eval Scenario
title: Loyalty account tied to accounts record for Meridian Retail Partners redeemed...
description: "Loyalty account tied to accounts record for Meridian Retail Partners redeemed 48,750 points between 2026-07-01 08:00 and 2026-07-02 07:45 (trailing 24 hours), against a trailing-90-day average daily earn of 3,200 points — an 11.2x velocity spike per analytics_events. The account is also flagged in this week's churn-scoring batch as a top save-treatment candidate. Should we proceed with the concierge outreach and points-bonus offer for this account this week?"
source_id: "loyalty-churn-prediction-agent-points-velocity-threshold-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loyalty account tied to accounts record for Meridian Retail Partners redeemed 48,750 points between 2026-07-01 08:00 and 2026-07-02 07:45 (trailing 24 hours), against a trailing-90-day average daily earn of 3,200 points — an 11.2x velocity spike per analytics_events. The account is also flagged in this week's churn-scoring batch as a top save-treatment candidate. Should we proceed with the concierge outreach and points-bonus offer for this account this week?

## Validates

- [member-signal-ingestion](/queries/member-signal-ingestion.md)

## Mechanisms to call

- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loyalty Points Liability & Redemption Policy](/documents/loyalty-points-liability-redemption-policy.md)
- [Loyalty Churn Prediction Agent Retail Execution Playbook](/documents/loyalty-churn-prediction-agent-execution-playbook.md)
