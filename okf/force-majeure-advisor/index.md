---
okf_version: "0.1"
type: Knowledge Bundle
title: Force Majeure Advisor
description: "Gemini performs RAG over contract repository to instantly identify all contracts affected by a specific disruption event. LLM reasons about FM clause specifics: 'FM clause lists labor disputes but specifies at supplier facility — port strike is third-party, likely does not qualify.' so the Legal Procurement Counsel can move the Affected contract identification KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/ForceMajeureAdvisor.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Force Majeure Advisor

> A-1409 • Contract Lifecycle

## Overview

- **Persona:** Legal Procurement Counsel
- **Department:** procurement
- **Objective:** Gemini performs RAG over contract repository to instantly identify all contracts affected by a specific disruption event. LLM reasons about FM clause specifics: 'FM clause lists labor disputes but specifies at supplier facility — port strike is third-party, likely does not qualify.' so the Legal Procurement Counsel can move the Affected contract identification KPI.

## KPI summary

- **Affected contract identification**: Days of manual search → Minutes
- **FM qualification accuracy**: Inconsistent legal opinions → Clause-specific analysis
- **Termination cost visibility**: Unknown until negotiated → Pre-modeled scenarios

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
