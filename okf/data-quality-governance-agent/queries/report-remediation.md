---
type: Query Capability
title: Generate data quality reports prioritizing business impact over record count....
description: "Generate data quality reports prioritizing business impact over record count. Auto-fix obvious issues (formatting, standardization). Route ambiguous merges to Marketing Ops Lead for review."
source_id: "report-remediation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate data quality reports prioritizing business impact over record count. Auto-fix obvious issues (formatting, standardization). Route ambiguous merges to Marketing Ops Lead for review.

## Tools used

- [lookup_data_quality_governance_agent_playbook](/tools/lookup-data-quality-governance-agent-playbook.md)

## Runs in

- [report_remediation](/workflow/report-remediation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Data Quality & Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-governance-agent-end-to-end.md)

# Citations

- [Data Quality & Governance Agent Playbook](/documents/data-quality-governance-agent-playbook.md)
