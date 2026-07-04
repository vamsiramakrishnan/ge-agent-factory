---
type: Workflow Stage
title: "DocuSign Envelope & Recipient Reconciliation"
description: "Query envelopes, recipients, and audit_trails in DocuSign to determine whether the missing agreement was ever routed, is still pending signature, or has expired or terminated without execution."
source_id: docu_sign_envelope_recipient_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# DocuSign Envelope & Recipient Reconciliation

Query envelopes, recipients, and audit_trails in DocuSign to determine whether the missing agreement was ever routed, is still pending signature, or has expired or terminated without execution.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)

Next: [Exception Aging & Severity Scoring](/workflow/exception-aging-severity-scoring.md)
