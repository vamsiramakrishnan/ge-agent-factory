---
type: Eval Scenario
title: Run the Compliance Posture Scanner workflow for the current period. Cite the ...
description: "Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "compliance-posture-scanner-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [compliance-narrative-generation](/queries/compliance-narrative-generation.md)

## Mechanisms to call

- [query_qualys_scan_findings](/tools/query-qualys-scan-findings.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_aws_security_hub_billing_records](/tools/query-aws-security-hub-billing-records.md)
- [query_gcp_security_command_center_gcp_security_command_center_records](/tools/query-gcp-security-command-center-gcp-security-command-center-records.md)
- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)
- [action_qualys_generate](/tools/action-qualys-generate.md)

## Success rubric

Action generate executed against Qualys, with audit-trail entry and CISO / Security Analyst notified of outcomes.

# Citations

- [Compliance Posture Scanner Operations Runbook](/documents/compliance-posture-scanner-runbook.md)
