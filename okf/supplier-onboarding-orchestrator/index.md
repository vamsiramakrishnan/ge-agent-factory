---
okf_version: "0.1"
type: Knowledge Bundle
title: Supplier Onboarding Orchestrator
description: "Orchestrates end-to-end workflow from document collection through vendor master creation in SAP XK01. LLM reads non-standard document formats and detects entity inconsistencies — bank letter says 'Acme LLC' but W-9 says 'Acme Industries Inc.' so the Buyer can move the Onboarding cycle time KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SupplierOnboardingOrchestrator.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Supplier Onboarding Orchestrator

> A-1305 • Supplier Discovery

## Overview

- **Persona:** Buyer
- **Department:** procurement
- **Objective:** Orchestrates end-to-end workflow from document collection through vendor master creation in SAP XK01. LLM reads non-standard document formats and detects entity inconsistencies — bank letter says 'Acme LLC' but W-9 says 'Acme Industries Inc.' so the Buyer can move the Onboarding cycle time KPI.

## KPI summary

- **Onboarding cycle time**: 15-25 days → 3-5 days
- **Duplicate vendor creation**: 8-12% of new records → < 1%
- **Document chase time**: 4-6 follow-ups → Automated reminders

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
