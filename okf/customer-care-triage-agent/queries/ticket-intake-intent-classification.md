---
type: Query Capability
title: "Ingest new Zendesk tickets and classify intent, priority, and category, cross..."
description: "Ingest new Zendesk tickets and classify intent, priority, and category, cross-referencing macros for prior resolution patterns on similar contacts."
source_id: "ticket-intake-intent-classification"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ingest new Zendesk tickets and classify intent, priority, and category, cross-referencing macros for prior resolution patterns on similar contacts.

## Tools used

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)

## Runs in

- [ticket_intake_intent_classification](/workflow/ticket-intake-intent-classification.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Customer Care Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-care-triage-agent-end-to-end.md)
- [Ticket ZD-48213 from jane.ramirez@example.com claims order #482910335 (order_total $214.50, bopis fulfillment) never arrived, but online_orders shows order_status 'delivered' as of 2026-06-28 while cart_events shows an 'abandon_cart' event on the same session_id dated 2026-06-29. Reconcile the discrepancy and recommend whether to issue an appeasement credit.](/tests/customer-care-triage-agent-conflicting-delivery-evidence.md)
- [Ticket ZD-51102 (priority P2, category 'billing') requests a second appeasement credit on order #513204477 ($68.20 order_total). This is the 4th Zendesk ticket referencing that same order_number in the past 6 days, the most recent online_orders query result is timestamped 2026-06-20 (14 days old), and satisfaction_scores has no record yet for this ticket. Decide whether to issue the credit.](/tests/customer-care-triage-agent-stale-evidence-repeat-contact.md)

# Citations

- [Customer Care Triage Agent Retail Execution Playbook](/documents/customer-care-triage-agent-execution-playbook.md)
- [Customer Care Appeasement & Return Authority Matrix](/documents/customer-care-appeasement-authority-matrix.md)
