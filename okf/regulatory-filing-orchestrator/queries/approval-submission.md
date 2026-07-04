---
type: Query Capability
title: Route complete filing package through Controller and CFO approval workflow. S...
description: Route complete filing package through Controller and CFO approval workflow. Submit to SEC EDGAR upon authorization.
source_id: "approval-submission"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Route complete filing package through Controller and CFO approval workflow. Submit to SEC EDGAR upon authorization.

## Tools used

- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [lookup_regulatory_filing_orchestrator_controls_playbook](/tools/lookup-regulatory-filing-orchestrator-controls-playbook.md)

## Runs in

- [approval_submission](/workflow/approval-submission.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-filing-orchestrator-end-to-end.md)

# Citations

- [Regulatory Filing Orchestrator Controls Playbook](/documents/regulatory-filing-orchestrator-controls-playbook.md)
