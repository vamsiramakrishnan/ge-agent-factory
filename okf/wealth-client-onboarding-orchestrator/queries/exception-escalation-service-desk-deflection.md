---
type: Query Capability
title: Open or update ServiceNow tickets with the custodian rejection reason and a d...
description: "Open or update ServiceNow tickets with the custodian rejection reason and a drafted follow-up for stalled transfers or repeat NIGO rejections, so status inquiries are answered from Salesforce Financial Services Cloud instead of routed to the service desk."
source_id: "exception-escalation-service-desk-deflection"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Open or update ServiceNow tickets with the custodian rejection reason and a drafted follow-up for stalled transfers or repeat NIGO rejections, so status inquiries are answered from Salesforce Financial Services Cloud instead of routed to the service desk.

## Tools used

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

## Runs in

- [exception_escalation_service_desk_deflection](/workflow/exception-escalation-service-desk-deflection.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Wealth Client Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/wealth-client-onboarding-orchestrator-end-to-end.md)
- [Household 6041288's account 80417723 (rollover_401k) had its DocuSign envelope rejected NIGO twice this week -- the custodian cites a missing spousal consent on today's third resubmission -- but Salesforce Financial Services Cloud still shows the account as 'active' with the ACAT transfer marked complete in yesterday's BigQuery analytics_events snapshot. Reconcile the record and tell me whether we can publish the funded status to the advisor.](/tests/wealth-client-onboarding-orchestrator-nigo-resubmission-conflict.md)
- [Referral 942117 for household 6072940 lists product_interest as alternative_investments with estimated_investable_assets of $340,000 and suitability_status 'profile_complete'. The linked client_households record shows accredited_investor as false. The advisor wants the application packet sent out for signature today. What do you do?](/tests/wealth-client-onboarding-orchestrator-alt-investment-accreditation-gap.md)

# Citations

- [Wealth Client Onboarding Orchestrator Banking Compliance Policy](/documents/wealth-client-onboarding-orchestrator-compliance-policy.md)
- [ACAT Transfer & NIGO Rejection Code Runbook](/documents/wealth-client-onboarding-orchestrator-acat-nigo-runbook.md)
