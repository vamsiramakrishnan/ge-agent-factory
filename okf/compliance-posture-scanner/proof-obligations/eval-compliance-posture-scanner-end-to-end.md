---
type: Proof Obligation
title: "Golden eval obligation — Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-compliance-posture-scanner-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [compliance-posture-scanner-end-to-end](/tests/compliance-posture-scanner-end-to-end.md)


## Mechanisms

- [query_qualys_scan_findings](/tools/query-qualys-scan-findings.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_aws_security_hub_billing_records](/tools/query-aws-security-hub-billing-records.md)
- [query_gcp_security_command_center_gcp_security_command_center_records](/tools/query-gcp-security-command-center-gcp-security-command-center-records.md)
- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)
- [action_qualys_generate](/tools/action-qualys-generate.md)

## Entities that must be referenced

- scan_findings
- scan_findings
- billing_records
- gcp_security_command_center_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [compliance-posture-scanner-runbook](/documents/compliance-posture-scanner-runbook.md)
