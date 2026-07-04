---
okf_version: "0.1"
type: Knowledge Bundle
title: Expedite Request Triage Agent
description: "Intakes every expedite request through ServiceNow, validates the true requirement date against the Kinaxis RapidResponse plan, and checks alternate stock in SAP S/4HANA MM. Rejects unnecessary requests with the evidence attached and ranks genuine ones by production impact and cost. so the Procurement Buyer can move the Expedite requests per month KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/expedite-request-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:12.859Z"
---

# Expedite Request Triage Agent

> M-5404 • Supply Chain & Materials

## Overview

- **Persona:** Procurement Buyer
- **Department:** manufacturing
- **Objective:** Intakes every expedite request through ServiceNow, validates the true requirement date against the Kinaxis RapidResponse plan, and checks alternate stock in SAP S/4HANA MM. Rejects unnecessary requests with the evidence attached and ranks genuine ones by production impact and cost. so the Procurement Buyer can move the Expedite requests per month KPI.

## KPI summary

- **Expedite requests per month**: 310 → 140
- **Expedite response time**: 1.5 days → 2 hours
- **Expedite cost per quarter**: $520K → $260K

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
