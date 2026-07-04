---
type: Eval Scenario
title: "Roaming partner Vodafone's inbound TAP file for mediation_batch 40417 shows s..."
description: "Roaming partner Vodafone's inbound TAP file for mediation_batch 40417 shows subscriber_key 3124481192 rated under rate_plan_code UNL_BASIC in rated_events at rated_amount_usd 12.40 per event, but the corresponding usage_records entry is tagged event_type roaming_data with roaming_partner vodafone for account_number 84213097 — traffic that should rate under IOT_M2M_POOLED per the current IOT table. Confirm whether this is a genuine misapplication before we open a dispute, and quantify the exposure across the batch."
source_id: "roaming-settlement-reconciliation-engine-iot-misrate-crosscheck"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Roaming partner Vodafone's inbound TAP file for mediation_batch 40417 shows subscriber_key 3124481192 rated under rate_plan_code UNL_BASIC in rated_events at rated_amount_usd 12.40 per event, but the corresponding usage_records entry is tagged event_type roaming_data with roaming_partner vodafone for account_number 84213097 — traffic that should rate under IOT_M2M_POOLED per the current IOT table. Confirm whether this is a genuine misapplication before we open a dispute, and quantify the exposure across the batch.

## Validates

- [tap-bce-file-intake-mediation-batch-validation](/queries/tap-bce-file-intake-mediation-batch-validation.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Roaming Settlement Reconciliation Engine Service Assurance Runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [GSMA IOT Rate & Roaming Settlement Manual](/documents/roaming-iot-rate-settlement-manual.md)
