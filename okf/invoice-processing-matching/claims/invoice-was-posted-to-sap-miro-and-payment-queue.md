---
type: Claim
title: Invoice was posted to SAP MIRO and payment queue
description: "Evidence-backed claim: Invoice was posted to SAP MIRO and payment queue"
source_id: "invoice-was-posted-to-sap-miro-and-payment-queue"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.2
generation_status: generated
ge_status: generated
---

# Invoice was posted to SAP MIRO and payment queue

## Authority

- [sap_s4hana](/systems/sap-s4hana.md)

## Required Evidence

- payment_records.miro_document_number
- payment_records.payment_queue_id
- payment_records.audit_trail

## Citation Requirements

Must cite: payment_records.miro_document_number, payment_records.payment_queue_id, payment_records.audit_trail

## Proof obligations

- [Evidence obligation — Invoice was posted to SAP MIRO and payment queue](/proof-obligations/evidence-invoice-was-posted-to-sap-miro-and-payment-queue.md)

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
- [Exception Resolution SOP](/documents/exception-resolution-sop.md)
