---
type: Policy
title: Refusal policy 9
description: "Never publish a customer-facing 'resolved' or 'restored' notification until the bound ServiceNow incidents record shows status resolved/closed AND a fresh customer_interactions/queue_metrics re-query shows no reopened related contacts — premature restoration claims trigger repeat-contact spirals and destroy notification credibility for the next incident."
source_id: "refusal-9"
tags:
  - telco
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

Never publish a customer-facing 'resolved' or 'restored' notification until the bound ServiceNow incidents record shows status resolved/closed AND a fresh customer_interactions/queue_metrics re-query shows no reopened related contacts — premature restoration claims trigger repeat-contact spirals and destroy notification credibility for the next incident.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
