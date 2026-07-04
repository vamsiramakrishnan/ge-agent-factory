---
type: Workflow Stage
title: Cure Evidence Correlation
description: "Correlate open exceptions against DocuSign envelopes, recipients, and audit_trails to determine whether a cure item is still outstanding, in signature routing, or already executed but not yet reflected in nCino."
source_id: cure_evidence_correlation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cure Evidence Correlation

Correlate open exceptions against DocuSign envelopes, recipients, and audit_trails to determine whether a cure item is still outstanding, in signature routing, or already executed but not yet reflected in nCino.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Aging Waterfall & Baseline Comparison](/workflow/aging-waterfall-baseline-comparison.md)
