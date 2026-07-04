---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest new Zendesk tickets and classify intent, priority, and category, cross-referencing macros for prior resolution patterns on similar contacts.](/queries/ticket-intake-intent-classification.md)
- [Pull order_status, promised_delivery_date, and fulfillment_method from Salesforce Commerce Cloud online_orders and correlate with cart_events to reconstruct what actually happened to the customer's purchase.](/queries/order-delivery-enrichment.md)
- [Compare the ticket's age and priority against BigQuery historical_metrics and analytics_events baselines, flagging contacts at risk of missing sla_met before the SLA clock expires.](/queries/severity-scoring-sla-check.md)
- [Check appeasement value, return eligibility, and VIP criteria against the Customer Care Triage Agent Retail Execution Playbook and the Appeasement & Return Authority Matrix before resolving where-is-my-order, return-label, or appeasement cases.](/queries/policy-gated-resolution.md)
- [Execute action_salesforce_commerce_cloud_escalate for gated cases, route unresolved tickets to the right specialist queue with a drafted response, log satisfaction_scores follow-up, and notify the Customer Care Director with a full audit trail.](/queries/routing-escalation-audit.md)
