---
type: Query Capability
title: "Gemini generates actionable remediation guidance for each finding, considerin..."
description: "Gemini generates actionable remediation guidance for each finding, considering the technology stack and recommending interim mitigations for findings that cannot be patched immediately."
source_id: "remediation-guidance-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates actionable remediation guidance for each finding, considering the technology stack and recommending interim mitigations for findings that cannot be patched immediately.

## Tools used

- [lookup_penetration_test_findings_tracker_runbook](/tools/lookup-penetration-test-findings-tracker-runbook.md)
- [action_jira_recommend](/tools/action-jira-recommend.md)

## Runs in

- [remediation_guidance_generation](/workflow/remediation-guidance-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/penetration-test-findings-tracker-end-to-end.md)

# Citations

- [Penetration Test Findings Tracker Operations Runbook](/documents/penetration-test-findings-tracker-runbook.md)
