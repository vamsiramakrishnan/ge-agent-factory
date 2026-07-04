---
okf_version: "0.1"
type: Knowledge Bundle
title: Regulatory Compliance Tracker
description: "RAG pipeline over regulatory corpus retrieves relevant rules and maps them to affected supplier categories automatically. LLM interprets new regulatory texts — 'CBAM reporting requires embedded emissions data from steel suppliers starting Jan 2027' — and identifies which 3 of 12 suppliers can provide it. so the Compliance Manager can move the Regulation detection lag KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/RegulatoryComplianceTracker.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Regulatory Compliance Tracker

> A-1604 • Supplier Risk

## Overview

- **Persona:** Compliance Manager
- **Department:** procurement
- **Objective:** RAG pipeline over regulatory corpus retrieves relevant rules and maps them to affected supplier categories automatically. LLM interprets new regulatory texts — 'CBAM reporting requires embedded emissions data from steel suppliers starting Jan 2027' — and identifies which 3 of 12 suppliers can provide it. so the Compliance Manager can move the Regulation detection lag KPI.

## KPI summary

- **Regulation detection lag**: Months after enactment → Days of publication
- **Supplier compliance gaps identified**: Audit-discovered → Proactively flagged
- **Impact assessment time**: 2-3 weeks → 48 hours

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
