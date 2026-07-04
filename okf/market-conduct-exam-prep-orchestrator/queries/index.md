---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query policies, policy_quotes, and underwriting_submissions from Guidewire PolicyCenter to scope the examiner's requested population and pull the underlying records into the exam-ready data mart.](/queries/data-call-scoping-record-pull.md)
- [Compare the pulled policies and underwriting_submissions against historical_metrics and analytics_events in BigQuery to test timeliness, disclosure, and handling standards mapped to NAIC market conduct examiner standards.](/queries/naic-baseline-self-audit.md)
- [Score exceptions surfaced from analytics_events and cached_aggregates, then use Looker dashboards and metric_definitions to prioritize the Regulatory Affairs Manager's remediation queue before an exam is announced.](/queries/exception-scoring-queue-prioritization.md)
- [Cross-check every finding against the Market Conduct Exam Prep Orchestrator Authority & Referral Guide and the NAIC Market Conduct Data Call Response Playbook, citing governing sections via lookup_market_conduct_exam_prep_orchestrator_authority_guide before any recommendation is drafted.](/queries/authority-evidence-citation-gate.md)
- [Assemble the examiner data-call package and prior-finding remediation response, then execute action_guidewire_policycenter_escalate for any unresolved exception with a full audit trail routed to the Regulatory Affairs Manager.](/queries/examiner-package-assembly-escalation.md)
