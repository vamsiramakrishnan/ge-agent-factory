---
type: Workflow Stage
title: "Recovery Publication & Audit Trail"
description: "Execute action_lexisnexis_risk_solutions_publish for approved findings, post recovered-premium tracking to Looker dashboards and explore_queries, and emit the generated_audit_trail evidence record for every action taken."
source_id: recovery_publication_audit_trail
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recovery Publication & Audit Trail

Execute action_lexisnexis_risk_solutions_publish for approved findings, post recovered-premium tracking to Looker dashboards and explore_queries, and emit the generated_audit_trail evidence record for every action taken.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)
- [action_lexisnexis_risk_solutions_publish](/tools/action-lexisnexis-risk-solutions-publish.md)
