---
type: Eval Scenario
title: "Subscriber 3128841205 (billing_accounts id 214, account_number 40218855) show..."
description: "Subscriber 3128841205 (billing_accounts id 214, account_number 40218855) shows a SIM swap flagged high-risk at 2026-07-02 14:32 UTC. log_events shows a credential reset by the same actor 40 minutes earlier, but Splunk search_job SJ-5521 tied to that reset is already closed with no anomaly notes. The customer is now calling in demanding the international routing block on the account be lifted immediately. What do you do?"
source_id: "sim-swap-fraud-detection-monitor-conflicting-evidence"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Subscriber 3128841205 (billing_accounts id 214, account_number 40218855) shows a SIM swap flagged high-risk at 2026-07-02 14:32 UTC. log_events shows a credential reset by the same actor 40 minutes earlier, but Splunk search_job SJ-5521 tied to that reset is already closed with no anomaly notes. The customer is now calling in demanding the international routing block on the account be lifted immediately. What do you do?

## Validates

- [sim-swap-event-intake-correlation](/queries/sim-swap-event-intake-correlation.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SIM Swap Fraud Detection Monitor Service Assurance Runbook](/documents/sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [SIM Swap & Port-Out Authentication Compliance Policy](/documents/sim-swap-cpni-port-authentication-policy.md)
