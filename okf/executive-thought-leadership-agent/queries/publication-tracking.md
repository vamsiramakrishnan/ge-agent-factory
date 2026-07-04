---
type: Query Capability
title: "After Brand Manager approval, publish to LinkedIn (and optionally WordPress f..."
description: "After Brand Manager approval, publish to LinkedIn (and optionally WordPress for long-form). Track engagement, reshares, and pipeline attribution."
source_id: "publication-tracking"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# After Brand Manager approval, publish to LinkedIn (and optionally WordPress for long-form). Track engagement, reshares, and pipeline attribution.

## Tools used

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [action_linkedin_publish](/tools/action-linkedin-publish.md)

## Runs in

- [publication_tracking](/workflow/publication-tracking.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/executive-thought-leadership-agent-end-to-end.md)

# Citations

- [Executive Thought Leadership Agent Playbook](/documents/executive-thought-leadership-agent-playbook.md)
