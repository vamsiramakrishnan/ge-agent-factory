---
type: Query Capability
title: "Enrich alert with user context from Okta (role, location, device trust), endp..."
description: "Enrich alert with user context from Okta (role, location, device trust), endpoint context from CrowdStrike (process activity, EDR score), and historical patterns from BigQuery."
source_id: "context-enrichment"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Enrich alert with user context from Okta (role, location, device trust), endpoint context from CrowdStrike (process activity, EDR score), and historical patterns from BigQuery.

## Tools used

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_siem_alert_triage_agent_runbook](/tools/lookup-siem-alert-triage-agent-runbook.md)

## Runs in

- [context_enrichment](/workflow/context-enrichment.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siem-alert-triage-agent-end-to-end.md)

# Citations

- [SIEM Alert Triage Agent Operations Runbook](/documents/siem-alert-triage-agent-runbook.md)
