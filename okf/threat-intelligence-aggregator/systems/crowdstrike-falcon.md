---
type: Source System
title: CrowdStrike Falcon
description: "Threat intel feeds, IOC signatures, adversary profiles"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# CrowdStrike Falcon

Threat intel feeds, IOC signatures, adversary profiles

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [scan_findings](/tables/scan-findings.md)
- [asset_inventory](/tables/asset-inventory.md)
- [remediation_tasks](/tables/remediation-tasks.md)

## Tools using this system

- [query_crowdstrike_falcon_scan_findings](/tools/query-crowdstrike-falcon-scan-findings.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)
