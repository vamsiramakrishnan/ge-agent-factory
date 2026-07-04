---
type: Workflow Stage
title: Retrieve Records
description: "Query active employees, benefit enrollments, and active exceptions from SAP S/4HANA FI"
source_id: retrieve_records
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Retrieve Records

Query active employees, benefit enrollments, and active exceptions from SAP S/4HANA FI

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_fi_employees](/tools/query-sap-s-4hana-fi-employees.md)
- [query_sap_s_4hana_fi_benefit_enrollments](/tools/query-sap-s-4hana-fi-benefit-enrollments.md)
- [query_sap_s_4hana_fi_payroll_exceptions](/tools/query-sap-s-4hana-fi-payroll-exceptions.md)
- [query_blackline_benefit_deductions](/tools/query-blackline-benefit-deductions.md)
- [query_bigquery_historical_exceptions](/tools/query-bigquery-historical-exceptions.md)
- [lookup_benefits_runbook](/tools/lookup-benefits-runbook.md)
- [action_sap_s_4hana_fi_sync_enrollment](/tools/action-sap-s-4hana-fi-sync-enrollment.md)

Next: [Fetch Deductions](/workflow/fetch-deductions.md)
