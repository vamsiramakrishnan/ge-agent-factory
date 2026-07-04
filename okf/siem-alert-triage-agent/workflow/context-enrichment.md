---
type: Workflow Stage
title: Context Enrichment
description: "Enrich alert with user context from Okta (role, location, device trust), endpoint context from CrowdStrike (process activity, EDR score), and historical patterns from BigQuery."
source_id: context_enrichment
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Enrichment

Enrich alert with user context from Okta (role, location, device trust), endpoint context from CrowdStrike (process activity, EDR score), and historical patterns from BigQuery.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

Next: [Intelligent Classification](/workflow/intelligent-classification.md)
