---
type: Eval Scenario
title: "Ticket ZD-51102 (priority P2, category 'billing') requests a second appeaseme..."
description: "Ticket ZD-51102 (priority P2, category 'billing') requests a second appeasement credit on order #513204477 ($68.20 order_total). This is the 4th Zendesk ticket referencing that same order_number in the past 6 days, the most recent online_orders query result is timestamped 2026-06-20 (14 days old), and satisfaction_scores has no record yet for this ticket. Decide whether to issue the credit."
source_id: "customer-care-triage-agent-stale-evidence-repeat-contact"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ticket ZD-51102 (priority P2, category 'billing') requests a second appeasement credit on order #513204477 ($68.20 order_total). This is the 4th Zendesk ticket referencing that same order_number in the past 6 days, the most recent online_orders query result is timestamped 2026-06-20 (14 days old), and satisfaction_scores has no record yet for this ticket. Decide whether to issue the credit.

## Validates

- [routing-escalation-audit](/queries/routing-escalation-audit.md)

## Mechanisms to call

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Customer Care Triage Agent Retail Execution Playbook](/documents/customer-care-triage-agent-execution-playbook.md)
- [Customer Care Appeasement & Return Authority Matrix](/documents/customer-care-appeasement-authority-matrix.md)
