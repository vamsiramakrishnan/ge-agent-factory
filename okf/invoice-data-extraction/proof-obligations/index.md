---
type: Index
title: Proof Obligations
description: Assertions the bundle must prove through evidence requirements and golden evals.
timestamp: "2026-07-01T00:00:00.000Z"
---

# Proof Obligations

- [Evidence obligation — OCR extraction confidence is sufficient for posting](/proof-obligations/evidence-ocr-extraction-confidence-is-sufficient-for-posting.md)
- [Evidence obligation — Vendor identity has been resolved and validated](/proof-obligations/evidence-vendor-identity-has-been-resolved-and-validated.md)
- [Evidence obligation — Invoice has been posted to ERP](/proof-obligations/evidence-invoice-has-been-posted-to-erp.md)
- [Evidence obligation — Extraction used LLM fallback for non-standard format](/proof-obligations/evidence-extraction-used-llm-fallback-for-non-standard-format.md)
- [Golden eval obligation — Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/proof-obligations/eval-clean-ocr-happy-path.md)
- [Golden eval obligation — Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/proof-obligations/eval-handwritten-llm-fallback.md)
- [Golden eval obligation — Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.](/proof-obligations/eval-vendor-alias-resolution.md)
