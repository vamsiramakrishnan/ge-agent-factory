---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull payment_instructions and clearing_batches kicked to the repair queue from the FIS Payments Hub and correlate open ServiceNow tickets to separate known root causes (prior BIC/ABA errors, duplicate NOAD) from novel exceptions.](/queries/repair-queue-intake-triage.md)
- [Reconstruct the correct beneficiary_aba_routing and originator_name on each payment_instructions record by cross-referencing settlement_records history and BigQuery historical_metrics/analytics_events baselines for the same corridor.](/queries/beneficiary-data-reconstruction.md)
- [Check ofac_screening_status on payment_instructions and evaluate business-email-compromise indicators against the Wire Exception Repair Agent Banking Compliance Policy before any candidate repair can be released.](/queries/sanctions-bec-risk-screening.md)
- [Apply high-confidence corrections directly to payment_instructions, or route ambiguous cases with ranked candidate fixes to a repair clerk, then call action_fis_payments_hub_escalate for anything requiring supervisor sign-off.](/queries/confidence-scored-repair-release.md)
- [Track clearing_batches cutoff_date and settlement_window against repair-queue depth and ServiceNow ticket volume, notifying the Payments Operations Manager before a same-day cutoff is missed.](/queries/cutoff-monitoring-queue-escalation.md)
