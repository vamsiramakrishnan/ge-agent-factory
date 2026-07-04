---
type: Evals
title: Golden Evals
timestamp: "2026-07-01T00:00:00.000Z"
---

# Golden Evals

### Eval 1
- **Prompt:** Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.

### Eval 2
- **Prompt:** Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.

### Eval 3
- **Prompt:** Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.
