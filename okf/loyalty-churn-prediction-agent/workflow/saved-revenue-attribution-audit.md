---
type: Workflow Stage
title: "Saved-Revenue Attribution & Audit"
description: "Reconcile post-treatment online_orders and campaign_influence conversions to attribute saved revenue, log the generated_audit_trail, and escalate anomalies to the Loyalty Program Manager or loyalty_fraud_team."
source_id: saved_revenue_attribution_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Saved-Revenue Attribution & Audit

Reconcile post-treatment online_orders and campaign_influence conversions to attribute saved revenue, log the generated_audit_trail, and escalate anomalies to the Loyalty Program Manager or loyalty_fraud_team.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)
