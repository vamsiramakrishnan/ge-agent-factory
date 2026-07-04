---
okf_version: "0.1"
type: Knowledge Bundle
title: Supplier Risk Scoring Engine
description: "Multi-factor ML model integrates financial (RapidRatings), cyber (BitSight), operational (Resilinc), and credit (Moody's) data. LLM synthesizes individually minor signals — small D&B downgrade + executive departure + declining OTIF — into distress pattern narratives. so the Supplier Risk Analyst can move the Risk signal sources KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SupplierRiskScoringEngine.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Supplier Risk Scoring Engine

> A-1601 • Supplier Risk

## Overview

- **Persona:** Supplier Risk Analyst
- **Department:** procurement
- **Objective:** Multi-factor ML model integrates financial (RapidRatings), cyber (BitSight), operational (Resilinc), and credit (Moody's) data. LLM synthesizes individually minor signals — small D&B downgrade + executive departure + declining OTIF — into distress pattern narratives. so the Supplier Risk Analyst can move the Risk signal sources KPI.

## KPI summary

- **Risk signal sources**: 2-3 manual checks → 7 automated feeds
- **Score refresh cycle**: Quarterly → Continuous
- **Early distress detection**: After disruption → 3-6 months advance

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
