---
okf_version: "0.1"
type: Knowledge Bundle
title: Promo Forecast Accuracy Analyzer
description: "Decompose event-level promo lift in demand_forecasts into true incremental, cannibalized, and pulled-forward volume using elasticity_models and price_recommendations from Revionics, cutting promo lift forecast error from 42% to 16% while publishing an automated post-event scorecard within 72 hours of event close for 100% of promotions instead of the current 10%."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/promo-forecast-accuracy-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:38.322Z"
---

# Promo Forecast Accuracy Analyzer

> R-1603 • Pricing & Promotions

## Overview

- **Persona:** Promotions Manager
- **Department:** retail
- **Objective:** Decompose event-level promo lift in demand_forecasts into true incremental, cannibalized, and pulled-forward volume using elasticity_models and price_recommendations from Revionics, cutting promo lift forecast error from 42% to 16% while publishing an automated post-event scorecard within 72 hours of event close for 100% of promotions instead of the current 10%.

## KPI summary

- **Promo lift forecast error**: 42% → 16%
- **Promo events with post-event analysis**: 10% → 100%
- **Ad-item in-stock during events**: 84% → 96%

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
