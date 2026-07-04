---
okf_version: "0.1"
type: Knowledge Bundle
title: eSIM Activation Orchestrator
description: "The orchestrator watches every activation flow end to end and retries or re-sequences failed profile downloads automatically. It reconciles subscriber state across HSS, entitlement, and billing before declaring an activation complete. so the Provisioning Engineer can move the eSIM activation success rate KPI."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/esim-activation-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:33.409Z"
---

# eSIM Activation Orchestrator

> T-4202 • Order Management & Provisioning

## Overview

- **Persona:** Provisioning Engineer
- **Department:** telco
- **Objective:** The orchestrator watches every activation flow end to end and retries or re-sequences failed profile downloads automatically. It reconciles subscriber state across HSS, entitlement, and billing before declaring an activation complete. so the Provisioning Engineer can move the eSIM activation success rate KPI.

## KPI summary

- **eSIM activation success rate**: 91% → 99.2%
- **Average activation time**: 45 minutes → 90 seconds
- **Activation-related care calls**: 12,000/month → 2,400/month

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
