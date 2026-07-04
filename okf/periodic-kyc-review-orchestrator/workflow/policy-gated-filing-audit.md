---
type: Workflow Stage
title: "Policy-Gated Filing & Audit"
description: "Cite the Periodic KYC Review Orchestrator Banking Compliance Policy before executing action_fenergo_clm_file against the kyc_cases record, emitting a full audit trail for examiner evidence."
source_id: policy_gated_filing_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy-Gated Filing & Audit

Cite the Periodic KYC Review Orchestrator Banking Compliance Policy before executing action_fenergo_clm_file against the kyc_cases record, emitting a full audit trail for examiner evidence.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)
