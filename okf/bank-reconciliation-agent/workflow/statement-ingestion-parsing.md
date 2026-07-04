---
type: Workflow Stage
title: "Statement Ingestion & Parsing"
description: "Ingest bank statements in MT940 and BAI2 formats across all banking relationships. Parse transaction details including amount, date, reference, and bank description fields."
source_id: statement_ingestion_parsing
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Statement Ingestion & Parsing

Ingest bank statements in MT940 and BAI2 formats across all banking relationships. Parse transaction details including amount, date, reference, and bank description fields.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)

Next: [Automated Matching](/workflow/automated-matching.md)
