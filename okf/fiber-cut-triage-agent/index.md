---
okf_version: "0.1"
type: Knowledge Bundle
title: Fiber Cut Triage Agent
description: "The agent triangulates the break location from OTDR distance readings mapped onto GIS fiber routes and splice-point records. It computes the full service-impact blast radius, triggers automatic traffic reroutes where protection paths exist, and opens the master incident. so the NOC Engineer can move the Time to locate fiber break KPI."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/fiber-cut-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:36.027Z"
---

# Fiber Cut Triage Agent

> T-4303 • Network Operations & Assurance

## Overview

- **Persona:** NOC Engineer
- **Department:** telco
- **Objective:** The agent triangulates the break location from OTDR distance readings mapped onto GIS fiber routes and splice-point records. It computes the full service-impact blast radius, triggers automatic traffic reroutes where protection paths exist, and opens the master incident. so the NOC Engineer can move the Time to locate fiber break KPI.

## KPI summary

- **Time to locate fiber break**: 95 minutes → 12 minutes
- **Mean restoration time for backbone cuts**: 6.8 hours → 3.1 hours
- **Affected-customer notification time**: 2+ hours → under 10 minutes

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
