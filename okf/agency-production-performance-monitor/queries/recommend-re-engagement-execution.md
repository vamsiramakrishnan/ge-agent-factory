---
type: Query Capability
title: "Execute action_duck_creek_policy_recommend with a full audit trail and, where..."
description: "Execute action_duck_creek_policy_recommend with a full audit trail and, where two-system evidence supports it, hand off segmented re-engagement campaign triggers through Salesforce Marketing Cloud campaign_influence."
source_id: "recommend-re-engagement-execution"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_duck_creek_policy_recommend with a full audit trail and, where two-system evidence supports it, hand off segmented re-engagement campaign triggers through Salesforce Marketing Cloud campaign_influence.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_duck_creek_policy_recommend](/tools/action-duck-creek-policy-recommend.md)

## Runs in

- [recommend_re_engagement_execution](/workflow/recommend-re-engagement-execution.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Agency Production Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agency-production-performance-monitor-end-to-end.md)
- [Agency 'Meridian Coastal Insurance Group' (Salesforce account id ACC-40217) shows 3 opportunities marked closed_won in the last 30 days in Salesforce Marketing Cloud, but Duck Creek Policy rating_worksheets for the same agency's book show final_developed_premium down 18% quarter-over-quarter and quote_number volume down 22%. Reconcile the conflict and tell me whether to trigger a re-engagement campaign for this agency.](/tests/agency-production-performance-monitor-conflicting-signals.md)

# Citations

- [Agency Production Performance Monitor Authority & Referral Guide](/documents/agency-production-performance-monitor-authority-guide.md)
- [Agency Segmentation & Re-Engagement Playbook](/documents/agency-segmentation-reengagement-playbook.md)
