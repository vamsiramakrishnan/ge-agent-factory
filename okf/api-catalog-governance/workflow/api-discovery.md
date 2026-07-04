---
type: Workflow Stage
title: API Discovery
description: "Scan Apigee gateway and GitHub repos for new or modified OpenAPI specifications. Cross-reference with the architecture model in Ardoq."
source_id: api_discovery
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# API Discovery

Scan Apigee gateway and GitHub repos for new or modified OpenAPI specifications. Cross-reference with the architecture model in Ardoq.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_ardoq_ardoq_records](/tools/query-ardoq-ardoq-records.md)
- [action_apigee_deploy](/tools/action-apigee-deploy.md)

Next: [Catalog Update](/workflow/catalog-update.md)
