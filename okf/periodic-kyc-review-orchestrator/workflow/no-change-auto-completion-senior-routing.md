---
type: Workflow Stage
title: "No-Change Auto-Completion & Senior Routing"
description: "Auto-complete low-risk kyc_cases with no material change and a documented QA-sampling rationale; route profile mismatches and proposed cdd_risk_rating upgrades to senior analysts through ServiceNow tickets."
source_id: no_change_auto_completion_senior_routing
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# No-Change Auto-Completion & Senior Routing

Auto-complete low-risk kyc_cases with no material change and a documented QA-sampling rationale; route profile mismatches and proposed cdd_risk_rating upgrades to senior analysts through ServiceNow tickets.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Policy-Gated Filing & Audit](/workflow/policy-gated-filing-audit.md)
