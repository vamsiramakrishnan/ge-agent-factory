---
okf_version: "0.1"
type: Knowledge Bundle
title: ADR Drafter
description: "Gemini retrieves all related ADRs, system context, and technology radar data to build comprehensive decision context. LLM reasons about architectural trade-offs, evaluating options against real constraints and historical outcomes. so the Enterprise Architect can move the ADR drafting time KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/ADRDrafter.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# ADR Drafter

> A-4401 • Enterprise Architecture

## Overview

- **Persona:** Enterprise Architect
- **Department:** it
- **Objective:** Gemini retrieves all related ADRs, system context, and technology radar data to build comprehensive decision context. LLM reasons about architectural trade-offs, evaluating options against real constraints and historical outcomes. so the Enterprise Architect can move the ADR drafting time KPI.

## KPI summary

- **ADR drafting time**: 4-6 hours → 20 minutes
- **Context coverage**: 3-4 prior ADRs checked → All ADRs analyzed
- **Decision consistency**: Ad-hoc review → Pattern-validated

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
