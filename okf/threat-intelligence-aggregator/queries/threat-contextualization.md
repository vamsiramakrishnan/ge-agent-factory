---
type: Query Capability
title: Gemini generates actionable threat briefs explaining why a threat matters to ...
description: "Gemini generates actionable threat briefs explaining why a threat matters to this specific organization, mapping to MITRE ATT&CK techniques and recommending countermeasures."
source_id: "threat-contextualization"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates actionable threat briefs explaining why a threat matters to this specific organization, mapping to MITRE ATT&CK techniques and recommending countermeasures.

## Tools used

- [query_mitre_att_ck_mitre_att_ck_records](/tools/query-mitre-att-ck-mitre-att-ck-records.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)

## Runs in

- [threat_contextualization](/workflow/threat-contextualization.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Threat Intelligence Aggregator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/threat-intelligence-aggregator-end-to-end.md)

# Citations

- [Threat Intelligence Aggregator Operations Runbook](/documents/threat-intelligence-aggregator-runbook.md)
