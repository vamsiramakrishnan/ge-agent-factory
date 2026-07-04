---
type: Query Capability
title: "Generate win/loss intelligence reports for Product Marketing, Sales Leadershi..."
description: "Generate win/loss intelligence reports for Product Marketing, Sales Leadership, and Product teams. Route competitive insights to battle card updates. Feed product gaps to roadmap planning."
source_id: "insight-distribution"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate win/loss intelligence reports for Product Marketing, Sales Leadership, and Product teams. Route competitive insights to battle card updates. Feed product gaps to roadmap planning.

## Tools used

- [lookup_win_loss_analysis_agent_playbook](/tools/lookup-win-loss-analysis-agent-playbook.md)
- [action_salesforce_crm_route](/tools/action-salesforce-crm-route.md)

## Runs in

- [insight_distribution](/workflow/insight-distribution.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/win-loss-analysis-agent-end-to-end.md)

# Citations

- [Win/Loss Analysis Agent Playbook](/documents/win-loss-analysis-agent-playbook.md)
