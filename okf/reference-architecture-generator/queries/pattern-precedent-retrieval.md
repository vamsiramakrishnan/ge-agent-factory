---
type: Query Capability
title: "Search Confluence for matching reference architectures, GitHub for infrastruc..."
description: "Search Confluence for matching reference architectures, GitHub for infrastructure templates, and LeanIX for approved technology stack. Pull cost and performance data from similar deployments."
source_id: "pattern-precedent-retrieval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Search Confluence for matching reference architectures, GitHub for infrastructure templates, and LeanIX for approved technology stack. Pull cost and performance data from similar deployments.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [lookup_reference_architecture_generator_runbook](/tools/lookup-reference-architecture-generator-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Runs in

- [pattern_precedent_retrieval](/workflow/pattern-precedent-retrieval.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reference-architecture-generator-end-to-end.md)

# Citations

- [Reference Architecture Generator Operations Runbook](/documents/reference-architecture-generator-runbook.md)
