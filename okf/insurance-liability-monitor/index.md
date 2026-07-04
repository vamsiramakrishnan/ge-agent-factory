---
okf_version: "0.1"
type: Knowledge Bundle
title: "Insurance & Liability Monitor"
description: "OCR/NLP via Document AI reads COIs in non-standard formats and extracts policy type, limits, deductibles, named insured, and endorsements. LLM validates coverage against contract requirements: 'COI shows $5M umbrella but contract requires $10M — gap flagged.' so the Contract Manager can move the Expired certificate detection KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/InsuranceLiabilityMonitor.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Insurance & Liability Monitor

> A-1608 • Supplier Risk

## Overview

- **Persona:** Contract Manager
- **Department:** procurement
- **Objective:** OCR/NLP via Document AI reads COIs in non-standard formats and extracts policy type, limits, deductibles, named insured, and endorsements. LLM validates coverage against contract requirements: 'COI shows $5M umbrella but contract requires $10M — gap flagged.' so the Contract Manager can move the Expired certificate detection KPI.

## KPI summary

- **Expired certificate detection**: Quarterly manual audit → Real-time tracking
- **COI processing time**: 15 min per cert → 30 seconds automated
- **Coverage gap detection rate**: Spot-checked → 100% validated

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
