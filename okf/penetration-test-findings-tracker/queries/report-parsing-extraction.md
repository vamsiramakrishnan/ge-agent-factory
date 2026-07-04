---
type: Query Capability
title: "Parse penetration test reports from multiple formats (PDF, HTML, JSON). Extra..."
description: "Parse penetration test reports from multiple formats (PDF, HTML, JSON). Extract individual findings with severity, affected systems, proof-of-concept details, and remediation recommendations."
source_id: "report-parsing-extraction"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse penetration test reports from multiple formats (PDF, HTML, JSON). Extract individual findings with severity, affected systems, proof-of-concept details, and remediation recommendations.

## Tools used

- [lookup_penetration_test_findings_tracker_runbook](/tools/lookup-penetration-test-findings-tracker-runbook.md)
- [action_jira_recommend](/tools/action-jira-recommend.md)

## Runs in

- [report_parsing_extraction](/workflow/report-parsing-extraction.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/penetration-test-findings-tracker-end-to-end.md)

# Citations

- [Penetration Test Findings Tracker Operations Runbook](/documents/penetration-test-findings-tracker-runbook.md)
