---
okf_version: "0.1"
type: Knowledge Bundle
title: Carrier Delivery SLA Analyzer
description: "Audits every carrier invoice against contract rate cards and delivery scans in BigQuery. Drafts dispute claims for late deliveries and overbilling with shipment-level evidence attached. so the Transportation Manager can move the On-time delivery rate KPI."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/carrier-delivery-sla-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:21.689Z"
---

# Carrier Delivery SLA Analyzer

> R-1205 • Supply Chain & Fulfillment

## Overview

- **Persona:** Transportation Manager
- **Department:** retail
- **Objective:** Audits every carrier invoice against contract rate cards and delivery scans in BigQuery. Drafts dispute claims for late deliveries and overbilling with shipment-level evidence attached. so the Transportation Manager can move the On-time delivery rate KPI.

## KPI summary

- **On-time delivery rate**: 89% → 97%
- **Carrier claim recovery cycle**: 45 days → 7 days
- **Cost per package variance vs. contract**: +6.5% → +0.9%

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
