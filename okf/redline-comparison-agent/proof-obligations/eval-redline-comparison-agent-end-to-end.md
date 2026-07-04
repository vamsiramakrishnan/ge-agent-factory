---
type: Proof Obligation
title: "Golden eval obligation — Run the Redline Comparison Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-redline-comparison-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Redline Comparison Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [redline-comparison-agent-end-to-end](/tests/redline-comparison-agent-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_microsoft_word_microsoft_word_records](/tools/query-microsoft-word-microsoft-word-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_redline_comparison_agent_policy_guide](/tools/lookup-redline-comparison-agent-policy-guide.md)

## Entities that must be referenced

- contracts
- contracts
- microsoft_word_records
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [redline-comparison-agent-policy-guide](/documents/redline-comparison-agent-policy-guide.md)
