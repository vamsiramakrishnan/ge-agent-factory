---
type: Workflow Stage
title: Threat Feed Ingestion
description: "Ingest threat intelligence feeds from CrowdStrike, Chronicle, and MITRE ATT&CK. Normalize IOCs (IPs, domains, hashes, CVEs) into a unified schema."
source_id: threat_feed_ingestion
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Threat Feed Ingestion

Ingest threat intelligence feeds from CrowdStrike, Chronicle, and MITRE ATT&CK. Normalize IOCs (IPs, domains, hashes, CVEs) into a unified schema.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_crowdstrike_falcon_scan_findings](/tools/query-crowdstrike-falcon-scan-findings.md)
- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_mitre_att_ck_mitre_att_ck_records](/tools/query-mitre-att-ck-mitre-att-ck-records.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)

Next: [Threat Contextualization](/workflow/threat-contextualization.md)
