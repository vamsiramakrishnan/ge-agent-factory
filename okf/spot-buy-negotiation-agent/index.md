---
okf_version: "0.1"
type: Knowledge Bundle
title: Spot Buy Negotiation Agent
description: "Agent queries multiple marketplaces simultaneously and benchmarks against historical purchase data to establish competitive price ranges. LLM drafts contextual quote requests — 'We need 50 custom gaskets per attached drawing, material Viton 75A, delivery within 2 weeks to Houston' — giving suppliers enough context to price accurately. so the Buyer can move the Spot buy cycle time KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SpotBuyNegotiationAgent.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Spot Buy Negotiation Agent

> A-1803 • Indirect & Tail Spend

## Overview

- **Persona:** Buyer
- **Department:** procurement
- **Objective:** Agent queries multiple marketplaces simultaneously and benchmarks against historical purchase data to establish competitive price ranges. LLM drafts contextual quote requests — 'We need 50 custom gaskets per attached drawing, material Viton 75A, delivery within 2 weeks to Houston' — giving suppliers enough context to price accurately. so the Buyer can move the Spot buy cycle time KPI.

## KPI summary

- **Spot buy cycle time**: 3-5 days → 4 hours
- **Price improvement**: First quote accepted → 8-15% negotiated
- **Buyer time per spot buy**: 2-3 hours → 15 min review

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
