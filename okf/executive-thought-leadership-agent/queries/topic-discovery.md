---
type: Query Capability
title: "Scan industry news, LinkedIn trending topics, and competitor executive commen..."
description: "Scan industry news, LinkedIn trending topics, and competitor executive commentary to identify thought leadership opportunities aligned with executive expertise areas."
source_id: "topic-discovery"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan industry news, LinkedIn trending topics, and competitor executive commentary to identify thought leadership opportunities aligned with executive expertise areas.

## Tools used

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [lookup_executive_thought_leadership_agent_playbook](/tools/lookup-executive-thought-leadership-agent-playbook.md)
- [action_linkedin_publish](/tools/action-linkedin-publish.md)

## Runs in

- [topic_discovery](/workflow/topic-discovery.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/executive-thought-leadership-agent-end-to-end.md)

# Citations

- [Executive Thought Leadership Agent Playbook](/documents/executive-thought-leadership-agent-playbook.md)
