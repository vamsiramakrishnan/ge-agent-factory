---
type: Proof Obligation
title: "Golden eval obligation — Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-threat-intelligence-aggregator-end-to-end"
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

# Golden eval obligation — Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [threat-intelligence-aggregator-end-to-end](/tests/threat-intelligence-aggregator-end-to-end.md)


## Mechanisms

- [query_crowdstrike_falcon_scan_findings](/tools/query-crowdstrike-falcon-scan-findings.md)
- [query_chronicle_siem_chronicle_siem_records](/tools/query-chronicle-siem-chronicle-siem-records.md)
- [query_mitre_att_ck_mitre_att_ck_records](/tools/query-mitre-att-ck-mitre-att-ck-records.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)

## Entities that must be referenced

- scan_findings
- chronicle_siem_records
- mitre_att_ck_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [threat-intelligence-aggregator-runbook](/documents/threat-intelligence-aggregator-runbook.md)
