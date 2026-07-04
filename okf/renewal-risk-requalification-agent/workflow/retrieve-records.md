---
type: Workflow Stage
title: Retrieve Records
description: Query policies and policy quotes from Guidewire PolicyCenter and correlate with LexisNexis Risk Solutions for the Renewal Risk Requalification Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policies and policy quotes from Guidewire PolicyCenter and correlate with LexisNexis Risk Solutions for the Renewal Risk Requalification Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
