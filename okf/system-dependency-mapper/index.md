---
okf_version: "0.1"
type: Knowledge Bundle
title: System Dependency Mapper
description: "Gemini merges APM traces, CMDB records, and code-level dependencies into a live dependency graph. LLM reasons about which dependencies are critical path vs. best-effort, recommending async patterns. so the Enterprise Architect can move the Dependency coverage KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/SystemDependencyMapper.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# System Dependency Mapper

> A-4403 • Enterprise Architecture

## Overview

- **Persona:** Enterprise Architect
- **Department:** it
- **Objective:** Gemini merges APM traces, CMDB records, and code-level dependencies into a live dependency graph. LLM reasons about which dependencies are critical path vs. best-effort, recommending async patterns. so the Enterprise Architect can move the Dependency coverage KPI.

## KPI summary

- **Dependency coverage**: 40% documented → 95% auto-discovered
- **SPOF identification**: Post-incident only → Proactive weekly
- **Change blast radius accuracy**: Gut feel → Data-validated

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
