---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Fenergo CLM with a full audit trail, and escalate exceptions to the Sanctions Screening Analyst."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Fenergo CLM with a full audit trail, and escalate exceptions to the Sanctions Screening Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)
