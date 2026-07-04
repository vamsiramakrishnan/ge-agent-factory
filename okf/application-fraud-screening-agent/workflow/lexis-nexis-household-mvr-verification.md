---
type: Workflow Stage
title: "LexisNexis Household & MVR Verification"
description: "Pull LexisNexis Risk Solutions prefill_datasets and mvr_records to confirm garaging address, undisclosed operators, and license_status against the applicant's stated facts, flagging any prefill_datasets match_confidence that falls below the verification threshold."
source_id: lexis_nexis_household_mvr_verification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# LexisNexis Household & MVR Verification

Pull LexisNexis Risk Solutions prefill_datasets and mvr_records to confirm garaging address, undisclosed operators, and license_status against the applicant's stated facts, flagging any prefill_datasets match_confidence that falls below the verification threshold.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_application_fraud_screening_agent_authority_guide](/tools/lookup-application-fraud-screening-agent-authority-guide.md)

Next: [Network Link & Producer Cluster Analysis](/workflow/network-link-producer-cluster-analysis.md)
