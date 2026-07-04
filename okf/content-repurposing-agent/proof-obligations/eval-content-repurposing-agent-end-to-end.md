---
type: Proof Obligation
title: "Golden eval obligation — Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-content-repurposing-agent-end-to-end"
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

# Golden eval obligation — Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [content-repurposing-agent-end-to-end](/tests/content-repurposing-agent-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_content_repurposing_agent_playbook](/tools/lookup-content-repurposing-agent-playbook.md)

## Entities that must be referenced

- documents
- content_entries
- assets
- contacts
- linkedin_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [content-repurposing-agent-playbook](/documents/content-repurposing-agent-playbook.md)
