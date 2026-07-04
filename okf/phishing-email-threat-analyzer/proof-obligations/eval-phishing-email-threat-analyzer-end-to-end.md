---
type: Proof Obligation
title: "Golden eval obligation — Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-phishing-email-threat-analyzer-end-to-end"
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

# Golden eval obligation — Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [phishing-email-threat-analyzer-end-to-end](/tests/phishing-email-threat-analyzer-end-to-end.md)


## Mechanisms

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [query_chronicle_chronicle_records](/tools/query-chronicle-chronicle-records.md)
- [lookup_phishing_email_threat_analyzer_runbook](/tools/lookup-phishing-email-threat-analyzer-runbook.md)
- [action_google_workspace_match](/tools/action-google-workspace-match.md)

## Entities that must be referenced

- accounts
- scan_findings
- chronicle_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [phishing-email-threat-analyzer-runbook](/documents/phishing-email-threat-analyzer-runbook.md)
