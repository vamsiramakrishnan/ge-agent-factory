---
type: Workflow Stage
title: "Seasonal Profile Cross-Check"
description: "Validate each exception against seasonal_profiles (profile_type, peak_week, build_weeks, post_peak_cliff_flag) to separate genuine bias drift from expected seasonal ramp or post-peak cliff behavior."
source_id: seasonal_profile_cross_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Seasonal Profile Cross-Check

Validate each exception against seasonal_profiles (profile_type, peak_week, build_weeks, post_peak_cliff_flag) to separate genuine bias drift from expected seasonal ramp or post-peak cliff behavior.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)

Next: [Override Recommendation & Playbook Citation](/workflow/override-recommendation-playbook-citation.md)
