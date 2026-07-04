---
type: Workflow Stage
title: "Multi-Source Posture Scan"
description: "Collect endpoint compliance data from CrowdStrike (vulnerability scan, EDR status), ManageEngine (patch level, encryption, antivirus), and Okta (device trust posture). Merge into unified compliance view."
source_id: multi_source_posture_scan
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Source Posture Scan

Collect endpoint compliance data from CrowdStrike (vulnerability scan, EDR status), ManageEngine (patch level, encryption, antivirus), and Okta (device trust posture). Merge into unified compliance view.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_endpoint_security_posture_agent_runbook](/tools/lookup-endpoint-security-posture-agent-runbook.md)
- [action_crowdstrike_post](/tools/action-crowdstrike-post.md)

Next: [Enforcement & Tracking](/workflow/enforcement-tracking.md)
