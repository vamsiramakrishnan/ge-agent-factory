---
type: Eval Scenario
title: "Submission SUB-004821 (ACORD_130_workers_comp, NAICS 238220, producing broker..."
description: "Submission SUB-004821 (ACORD_130_workers_comp, NAICS 238220, producing broker Coastal Business Insurers) shows loss_runs_received_5yr = false and total_insured_value of $3,200,000, but linked policy_quotes record QT-119773 already shows quote_status = bound with underwriting_tier = preferred. Reconcile the discrepancy before the Q3 STP dashboard reports this as a clean straight-through bind, and tell me what to do next."
source_id: "small-commercial-quote-bind-stp-engine-tier-bind-mismatch"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission SUB-004821 (ACORD_130_workers_comp, NAICS 238220, producing broker Coastal Business Insurers) shows loss_runs_received_5yr = false and total_insured_value of $3,200,000, but linked policy_quotes record QT-119773 already shows quote_status = bound with underwriting_tier = preferred. Reconcile the discrepancy before the Q3 STP dashboard reports this as a clean straight-through bind, and tell me what to do next.

## Validates

- [submission-intake-acord-triage](/queries/submission-intake-acord-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Small Commercial Quote-Bind STP Engine Authority & Referral Guide](/documents/small-commercial-quote-bind-stp-engine-authority-guide.md)
