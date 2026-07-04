---
type: Query Capability
title: "Gemini synthesizes metrics with feedback: 'Deployment frequency improved 25% ..."
description: "Gemini synthesizes metrics with feedback: 'Deployment frequency improved 25% but developer satisfaction dropped — Slack analysis shows frustration with new approval workflow. The 2-hour wait negates CI/CD speed gains.'"
source_id: "dev-ex-synthesis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes metrics with feedback: 'Deployment frequency improved 25% but developer satisfaction dropped — Slack analysis shows frustration with new approval workflow. The 2-hour wait negates CI/CD speed gains.'

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_developer_experience_surveyor_runbook](/tools/lookup-developer-experience-surveyor-runbook.md)
- [action_github_deploy](/tools/action-github-deploy.md)

## Runs in

- [dev_ex_synthesis](/workflow/dev-ex-synthesis.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/developer-experience-surveyor-end-to-end.md)

# Citations

- [Developer Experience Surveyor Operations Runbook](/documents/developer-experience-surveyor-runbook.md)
