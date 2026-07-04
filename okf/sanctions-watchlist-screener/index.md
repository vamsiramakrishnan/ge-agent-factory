---
okf_version: "0.1"
type: Knowledge Bundle
title: "Sanctions & Watchlist Screener"
description: "Fuzzy name/alias matching across OFAC, EU, UN, and OFSI lists with configurable confidence thresholds. LLM resolves ambiguous matches using entity context — country, industry, associated entities, dates — to separate true hits from false positives. so the Compliance Manager can move the False positive rate KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SanctionsWatchlistScreener.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Sanctions & Watchlist Screener

> A-1603 • Supplier Risk

## Overview

- **Persona:** Compliance Manager
- **Department:** procurement
- **Objective:** Fuzzy name/alias matching across OFAC, EU, UN, and OFSI lists with configurable confidence thresholds. LLM resolves ambiguous matches using entity context — country, industry, associated entities, dates — to separate true hits from false positives. so the Compliance Manager can move the False positive rate KPI.

## KPI summary

- **False positive rate**: 85% manual triage → 15% with LLM context
- **Screening coverage**: New suppliers only → Full vendor master daily
- **Resolution time per match**: 2-4 hours → 15 minutes

## Contents

- [Playbook — role, scope, guardrails](/playbook.md)
- [Source Systems](/systems/index.md)
- [Data Entities](/tables/index.md)
- [Agent Tools](/tools/index.md)
- [Workflow Stages](/workflow/index.md)
- [Query Capabilities](/queries/index.md)
- [Eval Scenarios](/tests/index.md)
- [Source Documents](/documents/index.md)
- [Claims](/claims/index.md)
- [Policies](/policies/index.md)
- [Proof Obligations](/proof-obligations/index.md)
- [KPIs](/kpis.md)
- [Golden Evals](/evals.md)
