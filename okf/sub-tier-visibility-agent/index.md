---
okf_version: "0.1"
type: Knowledge Bundle
title: "Sub-Tier Visibility Agent"
description: "Graph analytics maps multi-tier supply networks with risk propagation modeling — if tier-2 fails, which products are affected. LLM reads CMRT responses and reasons about topology from partial data — two suppliers listing different names at the same Japanese industrial park indicates shared single-point-of-failure. so the Supply Chain Lead can move the Sub-tier visibility depth KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SubTierVisibilityAgent.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Sub-Tier Visibility Agent

> A-1605 • Supplier Risk

## Overview

- **Persona:** Supply Chain Lead
- **Department:** procurement
- **Objective:** Graph analytics maps multi-tier supply networks with risk propagation modeling — if tier-2 fails, which products are affected. LLM reads CMRT responses and reasons about topology from partial data — two suppliers listing different names at the same Japanese industrial park indicates shared single-point-of-failure. so the Supply Chain Lead can move the Sub-tier visibility depth KPI.

## KPI summary

- **Sub-tier visibility depth**: Tier-1 only → Tier-1 through Tier-3
- **Single-point-of-failure detection**: Post-disruption discovery → Proactive identification
- **CMRT response interpretation**: Manual review weeks → Automated in hours

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
