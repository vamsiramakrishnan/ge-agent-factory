---
type: Workflow Stage
title: "Settlement & Posting"
description: "Execute approved settlements through treasury management system. Post netting entries and withholding tax accruals in each entity's books."
source_id: settlement_posting
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Settlement & Posting

Execute approved settlements through treasury management system. Post netting entries and withholding tax accruals in each entity's books.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)
