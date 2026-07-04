---
type: Source System
title: Confluence
description: "Existing ADRs, architecture wiki, design guidelines"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Confluence

Existing ADRs, architecture wiki, design guidelines

- **Protocol:** REST API
- **Local backing:** cloud-storage

# Schema

- [pages](/tables/pages.md)
- [comments](/tables/comments.md)
- [space_permissions](/tables/space-permissions.md)

## Tools using this system

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_adr_drafter_runbook](/tools/lookup-adr-drafter-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)
