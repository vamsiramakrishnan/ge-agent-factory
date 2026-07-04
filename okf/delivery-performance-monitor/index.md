---
okf_version: "0.1"
type: Knowledge Bundle
title: Delivery Performance Monitor
description: "Predictive late-delivery alerting using ASN data + transit time models — flags delays before they arrive at the dock. LLM reads carrier notifications: 'shipment held at customs — documentation discrepancy' and reasons about likely delay duration and downstream impact. so the Supplier Relationship Manager can move the Late delivery detection KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/DeliveryPerformanceMonitor.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Delivery Performance Monitor

> A-1703 • Supplier Performance

## Overview

- **Persona:** Supplier Relationship Manager
- **Department:** procurement
- **Objective:** Predictive late-delivery alerting using ASN data + transit time models — flags delays before they arrive at the dock. LLM reads carrier notifications: 'shipment held at customs — documentation discrepancy' and reasons about likely delay duration and downstream impact. so the Supplier Relationship Manager can move the Late delivery detection KPI.

## KPI summary

- **Late delivery detection**: After receipt (reactive) → In-transit prediction
- **OTIF reporting cycle**: Monthly manual → Daily automated
- **Exception resolution time**: 48 hours → 4 hours

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
