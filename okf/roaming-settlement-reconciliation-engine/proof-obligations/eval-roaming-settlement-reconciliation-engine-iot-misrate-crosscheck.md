---
type: Proof Obligation
title: "Golden eval obligation — Roaming partner Vodafone's inbound TAP file for mediation_batch 40417 shows subscriber_key 3124481192 rated under rate_plan_code UNL_BASIC in rated_events at rated_amount_usd 12.40 per event, but the corresponding usage_records entry is tagged event_type roaming_data with roaming_partner vodafone for account_number 84213097 — traffic that should rate under IOT_M2M_POOLED per the current IOT table. Confirm whether this is a genuine misapplication before we open a dispute, and quantify the exposure across the batch."
description: golden eval proof obligation
source_id: "eval-roaming-settlement-reconciliation-engine-iot-misrate-crosscheck"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Roaming partner Vodafone's inbound TAP file for mediation_batch 40417 shows subscriber_key 3124481192 rated under rate_plan_code UNL_BASIC in rated_events at rated_amount_usd 12.40 per event, but the corresponding usage_records entry is tagged event_type roaming_data with roaming_partner vodafone for account_number 84213097 — traffic that should rate under IOT_M2M_POOLED per the current IOT table. Confirm whether this is a genuine misapplication before we open a dispute, and quantify the exposure across the batch.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [roaming-settlement-reconciliation-engine-iot-misrate-crosscheck](/tests/roaming-settlement-reconciliation-engine-iot-misrate-crosscheck.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)

## Entities that must be referenced

- rated_events
- usage_records
- billing_accounts

## Forbidden behaviors

- filing the dispute or executing action_amdocs_ces_billing_file before confirming which IOT rate table version was in effect for the batch date
- treating a single misrated event as proof of a partner-wide discrepancy pattern

# Citations

- [roaming-settlement-reconciliation-engine-assurance-runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [roaming-iot-rate-settlement-manual](/documents/roaming-iot-rate-settlement-manual.md)
