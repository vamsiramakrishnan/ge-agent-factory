---
okf_version: "0.1"
type: Knowledge Bundle
title: "P-Card Reconciliation Agent"
description: "LLM interprets cryptic merchant codes and maps to correct spend categories using vendor context and purchase patterns. Reads receipt images with handwritten notes ('team lunch — 8 attendees') and validates against per-person meal policy limits. so the Buyer can move the Reconciliation time KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/PCardReconciliationAgent.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# P-Card Reconciliation Agent

> A-1511 • Procure-to-Pay

## Overview

- **Persona:** Buyer
- **Department:** procurement
- **Objective:** LLM interprets cryptic merchant codes and maps to correct spend categories using vendor context and purchase patterns. Reads receipt images with handwritten notes ('team lunch — 8 attendees') and validates against per-person meal policy limits. so the Buyer can move the Reconciliation time KPI.

## KPI summary

- **Reconciliation time**: 3-5 days/cycle → Same day
- **Categorization accuracy**: 65% → 94%
- **Policy exceptions caught**: 40% detected → 95% detected

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
