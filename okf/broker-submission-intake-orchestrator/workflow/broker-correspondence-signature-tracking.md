---
type: Workflow Stage
title: "Broker Correspondence & Signature Tracking"
description: "Generate a single consolidated information request and open a DocuSign envelope (query_docusign_envelopes) with the correct recipients for any unsigned statutory_notice or application form, then track envelopes and audit_trails to closure instead of chasing brokers by email."
source_id: broker_correspondence_signature_tracking
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Broker Correspondence & Signature Tracking

Generate a single consolidated information request and open a DocuSign envelope (query_docusign_envelopes) with the correct recipients for any unsigned statutory_notice or application form, then track envelopes and audit_trails to closure instead of chasing brokers by email.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)

Next: [Authority, Referral & Sanctions Gating](/workflow/authority-referral-sanctions-gating.md)
