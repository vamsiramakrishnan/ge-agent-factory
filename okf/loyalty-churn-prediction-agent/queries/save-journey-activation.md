---
type: Query Capability
title: Execute action_salesforce_commerce_cloud_recommend to trigger the selected sa...
description: "Execute action_salesforce_commerce_cloud_recommend to trigger the selected save journey in Salesforce Marketing Cloud once two-system evidence gates from Salesforce Commerce Cloud and Salesforce Marketing Cloud are satisfied."
source_id: "save-journey-activation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_salesforce_commerce_cloud_recommend to trigger the selected save journey in Salesforce Marketing Cloud once two-system evidence gates from Salesforce Commerce Cloud and Salesforce Marketing Cloud are satisfied.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_salesforce_commerce_cloud_recommend](/tools/action-salesforce-commerce-cloud-recommend.md)

## Runs in

- [save_journey_activation](/workflow/save-journey-activation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loyalty-churn-prediction-agent-end-to-end.md)
- [Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment.](/tests/loyalty-churn-prediction-agent-conflicting-engagement-signal.md)
- [Loyalty account tied to accounts record for Meridian Retail Partners redeemed 48,750 points between 2026-07-01 08:00 and 2026-07-02 07:45 (trailing 24 hours), against a trailing-90-day average daily earn of 3,200 points — an 11.2x velocity spike per analytics_events. The account is also flagged in this week's churn-scoring batch as a top save-treatment candidate. Should we proceed with the concierge outreach and points-bonus offer for this account this week?](/tests/loyalty-churn-prediction-agent-points-velocity-threshold-edge.md)

# Citations

- [Loyalty Churn Prediction Agent Retail Execution Playbook](/documents/loyalty-churn-prediction-agent-execution-playbook.md)
- [Loyalty Points Liability & Redemption Policy](/documents/loyalty-points-liability-redemption-policy.md)
