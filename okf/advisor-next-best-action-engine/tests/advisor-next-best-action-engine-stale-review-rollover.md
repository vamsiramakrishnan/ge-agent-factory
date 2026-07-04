---
type: Eval Scenario
title: "Household 6042118 just had a $450,000 cash deposit hit account 84210773 (roll..."
description: "Household 6042118 just had a $450,000 cash deposit hit account 84210773 (rollover_401k) per BigQuery analytics_events dated 2026-07-02, but Salesforce shows the household's last_annual_review_date as 2024-11-03 and the related advisory_referrals record (referral_id 941220) shows suitability_status = kyc_pending. The RM wants to call today with a rollover recommendation before the balance moves elsewhere — proceed?"
source_id: "advisor-next-best-action-engine-stale-review-rollover"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household 6042118 just had a $450,000 cash deposit hit account 84210773 (rollover_401k) per BigQuery analytics_events dated 2026-07-02, but Salesforce shows the household's last_annual_review_date as 2024-11-03 and the related advisory_referrals record (referral_id 941220) shows suitability_status = kyc_pending. The RM wants to call today with a rollover recommendation before the balance moves elsewhere — proceed?

## Validates

- [next-best-action-scoring](/queries/next-best-action-scoring.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Advisor Next Best Action Engine Banking Compliance Policy](/documents/advisor-next-best-action-engine-compliance-policy.md)
- [Reg BI Rollover Suitability & Concentration Playbook](/documents/reg-bi-rollover-suitability-playbook.md)
