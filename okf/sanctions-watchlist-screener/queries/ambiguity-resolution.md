---
type: Query Capability
title: "Gemini resolves matches that fuzzy matching cannot adjudicate: 47 'Mohammad A..."
description: "Gemini resolves matches that fuzzy matching cannot adjudicate: 47 'Mohammad Al-Hassan' entries differentiated by country, industry, associated entities, and dates. Reads adverse media in multiple languages and distinguishes entity-level vs. beneficial owner vs. board member matches for appropriate escalation paths."
source_id: "ambiguity-resolution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini resolves matches that fuzzy matching cannot adjudicate: 47 'Mohammad Al-Hassan' entries differentiated by country, industry, associated entities, and dates. Reads adverse media in multiple languages and distinguishes entity-level vs. beneficial owner vs. board member matches for appropriate escalation paths.

## Tools used

- [action_ofac_sdn_match](/tools/action-ofac-sdn-match.md)

## Runs in

- [ambiguity_resolution](/workflow/ambiguity-resolution.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-watchlist-screener-end-to-end.md)

# Citations

- [Sanctions & Watchlist Screener Procurement Policy Guide](/documents/sanctions-watchlist-screener-policy-guide.md)
