---
okf_version: "0.1"
type: Knowledge Bundle
title: "Travel & Expense Compliance Agent"
description: "Policy rule engine validates meal limits by city tier, hotel rate caps, and mileage rates in real time at submission. Anomaly detection flags patterns suggesting policy gaming: 'This employee consistently submits expenses at exactly $1 below the manager-approval threshold.' so the Indirect Procurement Lead can move the Policy violation detection KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/TravelExpenseComplianceAgent.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Travel & Expense Compliance Agent

> A-1805 • Indirect & Tail Spend

## Overview

- **Persona:** Indirect Procurement Lead
- **Department:** procurement
- **Objective:** Policy rule engine validates meal limits by city tier, hotel rate caps, and mileage rates in real time at submission. Anomaly detection flags patterns suggesting policy gaming: 'This employee consistently submits expenses at exactly $1 below the manager-approval threshold.' so the Indirect Procurement Lead can move the Policy violation detection KPI.

## KPI summary

- **Policy violation detection**: 5% caught by audit → 94% caught at submission
- **Expense processing time**: 8-12 days → < 24 hours
- **T&E policy compliance**: 72% → 96%

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
