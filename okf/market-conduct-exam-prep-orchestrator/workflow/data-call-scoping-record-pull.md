---
type: Workflow Stage
title: "Data Call Scoping & Record Pull"
description: "Query policies, policy_quotes, and underwriting_submissions from Guidewire PolicyCenter to scope the examiner's requested population and pull the underlying records into the exam-ready data mart."
source_id: data_call_scoping_record_pull
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Data Call Scoping & Record Pull

Query policies, policy_quotes, and underwriting_submissions from Guidewire PolicyCenter to scope the examiner's requested population and pull the underlying records into the exam-ready data mart.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)
- [action_guidewire_policycenter_escalate](/tools/action-guidewire-policycenter-escalate.md)

Next: [NAIC Baseline Self-Audit](/workflow/naic-baseline-self-audit.md)
