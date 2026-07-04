---
type: Query Capability
title: Scan Apigee gateway and GitHub repos for new or modified OpenAPI specificatio...
description: "Scan Apigee gateway and GitHub repos for new or modified OpenAPI specifications. Cross-reference with the architecture model in Ardoq."
source_id: "api-discovery"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan Apigee gateway and GitHub repos for new or modified OpenAPI specifications. Cross-reference with the architecture model in Ardoq.

## Tools used

- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_ardoq_ardoq_records](/tools/query-ardoq-ardoq-records.md)
- [action_apigee_deploy](/tools/action-apigee-deploy.md)

## Runs in

- [api_discovery](/workflow/api-discovery.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/api-catalog-governance-end-to-end.md)

# Citations

- [API Catalog & Governance Operations Runbook](/documents/api-catalog-governance-runbook.md)
