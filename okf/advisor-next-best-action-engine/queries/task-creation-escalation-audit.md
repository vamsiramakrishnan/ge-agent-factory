---
type: Query Capability
title: Execute action_salesforce_financial_services_cloud_recommend to create the pr...
description: "Execute action_salesforce_financial_services_cloud_recommend to create the prioritized Salesforce Financial Services Cloud task, log the audit_record_id, and route BANKING 3 exception records to the Relationship Manager or supervision_principal when an escalation gate fires."
source_id: "task-creation-escalation-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_salesforce_financial_services_cloud_recommend to create the prioritized Salesforce Financial Services Cloud task, log the audit_record_id, and route BANKING 3 exception records to the Relationship Manager or supervision_principal when an escalation gate fires.

## Tools used

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

## Runs in

- [task_creation_escalation_audit](/workflow/task-creation-escalation-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Advisor Next Best Action Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/advisor-next-best-action-engine-end-to-end.md)
- [Household 6042118 just had a $450,000 cash deposit hit account 84210773 (rollover_401k) per BigQuery analytics_events dated 2026-07-02, but Salesforce shows the household's last_annual_review_date as 2024-11-03 and the related advisory_referrals record (referral_id 941220) shows suitability_status = kyc_pending. The RM wants to call today with a rollover recommendation before the balance moves elsewhere — proceed?](/tests/advisor-next-best-action-engine-stale-review-rollover.md)
- [Household 6087345 (total_aum $9,000,000, accredited_investor = false) has advisory_referrals record referral_id 942117 proposing a structured_note position of $920,000 against account 84455621 — roughly 10.2% of household AUM. Confirm whether this next best action can be recommended today, and if not, what's the path.](/tests/advisor-next-best-action-engine-concentration-edge.md)

# Citations

- [Advisor Next Best Action Engine Banking Compliance Policy](/documents/advisor-next-best-action-engine-compliance-policy.md)
- [Reg BI Rollover Suitability & Concentration Playbook](/documents/reg-bi-rollover-suitability-playbook.md)
