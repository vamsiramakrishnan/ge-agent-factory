---
okf_version: "0.1"
type: Knowledge Bundle
title: Truck Roll Avoidance Agent
description: "Before any field_work_orders dispatch is booked, the agent runs remote diagnostics on the line, CPE, and provisioning state, correlates Zendesk tickets and service_appointments history, and either resolves the fault remotely or files a fully-evidenced work order in Oracle Field Service — cutting the no-fault-found dispatch rate from 27% to 9% and avoiding 5,800 truck rolls per month."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/truck-roll-avoidance-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:50.492Z"
---

# Truck Roll Avoidance Agent

> T-4602 • Field Service & Infrastructure

## Overview

- **Persona:** Field Operations Supervisor
- **Department:** telco
- **Objective:** Before any field_work_orders dispatch is booked, the agent runs remote diagnostics on the line, CPE, and provisioning state, correlates Zendesk tickets and service_appointments history, and either resolves the fault remotely or files a fully-evidenced work order in Oracle Field Service — cutting the no-fault-found dispatch rate from 27% to 9% and avoiding 5,800 truck rolls per month.

## KPI summary

- **Truck rolls avoided**: 0/month baseline → 5,800/month
- **No-fault-found dispatch rate**: 27% → 9%
- **Cost per resolved trouble ticket**: $142 → $61

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
