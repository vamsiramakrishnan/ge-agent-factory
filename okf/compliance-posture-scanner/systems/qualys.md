---
type: Source System
title: Qualys
description: "CIS benchmark compliance scans, configuration audit"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Qualys

CIS benchmark compliance scans, configuration audit

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [scan_findings](/tables/scan-findings.md)
- [asset_inventory](/tables/asset-inventory.md)
- [remediation_tasks](/tables/remediation-tasks.md)

## Tools using this system

- [query_qualys_scan_findings](/tools/query-qualys-scan-findings.md)
- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)
- [action_qualys_generate](/tools/action-qualys-generate.md)
