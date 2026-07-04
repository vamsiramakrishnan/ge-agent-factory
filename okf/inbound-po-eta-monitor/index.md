---
okf_version: "0.1"
type: Knowledge Bundle
title: Inbound PO ETA Monitor
description: "Ingests ASN, carrier tracking, and port milestone events to predict arrival slippage per PO. Updates ETAs in Manhattan Active WM and rebalances dock appointments when a delay is confirmed. so the Inventory Control Analyst can move the Late-PO detection lead time KPI."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/inbound-po-eta-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:20.874Z"
---

# Inbound PO ETA Monitor

> R-1203 • Supply Chain & Fulfillment

## Overview

- **Persona:** Inventory Control Analyst
- **Department:** retail
- **Objective:** Ingests ASN, carrier tracking, and port milestone events to predict arrival slippage per PO. Updates ETAs in Manhattan Active WM and rebalances dock appointments when a delay is confirmed. so the Inventory Control Analyst can move the Late-PO detection lead time KPI.

## KPI summary

- **Late-PO detection lead time**: 2 days after due → 9 days before due
- **Expedite freight spend**: $620K/qtr → $210K/qtr
- **Receiving dock schedule adherence**: 74% → 92%

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
