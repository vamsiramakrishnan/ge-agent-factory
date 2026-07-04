---
type: Query Capability
title: "Collect endpoint compliance data from CrowdStrike (vulnerability scan, EDR st..."
description: "Collect endpoint compliance data from CrowdStrike (vulnerability scan, EDR status), ManageEngine (patch level, encryption, antivirus), and Okta (device trust posture). Merge into unified compliance view."
source_id: "multi-source-posture-scan"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect endpoint compliance data from CrowdStrike (vulnerability scan, EDR status), ManageEngine (patch level, encryption, antivirus), and Okta (device trust posture). Merge into unified compliance view.

## Tools used

- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_endpoint_security_posture_agent_runbook](/tools/lookup-endpoint-security-posture-agent-runbook.md)
- [action_crowdstrike_post](/tools/action-crowdstrike-post.md)

## Runs in

- [multi_source_posture_scan](/workflow/multi-source-posture-scan.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Endpoint Security Posture Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/endpoint-security-posture-agent-end-to-end.md)

# Citations

- [Endpoint Security Posture Agent Operations Runbook](/documents/endpoint-security-posture-agent-runbook.md)
