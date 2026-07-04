---
type: Eval Scenario
title: Run the Threat Intelligence Aggregator workflow for the current period. Cite ...
description: "Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "threat-intelligence-aggregator-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [threat-feed-ingestion](/queries/threat-feed-ingestion.md)

## Mechanisms to call

- [query_crowdstrike_falcon_scan_findings](/tools/query-crowdstrike-falcon-scan-findings.md)
- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_mitre_att_ck_mitre_att_ck_records](/tools/query-mitre-att-ck-mitre-att-ck-records.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)

## Success rubric

Action generate executed against CrowdStrike Falcon, with audit-trail entry and CISO / Security Analyst notified of outcomes.

# Citations

- [Threat Intelligence Aggregator Operations Runbook](/documents/threat-intelligence-aggregator-runbook.md)
