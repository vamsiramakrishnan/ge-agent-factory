---
type: Agent Tool
title: query_friss_fraud_detection_network_link_indicators
description: Retrieve network link indicators from FRISS Fraud Detection for the SIU Referral Scoring Engine workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_friss_fraud_detection_network_link_indicators

Retrieve network link indicators from FRISS Fraud Detection for the SIU Referral Scoring Engine workflow.

- **Kind:** query
- **Source system:** [FRISS Fraud Detection](/systems/friss-fraud-detection.md)

## Inputs

- link_id
- claim_number
- date_range

## Outputs

- network_link_indicators_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [FRISS Fraud Detection](/systems/friss-fraud-detection.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- link_id
- claim_number
- date_range

## Produces

- network_link_indicators_records

# Examples

```
query_friss_fraud_detection_network_link_indicators(link_id=<link_id>, claim_number=<claim_number>, date_range=<date_range>)
```

# Citations

- [FRISS Fraud Detection](/systems/friss-fraud-detection.md)
