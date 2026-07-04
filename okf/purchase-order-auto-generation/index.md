---
okf_version: "0.1"
type: Knowledge Bundle
title: "Purchase Order Auto-Generation"
description: "Integration layer auto-matches requisitions to contracts with best price, nearest warehouse, and available capacity. LLM interprets non-standard requests ('engineering support — 3 months, 2 FTEs, on-site') and maps to correct SOW and billing rates. so the Buyer can move the Touchless PO rate KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/PurchaseOrderAutoGeneration.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Purchase Order Auto-Generation

> A-1502 • Procure-to-Pay

## Overview

- **Persona:** Buyer
- **Department:** procurement
- **Objective:** Integration layer auto-matches requisitions to contracts with best price, nearest warehouse, and available capacity. LLM interprets non-standard requests ('engineering support — 3 months, 2 FTEs, on-site') and maps to correct SOW and billing rates. so the Buyer can move the Touchless PO rate KPI.

## KPI summary

- **Touchless PO rate**: 15-20% → 85%
- **PO cycle time**: 4-8 hours → <15 minutes
- **Contract leakage**: 18% off-contract → <3% off-contract

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
