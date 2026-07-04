---
okf_version: "0.1"
type: Knowledge Bundle
title: "Spend Classification & Enrichment"
description: "Gemini reads vendor context, cost center, and purchase history to classify the 20% of transactions that ML cannot confidently handle. LLM reasons about entity relationships — 'Acme Corp' vs. 'Acme Holdings GmbH' — using business judgment, not just string matching. so the Procurement Analytics Lead can move the Classification accuracy KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SpendClassificationEnrichment.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Spend Classification & Enrichment

> A-1201 • Strategic Sourcing

## Overview

- **Persona:** Procurement Analytics Lead
- **Department:** procurement
- **Objective:** Gemini reads vendor context, cost center, and purchase history to classify the 20% of transactions that ML cannot confidently handle. LLM reasons about entity relationships — 'Acme Corp' vs. 'Acme Holdings GmbH' — using business judgment, not just string matching. so the Procurement Analytics Lead can move the Classification accuracy KPI.

## KPI summary

- **Classification accuracy**: 78% → 96%
- **Unclassified spend**: 15-20% → <2%
- **Supplier duplicates**: 12% of master → <1%

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
