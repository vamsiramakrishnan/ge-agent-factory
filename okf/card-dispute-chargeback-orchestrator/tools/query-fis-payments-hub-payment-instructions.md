---
type: Agent Tool
title: query_fis_payments_hub_payment_instructions
description: Retrieve payment instructions from FIS Payments Hub for the Card Dispute Chargeback Orchestrator workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fis_payments_hub_payment_instructions

Retrieve payment instructions from FIS Payments Hub for the Card Dispute Chargeback Orchestrator workflow.

- **Kind:** query
- **Source system:** [FIS Payments Hub](/systems/fis-payments-hub.md)

## Inputs

- instruction_id
- date_range

## Outputs

- payment_instructions_records
- payment_instructions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [FIS Payments Hub](/systems/fis-payments-hub.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [dispute_intake_reason_code_classification](/workflow/dispute-intake-reason-code-classification.md)
- [reg_e_reg_z_deadline_clock](/workflow/reg-e-reg-z-deadline-clock.md)
- [evidence_packet_assembly](/workflow/evidence-packet-assembly.md)
- [representment_filing_audit](/workflow/representment-filing-audit.md)

## Evals

- [Run the Card Dispute Chargeback Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/card-dispute-chargeback-orchestrator-end-to-end.md)
- [Cardholder dispute DSP-88213 disputes a $4,280.00 charge tied to payment instruction 700118422 (value_date 2026-06-02). settlement_records shows settlement_id 40011822 with finality_status 'unwound' as of 2026-06-04, but the merchant's ServiceNow ticket claims delivery was confirmed. File the representment now.](/tests/card-dispute-chargeback-orchestrator-stale-evidence-representment.md)
- [Dispute case DSP-91004 is tied to payment instruction 700233981 ($1,150.75, originator Meridian Outfitters LLC) in clearing batch 234017, cutoff_date 2026-07-02, settlement_window 'next_day'. BigQuery analytics_events shows the historical representment win-rate baseline dropped 12% this week. Determine whether the Reg E provisional-credit deadline and the network representment deadline are both still met, and prioritize this case in the queue.](/tests/card-dispute-chargeback-orchestrator-deadline-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- instruction_id
- date_range

## Produces

- payment_instructions_records
- payment_instructions_summary

# Examples

```
query_fis_payments_hub_payment_instructions(instruction_id=<instruction_id>, date_range=<date_range>)
```

# Citations

- [FIS Payments Hub](/systems/fis-payments-hub.md)
