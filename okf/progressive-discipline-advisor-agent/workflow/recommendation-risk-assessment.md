---
type: Workflow Stage
title: "Recommendation & Risk Assessment"
description: "Generate consistent discipline recommendation with policy citations and relevant case law. Score legal risk and flag high-risk cases for automatic ER escalation."
source_id: recommendation_risk_assessment
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Recommendation & Risk Assessment

Generate consistent discipline recommendation with policy citations and relevant case law. Score legal risk and flag high-risk cases for automatic ER escalation.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_progressive_discipline_advisor_agent_policy_handbook](/tools/lookup-progressive-discipline-advisor-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

Next: [Documentation & Escalation](/workflow/documentation-escalation.md)
