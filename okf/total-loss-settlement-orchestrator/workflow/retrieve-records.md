---
type: Workflow Stage
title: Retrieve Records
description: Query claims and claim exposures from Guidewire ClaimCenter and correlate with DocuSign for the Total Loss Settlement Orchestrator workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query claims and claim exposures from Guidewire ClaimCenter and correlate with DocuSign for the Total Loss Settlement Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
