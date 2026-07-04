---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Extract intercompany balances across all entities. Reconcile offsetting positions and identify timing differences. Group by currency pair and transaction type (management fees, royalties, trade).](/queries/ic-balance-aggregation.md)
- [Optimize netting to minimize the number of settlements and FX conversion costs. Sequence settlements to reduce peak funding requirements. Calculate net positions after offsetting across the entity network.](/queries/multi-currency-netting.md)
- [Gemini interprets exceptions: 'Entity Japan owes Entity US $2M but has 10% withholding tax on management fees -- net payment at $1.8M and book $200K withholding.' Handles treaty rate applications and regulatory restrictions on cross-border netting.](/queries/regulatory-exception-handling.md)
- [Execute approved settlements through treasury management system. Post netting entries and withholding tax accruals in each entity's books.](/queries/settlement-posting.md)
