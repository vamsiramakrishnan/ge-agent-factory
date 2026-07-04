---
type: Workflow Stage
title: "Requisition-to-Contract Matching"
description: "Map approved requisition to the correct contract considering best price, nearest warehouse, and available capacity. For multiple eligible contracts, ML scoring selects the optimal match."
source_id: requisition_to_contract_matching
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Requisition-to-Contract Matching

Map approved requisition to the correct contract considering best price, nearest warehouse, and available capacity. For multiple eligible contracts, ML scoring selects the optimal match.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [action_sap_s_4hana_mm_me21n_match](/tools/action-sap-s-4hana-mm-me21n-match.md)

Next: [PO Generation & Transmission](/workflow/po-generation-transmission.md)
