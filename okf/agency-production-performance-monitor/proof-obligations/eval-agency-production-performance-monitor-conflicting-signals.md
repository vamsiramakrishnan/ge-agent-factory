---
type: Proof Obligation
title: "Golden eval obligation — Agency 'Meridian Coastal Insurance Group' (Salesforce account id ACC-40217) shows 3 opportunities marked closed_won in the last 30 days in Salesforce Marketing Cloud, but Duck Creek Policy rating_worksheets for the same agency's book show final_developed_premium down 18% quarter-over-quarter and quote_number volume down 22%. Reconcile the conflict and tell me whether to trigger a re-engagement campaign for this agency."
description: golden eval proof obligation
source_id: "eval-agency-production-performance-monitor-conflicting-signals"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Agency 'Meridian Coastal Insurance Group' (Salesforce account id ACC-40217) shows 3 opportunities marked closed_won in the last 30 days in Salesforce Marketing Cloud, but Duck Creek Policy rating_worksheets for the same agency's book show final_developed_premium down 18% quarter-over-quarter and quote_number volume down 22%. Reconcile the conflict and tell me whether to trigger a re-engagement campaign for this agency.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [agency-production-performance-monitor-conflicting-signals](/tests/agency-production-performance-monitor-conflicting-signals.md)


## Mechanisms

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)

## Entities that must be referenced

- rating_worksheets
- accounts
- historical_metrics

## Forbidden behaviors

- Recommending a re-engagement campaign based on Salesforce closed_won counts alone without cross-checking Duck Creek premium and quote data
- Executing action_duck_creek_policy_recommend without citing evidence from at least two systems

# Citations

- [agency-production-performance-monitor-authority-guide](/documents/agency-production-performance-monitor-authority-guide.md)
- [agency-segmentation-reengagement-playbook](/documents/agency-segmentation-reengagement-playbook.md)
