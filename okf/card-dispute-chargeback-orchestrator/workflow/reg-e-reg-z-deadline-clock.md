---
type: Workflow Stage
title: Reg E/Reg Z Deadline Clock
description: "Compute the provisional-credit deadline and the separate network representment deadline from clearing_batches cutoff_date and settlement_window alongside payment_instructions value_date, and log both clocks before any evidence work begins."
source_id: reg_e_reg_z_deadline_clock
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reg E/Reg Z Deadline Clock

Compute the provisional-credit deadline and the separate network representment deadline from clearing_batches cutoff_date and settlement_window alongside payment_instructions value_date, and log both clocks before any evidence work begins.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)

Next: [Evidence Packet Assembly](/workflow/evidence-packet-assembly.md)
