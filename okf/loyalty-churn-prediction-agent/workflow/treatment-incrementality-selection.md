---
type: Workflow Stage
title: "Treatment & Incrementality Selection"
description: "Match each at-risk member's accounts and campaign_influence history in Salesforce Marketing Cloud against predicted incrementality, then confirm the treatment tier — points bonus, category offer, or concierge outreach — against the Retail Execution Playbook and the Loyalty Points Liability & Redemption Policy."
source_id: treatment_incrementality_selection
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Treatment & Incrementality Selection

Match each at-risk member's accounts and campaign_influence history in Salesforce Marketing Cloud against predicted incrementality, then confirm the treatment tier — points bonus, category offer, or concierge outreach — against the Retail Execution Playbook and the Loyalty Points Liability & Redemption Policy.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_recommend](/tools/action-salesforce-commerce-cloud-recommend.md)

Next: [Save-Journey Activation](/workflow/save-journey-activation.md)
