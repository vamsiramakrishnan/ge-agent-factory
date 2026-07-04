---
type: Workflow Stage
title: "Authority, Referral & Sanctions Gating"
description: "Screen named insureds and beneficial owners, check filing_status/edition_date against the risk's filing_state, and cite the Broker Submission Intake Orchestrator Authority & Referral Guide (lookup_broker_submission_intake_orchestrator_authority_guide) before any recommendation or publish is authorized."
source_id: authority_referral_sanctions_gating
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Authority, Referral & Sanctions Gating

Screen named insureds and beneficial owners, check filing_status/edition_date against the risk's filing_state, and cite the Broker Submission Intake Orchestrator Authority & Referral Guide (lookup_broker_submission_intake_orchestrator_authority_guide) before any recommendation or publish is authorized.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)

Next: [Publish & Intake Analytics](/workflow/publish-intake-analytics.md)
