---
type: Query Capability
title: "Link engagement scores to attrition, productivity, and revenue data across sy..."
description: "Link engagement scores to attrition, productivity, and revenue data across systems. Build unified dataset with time-series alignment for longitudinal analysis."
source_id: "data-integration"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Link engagement scores to attrition, productivity, and revenue data across systems. Build unified dataset with time-series alignment for longitudinal analysis.

## Tools used

- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_finance_system_finance_system_records](/tools/query-finance-system-finance-system-records.md)
- [lookup_engagement_to_outcome_correlation_agent_policy_handbook](/tools/lookup-engagement-to-outcome-correlation-agent-policy-handbook.md)

## Runs in

- [data_integration](/workflow/data-integration.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engagement-to-outcome-correlation-agent-end-to-end.md)

# Citations

- [Engagement-to-Outcome Correlation Agent Policy Handbook](/documents/engagement-to-outcome-correlation-agent-policy-handbook.md)
