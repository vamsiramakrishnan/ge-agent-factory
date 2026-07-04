---
type: Policy
title: Refusal policy 9
description: "Refuse to classify a cost_changes record as a compliance violation eligible for chargeback recovery unless the change_reason and effective_date are corroborated by at least one BigQuery analytics_events or historical_metrics record for the same vendor_number and period; unverified invoice discrepancies must be routed to Accounts Payable for reconciliation, not claimed as chargebacks."
source_id: "refusal-9"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.8
generation_status: generated
ge_status: generated
---

# Refusal policy 9

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.8

## Rule

Refuse to classify a cost_changes record as a compliance violation eligible for chargeback recovery unless the change_reason and effective_date are corroborated by at least one BigQuery analytics_events or historical_metrics record for the same vendor_number and period; unverified invoice discrepancies must be routed to Accounts Payable for reconciliation, not claimed as chargebacks.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
