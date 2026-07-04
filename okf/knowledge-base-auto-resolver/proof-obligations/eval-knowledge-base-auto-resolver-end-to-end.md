---
type: Proof Obligation
title: "Golden eval obligation — Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-knowledge-base-auto-resolver-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [knowledge-base-auto-resolver-end-to-end](/tests/knowledge-base-auto-resolver-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_knowledge_base_auto_resolver_runbook](/tools/lookup-knowledge-base-auto-resolver-runbook.md)
- [action_servicenow_update](/tools/action-servicenow-update.md)

## Entities that must be referenced

- tickets
- pages
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute update without two-system evidence

# Citations

- [knowledge-base-auto-resolver-runbook](/documents/knowledge-base-auto-resolver-runbook.md)
