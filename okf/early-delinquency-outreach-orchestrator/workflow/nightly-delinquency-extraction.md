---
type: Workflow Stage
title: Nightly Delinquency Extraction
description: "Query loan_applications from nCino Loan Origination for accounts newly rolling into 1-59 days past due and correlate against open tickets in ServiceNow that flag active hardship requests, disputes, or cease-and-desist notations."
source_id: nightly_delinquency_extraction
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Delinquency Extraction

Query loan_applications from nCino Loan Origination for accounts newly rolling into 1-59 days past due and correlate against open tickets in ServiceNow that flag active hardship requests, disputes, or cease-and-desist notations.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

Next: [Cure-Probability Segmentation](/workflow/cure-probability-segmentation.md)
