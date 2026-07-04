---
okf_version: "0.1"
type: Knowledge Bundle
title: Order Jeopardy Prediction Engine
description: "The engine scores every in-flight order daily for slip risk using milestone velocity, supplier history, and task aging. It flags at-risk orders with the specific stalled milestone and the historically fastest recovery path. so the Delivery Program Manager can move the On-time delivery rate for enterprise circuits KPI."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/order-jeopardy-prediction-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:34.246Z"
---

# Order Jeopardy Prediction Engine

> T-4204 • Order Management & Provisioning

## Overview

- **Persona:** Delivery Program Manager
- **Department:** telco
- **Objective:** The engine scores every in-flight order daily for slip risk using milestone velocity, supplier history, and task aging. It flags at-risk orders with the specific stalled milestone and the historically fastest recovery path. so the Delivery Program Manager can move the On-time delivery rate for enterprise circuits KPI.

## KPI summary

- **On-time delivery rate for enterprise circuits**: 68% → 88%
- **Jeopardy detection lead time**: 2 days before due date → 18 days before due date
- **Customer-requested escalations**: 140/month → 45/month

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
