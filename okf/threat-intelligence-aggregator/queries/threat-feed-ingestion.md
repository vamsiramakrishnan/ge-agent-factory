---
type: Query Capability
title: "Ingest threat intelligence feeds from CrowdStrike, Chronicle, and MITRE ATT&C..."
description: "Ingest threat intelligence feeds from CrowdStrike, Chronicle, and MITRE ATT&CK. Normalize IOCs (IPs, domains, hashes, CVEs) into a unified schema."
source_id: "threat-feed-ingestion"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest threat intelligence feeds from CrowdStrike, Chronicle, and MITRE ATT&CK. Normalize IOCs (IPs, domains, hashes, CVEs) into a unified schema.

## Tools used

- [query_crowdstrike_falcon_scan_findings](/tools/query-crowdstrike-falcon-scan-findings.md)
- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_mitre_att_ck_mitre_att_ck_records](/tools/query-mitre-att-ck-mitre-att-ck-records.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)

## Runs in

- [threat_feed_ingestion](/workflow/threat-feed-ingestion.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/threat-intelligence-aggregator-end-to-end.md)

# Citations

- [Threat Intelligence Aggregator Operations Runbook](/documents/threat-intelligence-aggregator-runbook.md)
