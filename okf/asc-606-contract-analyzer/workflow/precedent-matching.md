---
type: Workflow Stage
title: Precedent Matching
description: Compare extracted terms against historical contract analyses to identify similar treatments. Flag novel terms without precedent for enhanced review.
source_id: precedent_matching
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Precedent Matching

Compare extracted terms against historical contract analyses to identify similar treatments. Flag novel terms without precedent for enhanced review.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_asc_606_contract_analyzer_controls_playbook](/tools/lookup-asc-606-contract-analyzer-controls-playbook.md)
- [action_sap_s_4hana_sd_match](/tools/action-sap-s-4hana-sd-match.md)

Next: [ASC 606 Application](/workflow/asc-606-application.md)
