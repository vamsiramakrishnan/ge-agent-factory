---
okf_version: "0.1"
type: Knowledge Bundle
title: Duplicate Payment Detector
description: "ML clustering identifies duplicate patterns across time windows, legal entities, and invoice number variations. LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or separate deliveries. so the AP Manager can move the Duplicate detection rate KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/DuplicatePaymentDetector.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Duplicate Payment Detector

> A-1505 • Procure-to-Pay

## Overview

- **Persona:** AP Manager
- **Department:** procurement
- **Objective:** ML clustering identifies duplicate patterns across time windows, legal entities, and invoice number variations. LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or separate deliveries. so the AP Manager can move the Duplicate detection rate KPI.

## KPI summary

- **Duplicate detection rate**: 60% caught → 98% caught
- **False positive rate**: 40% of flags → <8% of flags
- **Annual recovery**: $200K → $1.2M

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
