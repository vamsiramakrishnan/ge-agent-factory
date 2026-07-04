---
type: Query Capability
title: "DR compliance report published with coverage gap alerts. Non-compliant system..."
description: "DR compliance report published with coverage gap alerts. Non-compliant systems flagged with auto-generated remediation actions. Quarterly DR drill schedule maintained."
source_id: "report-remediation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# DR compliance report published with coverage gap alerts. Non-compliant systems flagged with auto-generated remediation actions. Quarterly DR drill schedule maintained.

## Tools used

- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)

## Runs in

- [report_remediation](/workflow/report-remediation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

# Citations

- [Backup & DR Compliance Agent Operations Runbook](/documents/backup-dr-compliance-agent-runbook.md)
