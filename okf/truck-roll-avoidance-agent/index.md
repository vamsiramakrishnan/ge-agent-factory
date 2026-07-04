---
okf_version: "0.1"
type: Knowledge Bundle
title: Truck Roll Avoidance Agent
description: "The agent runs a full remote diagnostic battery on the line, CPE, and provisioning state before any dispatch is booked. It executes safe remote remediations like ONT resets, profile re-pushes, and firmware updates, and verifies service restoration with the customer. so the Field Operations Supervisor can move the Truck rolls avoided KPI."
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
provenance_created_at: "2026-07-04T04:05:41.864Z"
---

# Truck Roll Avoidance Agent

> T-4602 • Field Service & Infrastructure

## Overview

- **Persona:** Field Operations Supervisor
- **Department:** telco
- **Objective:** The agent runs a full remote diagnostic battery on the line, CPE, and provisioning state before any dispatch is booked. It executes safe remote remediations like ONT resets, profile re-pushes, and firmware updates, and verifies service restoration with the customer. so the Field Operations Supervisor can move the Truck rolls avoided KPI.

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
