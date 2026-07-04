---
type: Claim
title: "Pricing overcharge detected: invoiced price exceeds contracted price by threshold"
description: "Evidence-backed claim: Pricing overcharge detected: invoiced price exceeds contracted price by threshold"
source_id: "pricing-overcharge-detected-invoiced-price-exceeds-contracted-price-by-threshold"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.0
generation_status: generated
ge_status: generated
---

# Pricing overcharge detected: invoiced price exceeds contracted price by threshold

## Authority

- [icertis](/systems/icertis.md)
- [sap_s4hana](/systems/sap-s4hana.md)

## Required Evidence

- pricing_schedules.base_price
- invoice_actuals.amount
- overcharge-tolerance

## Citation Requirements

Must cite: pricing_schedules.base_price, invoice_actuals.amount, overcharge-tolerance

## Proof obligations

- [Evidence obligation — Pricing overcharge detected: invoiced price exceeds contracted price by threshold](/proof-obligations/evidence-pricing-overcharge-detected-invoiced-price-exceeds-contracted-price-by-threshold.md)

# Citations

- [Procurement Contract Compliance Policy](/documents/procurement-contract-compliance-policy.md)
- [Complex Pricing Formula Interpretation Guide](/documents/complex-pricing-formula-guide.md)
