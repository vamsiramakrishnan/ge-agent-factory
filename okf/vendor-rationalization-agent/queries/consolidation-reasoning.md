---
type: Query Capability
title: "Gemini analyzes tool overlap: 'We have 4 project management tools across diff..."
description: "Gemini analyzes tool overlap: 'We have 4 project management tools across different teams — 40% of users have accounts in 2+. Recommend standardizing on Jira with a 6-month migration plan, saving $180K/year.'"
source_id: "consolidation-reasoning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes tool overlap: 'We have 4 project management tools across different teams — 40% of users have accounts in 2+. Recommend standardizing on Jira with a 6-month migration plan, saving $180K/year.'

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [action_servicenow_sam_recommend](/tools/action-servicenow-sam-recommend.md)

## Runs in

- [consolidation_reasoning](/workflow/consolidation-reasoning.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Vendor Rationalization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-rationalization-agent-end-to-end.md)

# Citations

- [Vendor Rationalization Agent Operations Runbook](/documents/vendor-rationalization-agent-runbook.md)
