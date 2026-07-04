---
okf_version: "0.1"
type: Knowledge Bundle
title: Sanctions Screening Hit Analyzer
description: "Auto-adjudicate sanctions screening_results hits from Fenergo CLM against OFAC SDN, UN 1267 Committee, and EU Consolidated list entries by scoring fuzzy_match_score against entity_profiles and kyc_cases identifiers, lifting Screening hits auto-adjudicated from 0% to 62% and cutting average hit disposition time from 22 minutes to 3 minutes, while routing every true_match or fincen_314a_match hit to a senior analyst with cited evidence instead of auto-clearing it."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/sanctions-screening-hit-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:56.280Z"
---

# Sanctions Screening Hit Analyzer

> B-2405 • KYC, AML & Compliance

## Overview

- **Persona:** Sanctions Screening Analyst
- **Department:** banking
- **Objective:** Auto-adjudicate sanctions screening_results hits from Fenergo CLM against OFAC SDN, UN 1267 Committee, and EU Consolidated list entries by scoring fuzzy_match_score against entity_profiles and kyc_cases identifiers, lifting Screening hits auto-adjudicated from 0% to 62% and cutting average hit disposition time from 22 minutes to 3 minutes, while routing every true_match or fincen_314a_match hit to a senior analyst with cited evidence instead of auto-clearing it.

## KPI summary

- **Screening hits auto-adjudicated**: 0% → 62%
- **Average hit disposition time**: 22 min → 3 min
- **Payment delays from screening queues**: 4.2 hrs avg → 35 min avg

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
