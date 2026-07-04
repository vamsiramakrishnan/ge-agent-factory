---
type: Proof Obligation
title: "Golden eval obligation — Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-executive-thought-leadership-agent-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Executive Thought Leadership Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [executive-thought-leadership-agent-end-to-end](/tests/executive-thought-leadership-agent-end-to-end.md)


## Mechanisms

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_executive_thought_leadership_agent_playbook](/tools/lookup-executive-thought-leadership-agent-playbook.md)
- [action_linkedin_publish](/tools/action-linkedin-publish.md)

## Entities that must be referenced

- linkedin_records
- documents
- content_entries

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [executive-thought-leadership-agent-playbook](/documents/executive-thought-leadership-agent-playbook.md)
