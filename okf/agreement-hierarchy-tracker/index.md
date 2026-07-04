---
okf_version: "0.1"
type: Knowledge Bundle
title: Agreement Hierarchy Tracker
description: "Gemini maintains a knowledge graph of agreement relationships — MSA → SOW → amendments → change orders → POs — updated in real time. LLM resolves inheritance ambiguity: 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged — confirms Amendments 3 and 4 still effective.' so the Contract Manager can move the Orphan POs detected KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/AgreementHierarchyTracker.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Agreement Hierarchy Tracker

> A-1407 • Contract Lifecycle

## Overview

- **Persona:** Contract Manager
- **Department:** procurement
- **Objective:** Gemini maintains a knowledge graph of agreement relationships — MSA → SOW → amendments → change orders → POs — updated in real time. LLM resolves inheritance ambiguity: 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged — confirms Amendments 3 and 4 still effective.' so the Contract Manager can move the Orphan POs detected KPI.

## KPI summary

- **Orphan POs detected**: Unknown → 100% flagged
- **Term conflict resolution**: Discovered in disputes → Proactively identified
- **Agreement mapping time**: Days of manual tracing → Real-time graph

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
