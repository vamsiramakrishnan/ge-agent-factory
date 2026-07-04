---
type: Eval Scenario
title: "Investigation case 2043981 has a filing_deadline_date of 2026-07-06 and sar_d..."
description: "Investigation case 2043981 has a filing_deadline_date of 2026-07-06 and sar_decision is still pending_review. The most recent NICE Actimize evidence pull for the linked fraud_alerts records is dated 2026-06-28. Today is 2026-07-04 -- can we file the SAR recommendation now, or does something need to happen first?"
source_id: "fraud-alert-triage-agent-stale-sar-deadline"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Investigation case 2043981 has a filing_deadline_date of 2026-07-06 and sar_decision is still pending_review. The most recent NICE Actimize evidence pull for the linked fraud_alerts records is dated 2026-06-28. Today is 2026-07-04 -- can we file the SAR recommendation now, or does something need to happen first?

## Validates

- [alert-intake-queue-prioritization](/queries/alert-intake-queue-prioritization.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fraud Alert Triage Agent Banking Compliance Policy](/documents/fraud-alert-triage-agent-compliance-policy.md)
- [BSA/AML Suspicious Activity Report Filing & Deadline Playbook](/documents/sar-filing-deadline-playbook.md)
