---
type: Eval Scenario
title: Run the Executive Thought Leadership Agent workflow for the current period. C...
description: "Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "executive-thought-leadership-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [topic-discovery](/queries/topic-discovery.md)

## Mechanisms to call

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_executive_thought_leadership_agent_playbook](/tools/lookup-executive-thought-leadership-agent-playbook.md)
- [action_linkedin_publish](/tools/action-linkedin-publish.md)

## Success rubric

Action publish executed against LinkedIn, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [Executive Thought Leadership Agent Playbook](/documents/executive-thought-leadership-agent-playbook.md)
