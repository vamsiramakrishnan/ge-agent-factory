---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the escalated investigation_cases and fraud_alerts records from NICE Actimize for the assigned case_number, confirming typology, sar_decision, and filing_deadline_date before any drafting begins.](/queries/escalated-case-intake-typology-triage.md)
- [Cross-reference transaction_risk_scores and aggregate_suspicious_amount against BigQuery analytics_events and historical_metrics baselines to corroborate the suspicious-activity pattern before it is written into the narrative.](/queries/transaction-baseline-corroboration.md)
- [Draft the SAR narrative in FinCEN's five-W's structure from investigation_cases and fraud_alerts fields, pre-populate FinCEN form fields, and validate every field against the FinCEN error rules cited in the SAR Filing Preparation Agent Banking Compliance Policy and the FinCEN SAR E-Filing Field Validation Runbook.](/queries/sar-narrative-drafting-fin-cen-field-validation.md)
- [Track the 30-day filing_deadline_date clock and 90-day continuing_activity_supplemental reviews against ServiceNow tickets logging case handling delays, escalating any case at risk of missing deadline to the AML Compliance Officer.](/queries/filing-clock-continuing-activity-tracking.md)
- [Execute action_nice_actimize_file in NICE Actimize once evidence and policy gates pass, emit the generated_audit_trail, and notify the AML Compliance Officer of the filing outcome.](/queries/filing-audit-trail.md)
