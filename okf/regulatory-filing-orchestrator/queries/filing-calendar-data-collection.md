---
type: Query Capability
title: "Track filing calendar with deadlines for 10-K, 10-Q, proxy, and other SEC fil..."
description: "Track filing calendar with deadlines for 10-K, 10-Q, proxy, and other SEC filings. Collect required data inputs from financial statements, tax, legal, and management teams."
source_id: "filing-calendar-data-collection"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track filing calendar with deadlines for 10-K, 10-Q, proxy, and other SEC filings. Collect required data inputs from financial statements, tax, legal, and management teams.

## Tools used

- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [lookup_regulatory_filing_orchestrator_controls_playbook](/tools/lookup-regulatory-filing-orchestrator-controls-playbook.md)

## Runs in

- [filing_calendar_data_collection](/workflow/filing-calendar-data-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-filing-orchestrator-end-to-end.md)

# Citations

- [Regulatory Filing Orchestrator Controls Playbook](/documents/regulatory-filing-orchestrator-controls-playbook.md)
