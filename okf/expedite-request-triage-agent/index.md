---
okf_version: "0.1"
type: Knowledge Bundle
title: Expedite Request Triage Agent
description: "Triage every ServiceNow expedite ticket by reconciling the requested_date against the Kinaxis RapidResponse supply_plans and demand_signals, checking alternate stock and open purchase_orders in SAP S/4HANA MM, so genuine requests clear in under 2 hours and total expedite volume falls from 310 to 140 requests per month."
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
provenance_created_at: "2026-07-04T06:18:21.884Z"
---

# Expedite Request Triage Agent

> M-5404 • Supply Chain & Materials

## Overview

- **Persona:** Procurement Buyer
- **Department:** manufacturing
- **Objective:** Triage every ServiceNow expedite ticket by reconciling the requested_date against the Kinaxis RapidResponse supply_plans and demand_signals, checking alternate stock and open purchase_orders in SAP S/4HANA MM, so genuine requests clear in under 2 hours and total expedite volume falls from 310 to 140 requests per month.

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
