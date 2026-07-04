---
type: Workflow Stage
title: "Refresh Due-Date Triage"
description: "Query kyc_cases and entity_profiles in Fenergo CLM against next_review_date and profile_last_refreshed to build the current period's beneficial-ownership refresh cohort and prioritize past-due entities."
source_id: refresh_due_date_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Refresh Due-Date Triage

Query kyc_cases and entity_profiles in Fenergo CLM against next_review_date and profile_last_refreshed to build the current period's beneficial-ownership refresh cohort and prioritize past-due entities.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Registry & FinCEN BOI Cross-Check](/workflow/registry-fin-cen-boi-cross-check.md)
