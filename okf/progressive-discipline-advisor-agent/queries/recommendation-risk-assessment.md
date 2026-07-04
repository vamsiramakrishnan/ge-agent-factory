---
type: Query Capability
title: Generate consistent discipline recommendation with policy citations and relev...
description: "Generate consistent discipline recommendation with policy citations and relevant case law. Score legal risk and flag high-risk cases for automatic ER escalation."
source_id: "recommendation-risk-assessment"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate consistent discipline recommendation with policy citations and relevant case law. Score legal risk and flag high-risk cases for automatic ER escalation.

## Tools used

- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_progressive_discipline_advisor_agent_policy_handbook](/tools/lookup-progressive-discipline-advisor-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [recommendation_risk_assessment](/workflow/recommendation-risk-assessment.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Progressive Discipline Advisor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/progressive-discipline-advisor-agent-end-to-end.md)

# Citations

- [Progressive Discipline Advisor Agent Policy Handbook](/documents/progressive-discipline-advisor-agent-policy-handbook.md)
