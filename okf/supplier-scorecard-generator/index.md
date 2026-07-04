---
okf_version: "0.1"
type: Knowledge Bundle
title: Supplier Scorecard Generator
description: "Automated KPI aggregation with statistical significance testing on performance changes — flags real shifts vs. noise. LLM generates scorecard commentary: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not systemic.' so the Supplier Relationship Manager can move the Scorecard cycle time KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SupplierScorecardGenerator.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Supplier Scorecard Generator

> A-1701 • Supplier Performance

## Overview

- **Persona:** Supplier Relationship Manager
- **Department:** procurement
- **Objective:** Automated KPI aggregation with statistical significance testing on performance changes — flags real shifts vs. noise. LLM generates scorecard commentary: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not systemic.' so the Supplier Relationship Manager can move the Scorecard cycle time KPI.

## KPI summary

- **Scorecard cycle time**: 5-7 days manual → Automated overnight
- **KPI data sources**: 3-4 siloed → 12+ integrated
- **Commentary quality**: Numbers only → Contextual narrative

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
