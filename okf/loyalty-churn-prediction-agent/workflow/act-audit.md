---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Loyalty Program Manager."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in Salesforce Commerce Cloud with a full audit trail, and escalate exceptions to the Loyalty Program Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_recommend](/tools/action-salesforce-commerce-cloud-recommend.md)
