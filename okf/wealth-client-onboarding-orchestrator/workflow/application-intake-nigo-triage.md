---
type: Workflow Stage
title: "Application intake & NIGO triage"
description: "Pull new client_households and financial_accounts records from Salesforce Financial Services Cloud alongside envelopes and recipients from DocuSign, and flag missing signatures or custodian formatting defects before an application packet is ever routed for signature."
source_id: application_intake_nigo_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Application intake & NIGO triage

Pull new client_households and financial_accounts records from Salesforce Financial Services Cloud alongside envelopes and recipients from DocuSign, and flag missing signatures or custodian formatting defects before an application packet is ever routed for signature.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_wealth_client_onboarding_orchestrator_compliance_policy](/tools/lookup-wealth-client-onboarding-orchestrator-compliance-policy.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

Next: [Suitability, Reg BI & accreditation verification](/workflow/suitability-reg-bi-accreditation-verification.md)
