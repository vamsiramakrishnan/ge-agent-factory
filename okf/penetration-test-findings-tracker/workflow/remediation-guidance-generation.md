---
type: Workflow Stage
title: Remediation Guidance Generation
description: "Gemini generates actionable remediation guidance for each finding, considering the technology stack and recommending interim mitigations for findings that cannot be patched immediately."
source_id: remediation_guidance_generation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Remediation Guidance Generation

Gemini generates actionable remediation guidance for each finding, considering the technology stack and recommending interim mitigations for findings that cannot be patched immediately.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_penetration_test_findings_tracker_runbook](/tools/lookup-penetration-test-findings-tracker-runbook.md)
- [action_jira_recommend](/tools/action-jira-recommend.md)

Next: [Ticket Creation & Tracking](/workflow/ticket-creation-tracking.md)
