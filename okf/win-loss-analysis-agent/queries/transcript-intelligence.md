---
type: Query Capability
title: Gemini analyzes Gong call transcripts to identify the real reasons for wins a...
description: Gemini analyzes Gong call transcripts to identify the real reasons for wins and losses — not CRM dropdown selections. Correlates verbal buyer feedback with quantitative patterns to surface product gaps vs. pricing vs. competitive positioning issues.
source_id: "transcript-intelligence"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes Gong call transcripts to identify the real reasons for wins and losses — not CRM dropdown selections. Correlates verbal buyer feedback with quantitative patterns to surface product gaps vs. pricing vs. competitive positioning issues.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [lookup_win_loss_analysis_agent_playbook](/tools/lookup-win-loss-analysis-agent-playbook.md)
- [action_salesforce_crm_route](/tools/action-salesforce-crm-route.md)

## Runs in

- [transcript_intelligence](/workflow/transcript-intelligence.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/win-loss-analysis-agent-end-to-end.md)

# Citations

- [Win/Loss Analysis Agent Playbook](/documents/win-loss-analysis-agent-playbook.md)
