---
type: Workflow Stage
title: "Escalated Case Intake & Typology Triage"
description: "Pull the escalated investigation_cases and fraud_alerts records from NICE Actimize for the assigned case_number, confirming typology, sar_decision, and filing_deadline_date before any drafting begins."
source_id: escalated_case_intake_typology_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalated Case Intake & Typology Triage

Pull the escalated investigation_cases and fraud_alerts records from NICE Actimize for the assigned case_number, confirming typology, sar_decision, and filing_deadline_date before any drafting begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

Next: [Transaction & Baseline Corroboration](/workflow/transaction-baseline-corroboration.md)
