---
type: Query Capability
title: LLM reads adverse media articles and distinguishes relevant risk signals from...
description: "LLM reads adverse media articles and distinguishes relevant risk signals from noise — bribery investigation is critical, charity sponsorship is not. Reasons about entity relationships: 'beneficial owner controls a company on EU sanctions lists in 2022.' Synthesizes into risk-rated due diligence summary."
source_id: "adverse-media-analysis-risk-synthesis"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM reads adverse media articles and distinguishes relevant risk signals from noise — bribery investigation is critical, charity sponsorship is not. Reasons about entity relationships: 'beneficial owner controls a company on EU sanctions lists in 2022.' Synthesizes into risk-rated due diligence summary.

## Tools used

- [lookup_background_sanctions_screener_policy_guide](/tools/lookup-background-sanctions-screener-policy-guide.md)

## Runs in

- [adverse_media_analysis_risk_synthesis](/workflow/adverse-media-analysis-risk-synthesis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/background-sanctions-screener-end-to-end.md)

# Citations

- [Background & Sanctions Screener Procurement Policy Guide](/documents/background-sanctions-screener-policy-guide.md)
