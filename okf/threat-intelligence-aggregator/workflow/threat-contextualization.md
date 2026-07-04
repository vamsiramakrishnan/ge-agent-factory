---
type: Workflow Stage
title: Threat Contextualization
description: "Gemini generates actionable threat briefs explaining why a threat matters to this specific organization, mapping to MITRE ATT&CK techniques and recommending countermeasures."
source_id: threat_contextualization
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Threat Contextualization

Gemini generates actionable threat briefs explaining why a threat matters to this specific organization, mapping to MITRE ATT&CK techniques and recommending countermeasures.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_mitre_att_ck_mitre_att_ck_records](/tools/query-mitre-att-ck-mitre-att-ck-records.md)
- [lookup_threat_intelligence_aggregator_runbook](/tools/lookup-threat-intelligence-aggregator-runbook.md)
- [action_crowdstrike_falcon_generate](/tools/action-crowdstrike-falcon-generate.md)

Next: [Distribution & Tracking](/workflow/distribution-tracking.md)
