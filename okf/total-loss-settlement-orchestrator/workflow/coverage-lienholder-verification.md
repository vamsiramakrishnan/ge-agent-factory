---
type: Workflow Stage
title: "Coverage & Lienholder Verification"
description: "Cross-check claim_exposures coverage and reserve_lines authority_level_used against the settlement amount, then query DocuSign envelopes and recipients for outstanding lienholder payoff confirmations before any offer is drafted."
source_id: coverage_lienholder_verification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage & Lienholder Verification

Cross-check claim_exposures coverage and reserve_lines authority_level_used against the settlement amount, then query DocuSign envelopes and recipients for outstanding lienholder payoff confirmations before any offer is drafted.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)

Next: [Valuation & Settlement Package Assembly](/workflow/valuation-settlement-package-assembly.md)
