---
type: Workflow Stage
title: "Playbook & MAP Guardrail Check"
description: "Cite the Competitive Price Response Agent Retail Execution Playbook and the MAP & Price-Comparison Compliance Policy via lookup_competitive_price_response_agent_execution_playbook before any recommendation clears for execution."
source_id: playbook_map_guardrail_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook & MAP Guardrail Check

Cite the Competitive Price Response Agent Retail Execution Playbook and the MAP & Price-Comparison Compliance Policy via lookup_competitive_price_response_agent_execution_playbook before any recommendation clears for execution.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)

Next: [Rule Execution & Audit](/workflow/rule-execution-audit.md)
