---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the disputed payment_instructions record and any related ServiceNow tickets from FIS Payments Hub and ServiceNow, capture the cardholder's claim details, and classify the dispute to the correct Visa/Mastercard network reason code.](/queries/dispute-intake-reason-code-classification.md)
- [Compute the provisional-credit deadline and the separate network representment deadline from clearing_batches cutoff_date and settlement_window alongside payment_instructions value_date, and log both clocks before any evidence work begins.](/queries/reg-e-reg-z-deadline-clock.md)
- [Correlate settlement_records finality_status with the payment_instructions transaction detail and BigQuery analytics_events/historical_metrics baselines, citing the Card Dispute Chargeback Orchestrator Banking Compliance Policy and the Card Network Reason Code & Representment Playbook for the compelling-evidence standard that applies to the assigned reason code.](/queries/evidence-packet-assembly.md)
- [Score every open case's urgency against cached_aggregates trend data and BigQuery historical_metrics, prioritize the Dispute Resolution Specialist's queue, and open ServiceNow tickets/change_requests for merchant response follow-up.](/queries/deadline-severity-triage.md)
- [Execute action_fis_payments_hub_escalate to file the representment in FIS Payments Hub with a full audit trail, and escalate cases at risk of deadline expiry to the Dispute Resolution Specialist.](/queries/representment-filing-audit.md)
