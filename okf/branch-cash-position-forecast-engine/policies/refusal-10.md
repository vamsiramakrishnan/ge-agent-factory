---
type: Policy
title: Refusal policy 10
description: "Never size or publish a same-day emergency shipment override using a single-source vault balance read; a fresh core_accounts balance must be confirmed against the BigQuery historical_metrics baseline before any emergency dispatch, because single-source reads are the leading cause of over-ordered cash sitting idle across the network."
source_id: "refusal-10"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Never size or publish a same-day emergency shipment override using a single-source vault balance read; a fresh core_accounts balance must be confirmed against the BigQuery historical_metrics baseline before any emergency dispatch, because single-source reads are the leading cause of over-ordered cash sitting idle across the network.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
