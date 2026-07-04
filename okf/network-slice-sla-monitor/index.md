---
okf_version: "0.1"
type: Knowledge Bundle
title: "5G Network Slice SLA Monitor"
description: "The monitor evaluates per-slice latency, throughput, and availability against contracted SLOs continuously. It triggers slice reconfiguration or resource reallocation workflows when a KPI trends toward breach. so the Service Assurance Manager can move the Slice SLA breach detection time KPI."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/network-slice-sla-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:36.452Z"
---

# 5G Network Slice SLA Monitor

> T-4304 • Network Operations & Assurance

## Overview

- **Persona:** Service Assurance Manager
- **Department:** telco
- **Objective:** The monitor evaluates per-slice latency, throughput, and availability against contracted SLOs continuously. It triggers slice reconfiguration or resource reallocation workflows when a KPI trends toward breach. so the Service Assurance Manager can move the Slice SLA breach detection time KPI.

## KPI summary

- **Slice SLA breach detection time**: next-day report → under 60 seconds
- **SLA credits paid to slice customers**: $1.8M/year → $400K/year
- **Slice KPI reporting effort**: 3 analyst-days/month per customer → fully automated

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
