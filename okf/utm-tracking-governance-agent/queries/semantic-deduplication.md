---
type: Query Capability
title: Gemini catches UTM governance issues that pattern matching misses. Detects th...
description: "Gemini catches UTM governance issues that pattern matching misses. Detects that 'webinar-ai-2025' and '2025-ai-webinar' refer to the same campaign. Suggests canonical naming and identifies historical data needing cleanup."
source_id: "semantic-deduplication"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini catches UTM governance issues that pattern matching misses. Detects that 'webinar-ai-2025' and '2025-ai-webinar' refer to the same campaign. Suggests canonical naming and identifies historical data needing cleanup.

## Tools used

- [lookup_utm_tracking_governance_agent_playbook](/tools/lookup-utm-tracking-governance-agent-playbook.md)

## Runs in

- [semantic_deduplication](/workflow/semantic-deduplication.md)

## Evidence expected

- document_reference

## Evals

- [Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/utm-tracking-governance-agent-end-to-end.md)

# Citations

- [UTM & Tracking Governance Agent Playbook](/documents/utm-tracking-governance-agent-playbook.md)
