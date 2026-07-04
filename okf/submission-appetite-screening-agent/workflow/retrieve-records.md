---
type: Workflow Stage
title: Retrieve Records
description: Query policies and policy quotes from Guidewire PolicyCenter and correlate with LexisNexis Risk Solutions for the Submission Appetite Screening Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policies and policy quotes from Guidewire PolicyCenter and correlate with LexisNexis Risk Solutions for the Submission Appetite Screening Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)
- [action_guidewire_policycenter_file](/tools/action-guidewire-policycenter-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
