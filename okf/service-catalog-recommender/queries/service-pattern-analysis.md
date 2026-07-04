---
type: Query Capability
title: Analyze service request patterns for users with similar roles and departments...
description: Analyze service request patterns for users with similar roles and departments. Identify commonly requested services and typical onboarding bundles.
source_id: "service-pattern-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze service request patterns for users with similar roles and departments. Identify commonly requested services and typical onboarding bundles.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)

## Runs in

- [service_pattern_analysis](/workflow/service-pattern-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/service-catalog-recommender-end-to-end.md)

# Citations

- [Service Catalog Recommender Operations Runbook](/documents/service-catalog-recommender-runbook.md)
