---
type: Claim
title: Vendor is active and approved for payment
description: "Evidence-backed claim: Vendor is active and approved for payment"
source_id: "vendor-is-active-and-approved-for-payment"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.1
generation_status: generated
ge_status: generated
---

# Vendor is active and approved for payment

## Authority

- [sap_s4hana](/systems/sap-s4hana.md)
- [coupa](/systems/coupa.md)

## Required Evidence

- invoices.vendor_id
- vendors.vendor_status
- ap-three-way-match-policy.vendor-eligibility

## Citation Requirements

Must cite: invoices.vendor_id, vendors.vendor_status, ap-three-way-match-policy.vendor-eligibility

## Proof obligations

- [Evidence obligation — Vendor is active and approved for payment](/proof-obligations/evidence-vendor-is-active-and-approved-for-payment.md)

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
- [Exception Resolution SOP](/documents/exception-resolution-sop.md)
