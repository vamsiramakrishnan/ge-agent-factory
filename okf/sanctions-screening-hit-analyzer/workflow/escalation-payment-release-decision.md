---
type: Workflow Stage
title: "Escalation & Payment Release Decision"
description: "For true_match or fincen_314a_match hits, execute action_fenergo_clm_escalate to route the case to the sanctions compliance officer and keep the interdiction hold; for cleared false positives, release the payment with a standardized, auditable rationale."
source_id: escalation_payment_release_decision
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Payment Release Decision

For true_match or fincen_314a_match hits, execute action_fenergo_clm_escalate to route the case to the sanctions compliance officer and keep the interdiction hold; for cleared false positives, release the payment with a standardized, auditable rationale.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)

Next: [Audit Trail & KPI Reporting](/workflow/audit-trail-kpi-reporting.md)
