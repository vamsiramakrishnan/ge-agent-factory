---
type: Workflow Stage
title: "Analyze & Resolve"
description: "Verify discrepancy against the GE Benefits Runbook, auto-sync and resolve under-threshold discrepancies"
source_id: analyze_resolve
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze & Resolve

Verify discrepancy against the GE Benefits Runbook, auto-sync and resolve under-threshold discrepancies

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_sap_s_4hana_fi_benefit_enrollments](/tools/query-sap-s-4hana-fi-benefit-enrollments.md)
- [query_blackline_benefit_deductions](/tools/query-blackline-benefit-deductions.md)
- [lookup_benefits_runbook](/tools/lookup-benefits-runbook.md)
- [action_sap_s_4hana_fi_sync_enrollment](/tools/action-sap-s-4hana-fi-sync-enrollment.md)
