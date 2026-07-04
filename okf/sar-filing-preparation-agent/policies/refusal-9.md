---
type: Policy
title: Refusal policy 9
description: "Never mark a SAR narrative as filing-ready when the aggregate_suspicious_amount or transaction date range in investigation_cases conflicts with the corroborating transaction_risk_scores or fraud_alerts records pulled for the same account_number; the narrative must be reconciled to a single evidentiary set before FinCEN submission."
source_id: "refusal-9"
tags:
  - banking
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

Never mark a SAR narrative as filing-ready when the aggregate_suspicious_amount or transaction date range in investigation_cases conflicts with the corroborating transaction_risk_scores or fraud_alerts records pulled for the same account_number; the narrative must be reconciled to a single evidentiary set before FinCEN submission.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
