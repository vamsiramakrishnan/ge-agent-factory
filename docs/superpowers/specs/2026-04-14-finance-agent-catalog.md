# Finance AI Agent Catalog — Gemini Enterprise Field Kit

**Department:** Finance
**Total Agents:** 68 across 9 domains
**Approach:** Domain-native structure sequenced along the finance value chain (Plan → Record → Pay → Collect → Manage → Comply → Assure → Measure → Analyze)

---

## Domain Structure Overview

| # | Domain | Value-Chain Stage | Owner Persona | Agent Count |
|---|--------|-------------------|---------------|-------------|
| **F1** | Financial Planning & Analysis | PLAN | FP&A Director / CFO | 9 |
| **F2** | General Ledger & Close | RECORD | Controller / GL Accountant | 8 |
| **F3** | Accounts Payable | PAY | AP Manager | 7 |
| **F4** | Accounts Receivable & Collections | COLLECT | AR Manager | 7 |
| **F5** | Treasury & Cash Management | MANAGE | Treasurer | 7 |
| **F6** | Tax & Regulatory Compliance | COMPLY | Tax Director / Controller | 8 |
| **F7** | Internal Audit & Controls | ASSURE | Chief Audit Executive | 7 |
| **F8** | Revenue & Cost Accounting | MEASURE | Controller / Cost Accountant | 7 |
| **F9** | Finance Analytics & Reporting | ANALYZE | Financial Reporting Mgr / CFO | 8 |

---

## F1: Financial Planning & Analysis (9 Agents)

### F1-01: Budget Builder & Consolidation
- **Systems:** Anaplan, SAP BPC, Workday Adaptive, BigQuery, Vertex AI
- **Trigger:** Scheduled (annual/quarterly budget cycle)
- **HITL:** CFO approval
- **Integration & Orchestration:** Pull actuals from ERP, distribute budget templates, consolidate submissions across BUs, route for approval
- **Traditional ML / Analytics:** Time-series baseline from historical spend, departmental growth rate modeling, variance-to-prior analysis
- **LLM Reasoning:** Read narrative budget justifications from BU leaders ("we need 3 more headcount for the Q3 product launch") and assess reasonableness against historical patterns and strategic priorities. Synthesize 20+ BU submissions into a coherent CFO-ready budget narrative.

### F1-02: Rolling Forecast Engine
- **Systems:** Anaplan, SAP S/4HANA FI/CO, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Pull month-end actuals, refresh forecast models, distribute updated projections
- **Traditional ML / Analytics:** Time-series forecasting with Prophet/ARIMA on revenue and expense lines, seasonal decomposition, trend extrapolation with confidence intervals
- **LLM Reasoning:** Interpret qualitative signals — earnings call commentary, pipeline updates, macroeconomic shifts — and adjust forecast assumptions. Generate forecast commentary: "Revenue forecast revised down 3% due to delayed enterprise deal cycle, partially offset by stronger SMB growth."

### F1-03: Variance Analysis Agent
- **Systems:** SAP S/4HANA FI/CO, Anaplan, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (monthly close)
- **Integration & Orchestration:** Pull budget vs. actual data from ERP, calculate variances by cost center/GL account, refresh dashboards
- **Traditional ML / Analytics:** Statistical significance testing on variances, trend detection, threshold-based alerting, Pareto analysis of largest variances
- **LLM Reasoning:** Investigate root causes behind significant variances by cross-referencing with operational data. "Marketing is $400K over budget — driven by an unplanned brand campaign approved by the CMO in March, not a systematic overspend. Recommend adjusting the forecast, not cutting Q4 budget."

### F1-04: Scenario Modeling & Sensitivity
- **Systems:** Anaplan, BigQuery, Vertex AI
- **Trigger:** Chat + Event (strategic decision point)
- **Integration & Orchestration:** Pull baseline from planning system, run simulation engine, deliver scenario comparison
- **Traditional ML / Analytics:** Monte Carlo simulation, sensitivity analysis on key drivers (revenue growth, headcount, FX rates, commodity prices), probability-weighted outcome modeling
- **LLM Reasoning:** Translate natural-language what-if questions ("what happens if we delay the factory expansion by 6 months?") into simulation parameters. Interpret results and generate strategic recommendations with trade-offs.

### F1-05: Capital Expenditure Analyzer
- **Systems:** SAP S/4HANA (asset accounting), Anaplan, BigQuery, Vertex AI
- **Trigger:** Event (CapEx request submitted)
- **HITL:** CFO + VP Finance approval
- **Integration & Orchestration:** Receive CapEx request, pull comparable past projects, route for approval with analysis
- **Traditional ML / Analytics:** NPV/IRR/payback period calculation, depreciation schedule modeling, comparison against hurdle rates
- **LLM Reasoning:** Read project justification narratives and assess strategic alignment. Compare against similar past investments and their actual ROI. Generate investment memo: "The $5M data center upgrade has a 3.2-year payback — comparable to our 2024 cloud migration which achieved 2.8 years. Key risk: technology obsolescence if cloud-first strategy accelerates."

### F1-06: Headcount Planning Agent
- **Systems:** Workday, Anaplan, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly planning cycle)
- **Integration & Orchestration:** Pull current headcount from HRIS, open req data, compensation benchmarks, merge with financial plan
- **Traditional ML / Analytics:** Fully-loaded cost modeling (salary + benefits + overhead), attrition forecasting, hiring ramp modeling
- **LLM Reasoning:** Interpret hiring justifications ("need a senior data engineer to unblock the ML pipeline project") and assess against budget constraints and strategic priorities. Flag misalignment: "Engineering wants 15 new hires but the revenue forecast only supports 10 — recommend prioritizing the 6 tied to committed customer deliverables."

### F1-07: Revenue Forecasting
- **Systems:** Salesforce CRM, SAP S/4HANA SD, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly/monthly)
- **Integration & Orchestration:** Pull pipeline data from CRM, historical win rates, booking trends, deliver forecast
- **Traditional ML / Analytics:** Pipeline-weighted forecasting, win rate regression by deal size/stage/segment, cohort analysis, seasonal adjustment
- **LLM Reasoning:** Read deal notes and sales commentary to assess pipeline quality beyond stage percentages. "The $2M Acme deal has been at 'negotiation' for 90 days with no activity — downgrade from 70% to 30% probability despite stage weighting." Generate forecast narrative for earnings prep.

### F1-08: Board Deck Generator
- **Systems:** BigQuery, Looker, Google Slides, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **HITL:** CFO review
- **Integration & Orchestration:** Pull KPIs, financial statements, and strategic metrics from data warehouse, format into slides
- **Traditional ML / Analytics:** Trend calculations, YoY/QoQ comparisons, benchmark gap analysis
- **LLM Reasoning:** Transform raw financial data into board-ready narrative. Frame the same numbers differently for audit committee (risk-focused) vs. full board (strategy-focused). Generate management discussion: "Revenue grew 8% YoY driven by enterprise expansion, but gross margin compressed 150bps due to cloud infrastructure investment — expected to normalize by Q3 as scale efficiencies materialize."

### F1-09: FP&A Query Assistant
- **Systems:** BigQuery, Looker, Anaplan, Vertex AI
- **Trigger:** Chat
- **Integration & Orchestration:** Route queries to appropriate data source, return results with context
- **Traditional ML / Analytics:** Natural language to SQL translation, result caching, query optimization
- **LLM Reasoning:** Interpret ambiguous finance questions ("how are we tracking against plan?") and determine which metrics, time period, and granularity the user needs. Provide answers with context: "Q2 revenue is $48.2M vs. plan of $50M — the $1.8M shortfall is concentrated in EMEA enterprise, which is tracking 15% below due to 3 delayed deals now expected in Q3."

---

## F2: General Ledger & Close (8 Agents)

### F2-01: Journal Entry Auto-Posting
- **Systems:** SAP S/4HANA FI, Oracle Financials, BlackLine, Vertex AI
- **Trigger:** Event (source transaction)
- **Integration & Orchestration:** Receive transactions from sub-ledgers, apply posting rules, create JE in ERP
- **Traditional ML / Analytics:** Pattern matching for recurring entries, auto-classification of GL accounts, anomaly detection on unusual postings
- **LLM Reasoning:** Handle non-standard transactions that don't match posting rules. "This $250K payment to a new vendor has no PO — read the approval email: it's a one-time consulting engagement approved by the VP of Strategy. Post to professional services, not COGS."

### F2-02: Intercompany Reconciliation
- **Systems:** SAP S/4HANA FI, BlackLine, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Extract IC balances across entities, match transactions, identify discrepancies, route for resolution
- **Traditional ML / Analytics:** Fuzzy matching on IC transactions across entities/currencies, threshold-based exception flagging, aging analysis on unresolved items
- **LLM Reasoning:** Investigate mismatches that aren't simple timing differences. "Entity A booked a $1.2M management fee but Entity B only shows $900K — the $300K delta maps to a Q2 amendment that Entity B hasn't processed. Generate the correcting entry and notify the Entity B controller."

### F2-03: Account Reconciliation Agent
- **Systems:** BlackLine, SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly close)
- **HITL:** Controller review (material accounts)
- **Integration & Orchestration:** Pull GL balances and sub-ledger details, match against supporting documentation, generate reconciliation workpapers
- **Traditional ML / Analytics:** Auto-matching of transactions, balance sheet substantiation scoring, risk-based prioritization of accounts to reconcile
- **LLM Reasoning:** For complex reconciliations (prepaid expenses, accrued liabilities), read supporting contracts and invoices to validate balances. "The $3.4M prepaid software balance includes a 3-year Oracle license — $1.13M should have been amortized this year but only $850K was. Generate the catch-up entry."

### F2-04: Close Checklist Orchestrator
- **Systems:** BlackLine, SAP S/4HANA, ServiceNow, Slack, Email
- **Trigger:** Scheduled (monthly/quarterly close)
- **Integration & Orchestration:** This agent is primarily orchestration. Manage 60+ close tasks across 15+ team members: assign tasks, track completion, enforce dependencies, send reminders, escalate delays.
- **Traditional ML / Analytics:** Close cycle time trending, bottleneck identification, task completion prediction based on historical patterns
- **LLM Reasoning:** Interpret status updates in natural language: "John says the inventory reconciliation is 'mostly done but waiting on warehouse counts'" and assess whether the close timeline is at risk. Generate daily close status summaries for the Controller.

### F2-05: Accruals & Deferrals Engine
- **Systems:** SAP S/4HANA FI, BlackLine, BigQuery, Vertex AI
- **Trigger:** Scheduled (month-end)
- **Integration & Orchestration:** Identify transactions requiring accrual/deferral, calculate amounts, post entries, reverse in subsequent period
- **Traditional ML / Analytics:** Pattern recognition on recurring accruals, historical accuracy tracking, estimation modeling for uninvoiced receipts
- **LLM Reasoning:** Read contracts and POs to determine accrual amounts when invoices haven't arrived. "We received goods on the 28th per the ASN but the invoice won't arrive until next month — accrue $340K based on the PO price, adjusted for the 2% early payment discount per contract terms."

### F2-06: Trial Balance Validator
- **Systems:** SAP S/4HANA FI, BlackLine, BigQuery
- **Trigger:** Scheduled (pre-close)
- **Integration & Orchestration:** Extract trial balance, run validation checks, flag exceptions, deliver report
- **Traditional ML / Analytics:** Anomaly detection on account balances (unusual balances, sign changes, large period-over-period movements), cross-validation against sub-ledgers
- **LLM Reasoning:** Limited LLM — primarily analytics-driven. LLM value in generating exception narratives: "Cash account shows a $5M increase — driven by a large customer payment received on the 30th that hasn't been applied to AR yet. Expected to clear in Day 1 of next month."

### F2-07: Month-End Close Analytics
- **Systems:** BlackLine, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (post-close)
- **Integration & Orchestration:** Aggregate close metrics, refresh dashboards, distribute close report
- **Traditional ML / Analytics:** Close cycle time tracking, task-level performance analysis, bottleneck identification, trend analysis vs. target days
- **LLM Reasoning:** Generate close retrospective narrative: "This month's close took 6.2 days vs. 5-day target — the delay was caused by a late inventory adjustment from Plant C. Recommendation: move the Plant C cut-off to Day -1 to avoid recurrence."

### F2-08: GL Anomaly Detector
- **Systems:** SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily/continuous)
- **Integration & Orchestration:** Scan GL postings, flag anomalies, route to appropriate reviewers
- **Traditional ML / Analytics:** Statistical anomaly detection on posting amounts, timing, account combinations; Benford's Law analysis on transaction distributions; duplicate detection
- **LLM Reasoning:** Investigate flagged anomalies by reading transaction context. "A $500K debit to 'Miscellaneous Expense' is unusual — the memo says 'write-off per CFO approval' but there's no documented approval in the system. Escalate to Internal Audit."

---

## F3: Accounts Payable (7 Agents)

### F3-01: Invoice Processing & Matching
- **Systems:** SAP S/4HANA (MIRO), Coupa, Basware, Google Document AI, Vertex AI
- **Trigger:** Event (invoice received)
- **Integration & Orchestration:** Ingest invoice, extract data via OCR, match against PO and GR, post or route exceptions
- **Traditional ML / Analytics:** OCR field extraction, confidence scoring, fuzzy matching (PO vs. invoice vs. GR), auto-resolution of common tolerances
- **LLM Reasoning:** Handle non-standard invoices: handwritten, multi-currency, partial deliveries. Interpret invoice line items that don't match PO descriptions. "Invoice says 'professional services — phase 2' but the PO has 'consulting — project alpha phase 2.' These are the same engagement."

### F3-02: Vendor Payment Optimizer
- **Systems:** SAP S/4HANA FI (F110), Kyriba, Taulia, BigQuery
- **Trigger:** Scheduled (pre-payment run)
- **HITL:** Treasury review
- **Integration & Orchestration:** Pull pending payments, optimize timing against cash position, apply dynamic discounting logic, submit batch
- **Traditional ML / Analytics:** Working capital optimization (DPO vs. discount APR), cash flow impact modeling, supplier payment term segmentation
- **LLM Reasoning:** Interpret edge cases: "This vendor offers 2/10 Net 30 but also participates in our supply chain finance program at LIBOR+150bps — which is more cost-effective given our current cost of capital?" Generate treasury briefing.

### F3-03: Duplicate Invoice Detector
- **Systems:** SAP S/4HANA FI, Coupa, BigQuery
- **Trigger:** Scheduled (pre-payment run)
- **HITL:** AP Manager
- **Integration & Orchestration:** Scan pending invoices for duplicates across entities and time windows, hold flagged items
- **Traditional ML / Analytics:** ML clustering on invoice features (amount, date, vendor, invoice number patterns), fuzzy matching, statistical duplicate probability scoring
- **LLM Reasoning:** Distinguish true duplicates from legitimate similar invoices. "Two invoices from Supplier X for $47,500 one week apart — read the line items: one is for January maintenance, the other for February. Legitimate, not duplicate."

### F3-04: AP Aging Analyzer
- **Systems:** SAP S/4HANA FI, BigQuery, Looker
- **Trigger:** Scheduled (weekly)
- **Integration & Orchestration:** Extract AP aging data, calculate metrics, refresh dashboards
- **Traditional ML / Analytics:** Aging bucket analysis, DPO trending, vendor concentration, cash requirement forecasting
- **LLM Reasoning:** Generate AP narrative for cash management: "AP over 90 days increased 40% — driven by 3 disputed invoices totaling $2.1M. The disputes are with Supplier Y over quality issues; resolution expected by month-end per the procurement team's latest update."

### F3-05: Vendor Master Data Manager
- **Systems:** SAP S/4HANA (vendor master), Coupa, D&B, IRS TIN matching
- **Trigger:** Event (new vendor request / periodic review)
- **Integration & Orchestration:** Validate vendor data, check for duplicates, verify banking details, maintain master records
- **Traditional ML / Analytics:** Duplicate vendor detection, data quality scoring, dormant vendor identification
- **LLM Reasoning:** Resolve vendor identity ambiguity. "Is 'Acme Corp' at 123 Main St the same as 'Acme Industries LLC' at 125 Main St? Different TIN, same bank account — flag for manual review. Possible name change or related entity."

### F3-06: Early Payment Discount Agent
- **Systems:** SAP S/4HANA FI, Taulia, C2FO, BigQuery
- **Trigger:** Scheduled (daily)
- **Integration & Orchestration:** Identify invoices eligible for early payment discounts, calculate net benefit, recommend or auto-execute
- **Traditional ML / Analytics:** Discount APR calculation, comparison against company cost of capital, cash availability check, supplier prioritization
- **LLM Reasoning:** Limited core LLM. Value in generating opportunity reports: "You have $4.2M in eligible early payment discounts this week representing an annualized return of 18.2% — well above your 6% WACC. Recommend taking all discounts above the 10% APR threshold."

### F3-07: AP Policy Compliance Monitor
- **Systems:** SAP S/4HANA FI, Coupa, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Integration & Orchestration:** Scan transactions for policy violations, generate exception reports, route to managers
- **Traditional ML / Analytics:** Rule-based compliance checks, trend analysis on violation types, department-level compliance scoring
- **LLM Reasoning:** Interpret borderline cases: "A $9,800 purchase was split into two $4,900 POs to stay under the $5,000 approval threshold — the same vendor, same day, same requestor. Flag as potential split-purchasing violation."

---

## F4: Accounts Receivable & Collections (7 Agents)

### F4-01: Cash Application Agent
- **Systems:** HighRadius, SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Event (payment received)
- **Integration & Orchestration:** Ingest bank remittance data, match payments to invoices, post to AR, route exceptions
- **Traditional ML / Analytics:** ML matching of payments to invoices (amount, customer, reference patterns), confidence scoring, auto-post above threshold
- **LLM Reasoning:** Resolve ambiguous remittances: "Customer paid $147,320 but open invoices total $152,800. The remittance advice references 'less 3.5% quality credit per agreement with Jim' — read the customer agreement to validate the deduction and apply automatically."

### F4-02: Collections Priority Engine
- **Systems:** HighRadius, SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily)
- **Integration & Orchestration:** Score outstanding receivables, generate prioritized worklist, assign to collectors
- **Traditional ML / Analytics:** Payment behavior scoring, aging-weighted priority model, collection probability prediction, segment-based strategy assignment
- **LLM Reasoning:** Interpret customer context beyond numbers: "This $500K receivable is 45 days past due from a Fortune 500 customer — but they just announced a CFO transition and AP processing delays. Recommend a courtesy call rather than formal collection action."

### F4-03: Dunning Communication Drafter
- **Systems:** SAP S/4HANA FI, Email, Vertex AI
- **Trigger:** Event (dunning milestone)
- **Integration & Orchestration:** Identify accounts hitting dunning thresholds, generate and send communications
- **Traditional ML / Analytics:** Dunning level determination, payment prediction, optimal timing analysis
- **LLM Reasoning:** Draft context-appropriate dunning communications. A first reminder to a long-term customer reads differently than a final notice to a high-risk account. Adapt tone, urgency, and escalation path based on relationship history and payment patterns.

### F4-04: Credit Risk Scorer
- **Systems:** D&B, Moody's, SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Event (new customer / credit review)
- **HITL:** Credit Manager
- **Integration & Orchestration:** Pull financial data from credit bureaus, internal payment history, aggregate into credit assessment
- **Traditional ML / Analytics:** Predictive credit scoring model, payment behavior analysis, industry risk adjustment, credit limit recommendation
- **LLM Reasoning:** Read financial filings and news signals to assess credit risk beyond scores. "D&B score is stable at 75 but the company just announced a major restructuring and the CFO departed — recommend reducing credit limit from $2M to $500K pending stabilization."

### F4-05: AR Aging & DSO Analyzer
- **Systems:** SAP S/4HANA FI, BigQuery, Looker
- **Trigger:** Scheduled (weekly)
- **Integration & Orchestration:** Extract AR aging data, calculate DSO metrics by segment/region/customer, refresh dashboards
- **Traditional ML / Analytics:** DSO trending, aging migration analysis, bad debt provision modeling, segment-level collection rate analysis
- **LLM Reasoning:** Generate AR narrative: "DSO increased 5 days to 48 — driven entirely by 2 large government contracts with 60-day payment terms. Excluding government, commercial DSO improved by 2 days. Recommend tracking government and commercial DSO separately."

### F4-06: Dispute Resolution Agent
- **Systems:** SAP S/4HANA FI, HighRadius, Salesforce, Vertex AI
- **Trigger:** Event (dispute raised)
- **Integration & Orchestration:** Log dispute, categorize type, route to responsible team, track resolution, adjust AR
- **Traditional ML / Analytics:** Dispute categorization, root cause clustering, resolution time prediction, trend analysis
- **LLM Reasoning:** Read dispute details and cross-reference with delivery records, contracts, and customer communications. "Customer disputes $45K citing 'wrong specifications' — compare PO specs against delivery docs. The specs match but the customer's requirements changed after PO issuance. Recommend partial credit with documented spec change."

### F4-07: Customer Payment Predictor
- **Systems:** SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **Integration & Orchestration:** Score all open receivables for payment probability, feed into cash flow forecast
- **Traditional ML / Analytics:** ML model trained on historical payment patterns (customer, amount, day-of-week, industry, economic cycle), payment date prediction with confidence intervals
- **LLM Reasoning:** Interpret signals that models can't capture: "This customer's payment pattern changed from Net 15 to Net 45 starting last quarter — correlates with their announced ERP migration. Expected to normalize post-migration in Q3."

---

## F5: Treasury & Cash Management (7 Agents)

### F5-01: Cash Flow Forecaster
- **Systems:** Kyriba, SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily/weekly)
- **Integration & Orchestration:** Aggregate cash positions across bank accounts, pull AR/AP projections, deliver consolidated forecast
- **Traditional ML / Analytics:** Multi-horizon cash flow forecasting (daily/weekly/monthly), seasonal pattern recognition, variance-to-forecast tracking
- **LLM Reasoning:** Incorporate qualitative signals into cash forecast: "The sales team just closed a $5M deal with 50% upfront payment — adjust next week's inflow projection. Also, the supply chain team flagged a $2M expedite fee for delayed components — add to next month's outflows."

### F5-02: Bank Reconciliation Agent
- **Systems:** Kyriba, SAP S/4HANA FI, Bank portals, Vertex AI
- **Trigger:** Scheduled (daily)
- **Integration & Orchestration:** Pull bank statements via MT940/BAI2, match against GL postings, identify exceptions, post clearing entries
- **Traditional ML / Analytics:** Auto-matching on amount/date/reference, exception categorization, timing difference identification
- **LLM Reasoning:** Investigate unmatched items: "A $125K debit from Bank of America doesn't match any GL posting — the bank description says 'WIRE OUT REF: LEGAL SETTLEMENT.' Check legal department's payment records — this was likely an ad-hoc wire for the Johnson litigation settlement authorized by the GC."

### F5-03: FX Exposure Monitor
- **Systems:** Kyriba, Bloomberg/Reuters, SAP S/4HANA, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily) + Event (rate threshold breach)
- **Integration & Orchestration:** Aggregate FX exposures across entities, pull market rates, calculate VaR, alert on threshold breaches
- **Traditional ML / Analytics:** FX exposure netting, VaR modeling, hedge effectiveness measurement, scenario analysis across currency pairs
- **LLM Reasoning:** Interpret market-moving events: "EUR/USD dropped 2% following the ECB rate decision — your net EUR exposure of $45M means a potential $900K P&L impact. Recommend reviewing the hedge ratio and consider increasing EUR forward cover for Q3 payables."

### F5-04: Investment Portfolio Optimizer
- **Systems:** Kyriba, Bloomberg, BigQuery, Vertex AI
- **Trigger:** Scheduled (weekly)
- **HITL:** Treasurer approval
- **Integration & Orchestration:** Pull portfolio positions, market data, cash forecast, deliver rebalancing recommendations
- **Traditional ML / Analytics:** Portfolio optimization (yield vs. liquidity vs. risk), duration matching, credit quality analysis, benchmark comparison
- **LLM Reasoning:** Interpret investment policy constraints against market conditions: "Your policy limits single-issuer exposure to 10% but the new T-bill offering has an attractive 5.2% yield. At current portfolio size, you can allocate $8M without breaching the limit."

### F5-05: Debt Covenant Tracker
- **Systems:** SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Extract financial ratios from GL, compare against covenant thresholds, generate compliance report
- **Traditional ML / Analytics:** Ratio calculation (leverage, interest coverage, current ratio), trend projection, early warning scoring
- **LLM Reasoning:** Read loan agreements to interpret complex covenant calculations: "The credit agreement defines EBITDA as 'net income plus interest, taxes, D&A, plus add-backs for non-recurring charges up to $5M annually.' The $3M restructuring charge qualifies as an add-back, keeping you compliant at 3.2x vs. 3.5x covenant."

### F5-06: Intercompany Netting Agent
- **Systems:** Kyriba, SAP S/4HANA FI, BigQuery
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Calculate net positions across entities, generate settlement instructions, post netting entries
- **Traditional ML / Analytics:** Multi-currency netting optimization, FX impact minimization, settlement sequence optimization
- **LLM Reasoning:** Limited LLM — primarily optimization. Value in interpreting exceptions: "Entity Japan owes Entity US $2M but Entity Japan has a withholding tax obligation of 10% on management fees — net the payment at $1.8M and book the $200K withholding."

### F5-07: Liquidity Dashboard
- **Systems:** Kyriba, BigQuery, Looker
- **Trigger:** Scheduled (real-time/daily)
- **Integration & Orchestration:** Aggregate global cash positions, update dashboards, alert on low-balance conditions
- **Traditional ML / Analytics:** Cash position aggregation, currency conversion, liquidity ratio calculation, trend visualization
- **LLM Reasoning:** Generate daily treasury briefing: "Global cash position is $234M across 45 accounts in 12 currencies. EUR balances are elevated post-quarter — recommend sweeping $15M to the USD concentration account to fund next week's bond payment."

---

## F6: Tax & Regulatory Compliance (8 Agents)

### F6-01: Tax Provision Calculator
- **Systems:** SAP S/4HANA FI, Longview/OneSource, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **HITL:** Tax Director approval
- **Integration & Orchestration:** Extract pre-tax income by jurisdiction, apply tax rates, calculate current and deferred provisions, generate ASC 740 workpapers
- **Traditional ML / Analytics:** Multi-jurisdiction tax rate application, permanent/temporary difference classification, deferred tax asset/liability calculation
- **LLM Reasoning:** Interpret complex tax positions: "The R&D tax credit is $2.4M but $800K relates to the new product line where qualification is uncertain — recommend booking at 75% probability ($600K) per ASC 740-10 and disclosing the uncertain position."

### F6-02: Transfer Pricing Monitor
- **Systems:** SAP S/4HANA FI, BigQuery, OECD databases, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **Integration & Orchestration:** Extract intercompany transactions, compare against arm's length benchmarks, flag out-of-range items
- **Traditional ML / Analytics:** Comparable company analysis, TNMM margin testing, documentation scoring, range compliance tracking
- **LLM Reasoning:** Assess transfer pricing positions against regulatory guidance: "The management fee from US parent to Indian subsidiary is at 8% of revenue — OECD guidelines suggest 3-6% for comparable services. Recommend adjusting to 5.5% and documenting the value-add justification."

### F6-03: Sales & Use Tax Automation
- **Systems:** Avalara, Vertex Tax, SAP S/4HANA SD, BigQuery
- **Trigger:** Event (invoice generated)
- **Integration & Orchestration:** Determine tax jurisdiction, calculate tax, apply exemptions, file returns. Primarily integration + rules engine.
- **Traditional ML / Analytics:** Nexus analysis, exemption certificate validation, rate accuracy monitoring
- **LLM Reasoning:** Handle edge cases: "Customer claims manufacturing exemption in Texas but the product is software delivered electronically — Texas treats SaaS differently from manufactured goods. Apply 6.25% state tax."

### F6-04: Regulatory Filing Orchestrator
- **Systems:** SAP S/4HANA FI, Workiva, SEC EDGAR, Vertex AI
- **Trigger:** Scheduled (quarterly/annual filing deadlines)
- **HITL:** Controller approval
- **Integration & Orchestration:** Track filing calendar, collect data inputs, manage review workflows, validate XBRL tagging, submit filings
- **Traditional ML / Analytics:** Filing timeline tracking, data validation rules, XBRL tag accuracy checking
- **LLM Reasoning:** Review financial statement disclosures for completeness and accuracy: "The contingent liability disclosure references the patent litigation but doesn't mention the range of potential loss as required by ASC 450. Draft the additional disclosure language."

### F6-05: Tax Research Assistant
- **Systems:** CCH AnswerConnect, Bloomberg Tax, Internal tax memos, Vertex AI
- **Trigger:** Chat
- **Integration & Orchestration:** Index tax research databases, route queries
- **Traditional ML / Analytics:** Minimal — query classification
- **LLM Reasoning:** Almost entirely LLM. RAG over tax code, regulations, and internal precedent. "Can we deduct the $3M write-off of the failed product line? Under IRC Section 165, the loss is deductible if the asset is permanently retired and has no salvage value. Our prior memo on the 2023 write-off established the precedent — apply the same treatment."

### F6-06: Withholding Tax Agent
- **Systems:** SAP S/4HANA FI, Tax databases, BigQuery
- **Trigger:** Event (cross-border payment)
- **Integration & Orchestration:** Determine applicable withholding rate based on treaty, apply withholding, generate tax certificates, file reports
- **Traditional ML / Analytics:** Treaty rate lookup, threshold tracking, annual reporting aggregation
- **LLM Reasoning:** Interpret treaty provisions for complex payments: "This royalty payment to a UK entity is subject to 0% withholding under the US-UK treaty Article 12, but only if the beneficial owner is the UK entity itself, not a PE. Verify beneficial ownership before applying treaty rate."

### F6-07: Tax Audit Prep Agent
- **Systems:** SAP S/4HANA FI, Document management, BigQuery, Vertex AI
- **Trigger:** Event (audit notification)
- **Integration & Orchestration:** Collect requested documents, organize by audit topic, prepare response packages
- **Traditional ML / Analytics:** Document retrieval and classification, gap analysis against audit requests
- **LLM Reasoning:** Draft audit responses: "The IRS is questioning the $4.5M R&D credit. Compile all qualifying project documentation, timesheets, and supply contracts. Draft the response citing Reg. 1.41-4(a) with specific project-level nexus to qualified research activities."

### F6-08: Regulatory Change Monitor
- **Systems:** Bloomberg Tax, CCH, Regulatory feeds, Vertex AI
- **Trigger:** Scheduled (continuous) + Event (new regulation)
- **Integration & Orchestration:** Monitor regulatory feeds, alert on relevant changes, distribute to affected teams
- **Traditional ML / Analytics:** Keyword-based regulatory filtering, jurisdiction matching, impact classification
- **LLM Reasoning:** Read new regulations and assess impact on the company: "The new Pillar Two global minimum tax rules require country-by-country effective tax rate calculations starting FY2025. Your 3 entities in Ireland (12.5% rate) will need transition safe harbor analysis — estimate $1.2M annual impact if safe harbor doesn't apply."

---

## F7: Internal Audit & Controls (7 Agents)

### F7-01: SOX Control Testing Agent
- **Systems:** AuditBoard, SAP GRC, SAP S/4HANA, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **HITL:** Internal Audit Lead
- **Integration & Orchestration:** Pull control evidence from systems, execute test procedures, document results, track deficiencies
- **Traditional ML / Analytics:** Sample selection, control effectiveness scoring, deficiency trending, risk-based test prioritization
- **LLM Reasoning:** Evaluate control evidence for sufficiency: "The 'management review' control requires VP sign-off on journal entries over $100K. The sign-off log shows 47 of 50 entries were approved — but 3 lack evidence. Assess whether the 94% rate constitutes an effective control or a deficiency requiring remediation."

### F7-02: Continuous Controls Monitor
- **Systems:** SAP GRC, SAP S/4HANA, BigQuery, Vertex AI
- **Trigger:** Scheduled (daily/continuous)
- **Integration & Orchestration:** Run automated control checks against transaction data, flag violations in real-time, route to owners
- **Traditional ML / Analytics:** Rule-based control monitoring (segregation of duties, authorization limits, access violations), statistical process control on key risk indicators
- **LLM Reasoning:** Interpret violations in context: "User John Smith both created and approved a $75K vendor payment — an SoD violation. But John is the AP Manager and the regular approver was on leave with a documented emergency delegation. Classify as acceptable exception, not a control failure."

### F7-03: Audit Finding Tracker
- **Systems:** AuditBoard, ServiceNow, Vertex AI
- **Trigger:** Event (finding issued)
- **Integration & Orchestration:** Log findings, assign remediation owners, track deadlines, escalate overdue items
- **Traditional ML / Analytics:** Remediation timeline tracking, aging analysis, recurrence pattern detection
- **LLM Reasoning:** Assess remediation responses: "Management's response to the inventory count finding says 'we will implement cycle counting.' Evaluate: does this address the root cause (inadequate year-end count procedures) or just a symptom? Recommend adding specific frequency, coverage targets, and variance thresholds."

### F7-04: Risk Assessment Agent
- **Systems:** AuditBoard, BigQuery, Vertex AI
- **Trigger:** Scheduled (annual/semi-annual)
- **HITL:** CAE approval
- **Integration & Orchestration:** Aggregate risk inputs (survey responses, financial data, operational metrics), generate risk heat map
- **Traditional ML / Analytics:** Risk scoring across likelihood/impact dimensions, correlation analysis, trend comparison, peer benchmarking
- **LLM Reasoning:** Synthesize risk signals from multiple sources: "Financial risk indicators show increasing DSO and declining margins, operational data shows 3 plant safety incidents, and the compliance team reports a pending FCPA investigation. Recommend elevating the enterprise risk rating from 'moderate' to 'elevated' and adding FCPA to the Q3 audit plan."

### F7-05: Policy Compliance Scanner
- **Systems:** SharePoint/Google Drive, SAP S/4HANA, BigQuery, Vertex AI
- **Trigger:** Scheduled (quarterly)
- **Integration & Orchestration:** Scan transactions against policy rules, identify deviations, generate compliance reports
- **Traditional ML / Analytics:** Rule-based scanning (expense limits, approval thresholds, contract requirements), deviation trending
- **LLM Reasoning:** Interpret policy exceptions in context: "35 travel expenses exceeded the $500/night hotel policy — but 28 were in New York City during the industry conference where GSA rates exceed $500. Classify as justified exceptions vs. the 7 that lack conference documentation."

### F7-06: Fraud Detection Engine
- **Systems:** SAP S/4HANA FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (continuous)
- **Integration & Orchestration:** Scan financial transactions across all sub-ledgers, flag suspicious patterns, route to investigators
- **Traditional ML / Analytics:** Benford's Law analysis, behavioral anomaly detection, network analysis (vendor-employee connections), duplicate detection, ghost employee identification
- **LLM Reasoning:** Investigate flagged patterns: "Vendor 'Apex Consulting' shares a bank account with employee Sarah Chen — Apex was created 3 months ago and has received $180K in payments for 'consulting services' with no deliverables documented. Escalate as potential conflict of interest or fictitious vendor scheme."

### F7-07: Audit Report Generator
- **Systems:** AuditBoard, Vertex AI, Google Docs
- **Trigger:** Scheduled (post-audit)
- **HITL:** CAE review
- **Integration & Orchestration:** Compile findings, evidence, and recommendations into formatted report
- **Traditional ML / Analytics:** Finding severity scoring, trend comparison vs. prior audits
- **LLM Reasoning:** Primarily LLM. Draft the audit report narrative: executive summary, scope, findings with root cause analysis, recommendations with implementation timelines. Adapt tone for the audience — audit committee gets risk-focused summary, management gets detailed remediation guidance.

---

## F8: Revenue & Cost Accounting (7 Agents)

### F8-01: Revenue Recognition Engine
- **Systems:** SAP S/4HANA SD/FI, RevPro/Zuora, BigQuery, Vertex AI
- **Trigger:** Event (contract executed / modification)
- **HITL:** Controller review (material contracts)
- **Integration & Orchestration:** Ingest contract data, apply ASC 606 5-step model, calculate revenue schedules, post entries
- **Traditional ML / Analytics:** Contract element identification, standalone selling price estimation, variable consideration constraint modeling
- **LLM Reasoning:** Interpret complex contract terms for revenue recognition: "This $10M contract bundles software license, implementation, and 3 years of support. The implementation has significant customization — is it distinct? Read the SOW: the customization modifies the core product functionality, so implementation is NOT distinct. Allocate on a relative SSP basis as a combined performance obligation."

### F8-02: Cost Allocation Agent
- **Systems:** SAP S/4HANA CO, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Execute cost allocation cycles, distribute shared costs to cost centers/products, post results
- **Traditional ML / Analytics:** Activity-based costing calculations, allocation driver analysis, variance tracking
- **LLM Reasoning:** Interpret allocation disputes: "The product team argues that IT shared services should be allocated by headcount, not revenue, because their team is small but high-revenue. Compare both methods: headcount allocation charges them $400K, revenue allocation charges $1.2M. The cost driver analysis suggests headcount better reflects IT resource consumption — recommend headcount with a documentation memo."

### F8-03: Product Profitability Analyzer
- **Systems:** SAP S/4HANA CO, BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Aggregate revenue and cost data by product/service line, calculate margins, refresh dashboards
- **Traditional ML / Analytics:** Contribution margin analysis, fully-loaded P&L by product, trend decomposition, mix analysis
- **LLM Reasoning:** Generate profitability narrative: "Product C's margin declined from 45% to 38% — root cause: raw material costs increased 12% (nickel surcharge) but pricing wasn't adjusted. Competitor analysis shows peers absorbed similar increases. Recommend a 5% price increase in Q3, expected to recover 60% of the margin compression."

### F8-04: Standard Cost Variance Agent
- **Systems:** SAP S/4HANA CO (PP), BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Calculate material, labor, and overhead variances against standard costs, generate reports
- **Traditional ML / Analytics:** Variance decomposition (price vs. usage vs. efficiency vs. volume), trend analysis, threshold alerting
- **LLM Reasoning:** Investigate significant variances: "Material price variance is $200K unfavorable — driven by a 15% increase in aluminum from a single supplier. Check: is this market-wide (LME shows 8% increase) or supplier-specific? The delta suggests the supplier is charging above market. Recommend sourcing review."

### F8-05: ASC 606 Contract Analyzer
- **Systems:** SAP S/4HANA SD, Contract repository, BigQuery, Vertex AI
- **Trigger:** Event (new contract / modification)
- **Integration & Orchestration:** Extract contract terms, apply 5-step revenue recognition framework, generate accounting memo
- **Traditional ML / Analytics:** Performance obligation identification, variable consideration estimation, constraint assessment
- **LLM Reasoning:** Read complex contract language and determine accounting treatment: "The contract includes a 'most favored nation' clause — if we offer a lower price to another customer, the price retroactively adjusts. This creates variable consideration that must be constrained under ASC 606-10-32-11. Estimate the constraint using the 'most likely amount' method."

### F8-06: Inventory Valuation Agent
- **Systems:** SAP S/4HANA MM/FI, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly/quarterly)
- **Integration & Orchestration:** Pull inventory balances, apply valuation methods (FIFO/weighted average), assess for impairment, post adjustments
- **Traditional ML / Analytics:** Slow-moving and obsolete (SLOB) identification, NRV calculation, reserve modeling, aging analysis
- **LLM Reasoning:** Assess inventory write-down candidates: "Raw material lot #4521 has been in stock for 18 months with no consumption. Read production plans: the associated product line was discontinued in Q2. The $340K carrying value should be written down to scrap value of $15K. Generate the write-down memo with supporting documentation."

### F8-07: COGS Reconciliation Agent
- **Systems:** SAP S/4HANA CO/FI, BigQuery
- **Trigger:** Scheduled (monthly close)
- **Integration & Orchestration:** Reconcile COGS between cost accounting and financial accounting, identify and resolve discrepancies
- **Traditional ML / Analytics:** Variance analysis between CO and FI postings, timing difference identification, systematic vs. one-time discrepancy classification
- **LLM Reasoning:** Investigate reconciliation breaks: "COGS in FI is $500K higher than CO — trace the difference: a manual reclassification entry posted to COGS that should have been R&D expense. Generate the correcting entry."

---

## F9: Finance Analytics & Reporting (8 Agents)

### F9-01: Financial Statement Generator
- **Systems:** SAP S/4HANA FI, Workiva, BigQuery, Vertex AI
- **Trigger:** Scheduled (monthly/quarterly)
- **Integration & Orchestration:** Extract trial balance, apply financial statement mapping, generate income statement, balance sheet, cash flow statement, deliver formatted output
- **Traditional ML / Analytics:** Statement mapping rules, rounding reconciliation, period-over-period calculation
- **LLM Reasoning:** Generate management discussion narrative for each statement line: "Revenue increased 12% to $156M driven by 3 new enterprise customers (contribution: $18M). Operating expenses grew 8%, resulting in operating leverage improvement of 400bps."

### F9-02: Management Reporting Agent
- **Systems:** BigQuery, Looker, Google Slides, Vertex AI
- **Trigger:** Scheduled (monthly)
- **Integration & Orchestration:** Pull operational and financial KPIs, format into management reports, distribute to leadership
- **Traditional ML / Analytics:** KPI calculation, trend visualization, traffic-light status indicators, drill-down analytics
- **LLM Reasoning:** Tailor reports to audience: "The CEO gets a one-page strategic summary with 5 key metrics and commentary. The COO gets operational detail by business unit. The CFO gets the full financial package. Generate all three from the same data set with audience-appropriate framing."

### F9-03: KPI Dashboard Builder
- **Systems:** BigQuery, Looker, Vertex AI
- **Trigger:** Scheduled (real-time/daily refresh)
- **Integration & Orchestration:** Maintain data pipelines, refresh dashboards, alert on KPI threshold breaches
- **Traditional ML / Analytics:** KPI calculation engine, automated alerting, anomaly detection on metric movements
- **LLM Reasoning:** Generate narrative commentary for dashboard highlights: "Cash conversion cycle improved 3 days to 42 — driven by DSO improvement from the new collections strategy. However, DPO also decreased 2 days due to increased early payment discounts — net working capital impact is positive."

### F9-04: Ad-Hoc Query Agent
- **Systems:** BigQuery, Looker, SAP S/4HANA, Vertex AI
- **Trigger:** Chat
- **Integration & Orchestration:** Route queries to appropriate data source, execute, return results
- **Traditional ML / Analytics:** NL-to-SQL translation, query optimization, result caching
- **LLM Reasoning:** Interpret ambiguous requests: "Show me where we're bleeding money" translates to: identify cost centers with actual > budget variance > 10%, sorted by absolute dollar impact, for the current quarter. Present results with context: "The top 3 overspends are all in the new product launch — $2.1M combined, of which $1.4M was pre-approved by the CFO."

### F9-05: Peer Benchmarking Agent
- **Systems:** S&P Capital IQ, Bloomberg, SEC filings, BigQuery, Vertex AI
- **Trigger:** Chat + Scheduled (quarterly)
- **Integration & Orchestration:** Pull peer financial data, calculate comparison metrics, deliver benchmarking analysis
- **Traditional ML / Analytics:** Peer group construction, ratio calculation, percentile ranking, trend comparison
- **LLM Reasoning:** Contextualize benchmarks: "Your gross margin of 62% is at the 75th percentile vs. SaaS peers — but your R&D spend at 28% of revenue is at the 90th percentile. Peers at similar margin invest 22-25%. The delta suggests either over-investment or a more complex product requiring higher R&D. Compare product complexity metrics to validate."

### F9-06: Consolidation & Elimination Agent
- **Systems:** SAP S/4HANA FI (consolidation), BlackLine, BigQuery
- **Trigger:** Scheduled (monthly/quarterly close)
- **Integration & Orchestration:** Collect entity-level financials, apply currency translation, eliminate intercompany transactions, produce consolidated statements
- **Traditional ML / Analytics:** Currency translation (current rate, temporal, average), IC elimination matching, minority interest calculation
- **LLM Reasoning:** Handle complex consolidation scenarios: "The newly acquired subsidiary uses different accounting policies for inventory (LIFO vs. our FIFO). Calculate the conforming adjustment: $2.3M LIFO reserve reversal that increases inventory and decreases COGS on a consolidated basis."

### F9-07: ESG & Sustainability Reporter
- **Systems:** Workiva, CDP, GRI databases, BigQuery, Vertex AI
- **Trigger:** Scheduled (annual)
- **HITL:** CFO + Sustainability Officer
- **Integration & Orchestration:** Collect ESG data across operations, validate metrics, format into reporting frameworks (GRI, SASB, TCFD)
- **Traditional ML / Analytics:** Carbon emissions calculation, energy intensity metrics, social impact scoring, year-over-year comparison
- **LLM Reasoning:** Draft ESG narratives that meet disclosure requirements: "Scope 1+2 emissions decreased 8% YoY but Scope 3 increased 12% due to supply chain growth. Draft the TCFD climate risk disclosure explaining the strategy to address Scope 3 through supplier engagement programs."

### F9-08: Investor Relations Prep Agent
- **Systems:** Bloomberg, S&P Capital IQ, BigQuery, Google Slides, Vertex AI
- **Trigger:** Scheduled (quarterly earnings)
- **HITL:** CFO review
- **Integration & Orchestration:** Compile financial results, peer data, analyst estimates, prepare Q&A, generate presentation
- **Traditional ML / Analytics:** Consensus estimate comparison, variance analysis, peer performance ranking
- **LLM Reasoning:** Anticipate analyst questions: "Given the 3% revenue miss, analysts will likely ask about pipeline health and guidance revision. Prepare talking points: pipeline is $150M (up 20%), the miss was timing-driven (3 deals slipped to Q3), and guidance is maintained based on Q3 pipeline conversion confidence."

---

## Finance Personas (12)

| # | Persona | Domains | Day-to-Day Focus |
|---|---------|---------|------------------|
| 1 | **Chief Financial Officer (CFO)** | F1, F5, F9 | Strategy, board reporting, investor relations, M&A, capital allocation |
| 2 | **VP Finance / Controller** | F1, F2, F8, F9 | Close oversight, financial reporting accuracy, policy, ASC compliance |
| 3 | **FP&A Director** | F1 | Budget, forecast, variance analysis, strategic planning, business partnering |
| 4 | **FP&A Analyst** | F1, F9 | Model building, data analysis, scenario modeling, ad-hoc requests |
| 5 | **AP Manager** | F3 | Invoice processing, vendor payments, compliance, working capital |
| 6 | **AR Manager** | F4 | Collections, cash application, credit risk, dispute resolution |
| 7 | **Treasurer** | F5 | Cash management, FX, investments, banking relationships, debt |
| 8 | **Tax Director** | F6 | Provision, transfer pricing, compliance, audit defense, planning |
| 9 | **Chief Audit Executive (CAE)** | F7 | Audit planning, SOX, risk assessment, fraud, reporting to audit committee |
| 10 | **Cost Accountant** | F8 | Standard costing, variances, product profitability, inventory valuation |
| 11 | **Financial Reporting Manager** | F9 | Consolidation, external reporting, XBRL, management reporting |
| 12 | **GL Accountant** | F2 | Journal entries, reconciliations, close tasks, intercompany |

---

## Day-in-the-Life (3 Featured Personas)

### FP&A Analyst (Analytical Lens)
| Time | Current Reality | With Agents |
|------|-----------------|-------------|
| 8:00 | Downloading actuals from SAP into Excel, manually mapping GL accounts to budget categories | Rolling Forecast Engine auto-refreshed overnight; Variance Analysis Agent flagged 5 items needing attention |
| 9:00 | Building a variance bridge in PowerPoint — manually calculating budget vs. actual by department | Variance Analysis Agent already generated the bridge with root cause narratives per department |
| 10:00 | Running 3 revenue forecast scenarios by manually adjusting cells in a 50-tab Excel model | Scenario Modeling Agent runs Monte Carlo across 20+ variables in minutes with probability distributions |
| 11:00 | Fielding Slack messages: "how much did Marketing spend last month?" — querying SAP manually | FP&A Query Assistant answers natural language questions with context and citations instantly |
| 1:00 | Preparing the CFO's board deck — copy-pasting charts from Looker into Google Slides | Board Deck Generator assembled the full deck with management discussion narrative from the data |
| 2:30 | Modeling a CapEx request — building NPV/IRR analysis from scratch for a $5M project | CapEx Analyzer auto-calculated NPV/IRR with sensitivity analysis and comparable historical projects |
| 4:00 | Reconciling headcount plan to budget — cross-referencing Workday data with Anaplan model | Headcount Planning Agent synced HRIS data with financial plan and flagged 6 misalignments |

### AP Manager (Operational Lens)
| Time | Current Reality | With Agents |
|------|-----------------|-------------|
| 8:00 | Processing 120 invoices from overnight email — manually keying data from PDFs into SAP | Invoice Processing Agent auto-extracted and matched 95 invoices; surfaced 25 exceptions for review |
| 9:00 | Investigating 15 three-way match exceptions — PO vs. invoice vs. goods receipt mismatches | Matching Agent auto-resolved 11 (tolerance, rounding); escalated 4 genuine issues with context |
| 10:00 | Checking for duplicate invoices before the payment run — running a report and scanning manually | Duplicate Detector already flagged 3 potential duplicates with explanations for each |
| 11:00 | Running the payment file — manually optimizing which invoices to pay based on cash position | Payment Optimizer recommended paying $4.2M in early-discount invoices (18.2% annualized return) |
| 1:00 | Updating vendor bank details — verifying changes against documentation to prevent fraud | Vendor Master Manager validated the bank change against D&B records and flagged a suspicious mismatch |
| 2:30 | Reviewing AP aging report — identifying invoices in dispute and tracking resolution | AP Aging Analyzer generated narrative: disputed invoices total $2.1M, resolution expected by month-end |
| 4:00 | Checking policy compliance — reviewing expense reports for split-purchasing violations | Policy Compliance Monitor flagged 7 potential split-purchase violations with evidence and recommended actions |

### Controller (Strategic Lens)
| Time | Current Reality | With Agents |
|------|-----------------|-------------|
| 8:00 | Reviewing the close checklist — chasing 5 team members who haven't completed their tasks | Close Orchestrator shows 92% task completion; 3 items auto-escalated with predicted delay impact |
| 9:00 | Reviewing account reconciliations — reading through 30+ workpapers looking for issues | Account Reconciliation Agent flagged 4 accounts with exceptions; remaining 26 auto-certified with evidence |
| 10:00 | Investigating a $500K GL anomaly that appeared in the trial balance overnight | GL Anomaly Detector already traced it: a misclassified expense entry — generated the correcting JE |
| 11:00 | Reviewing revenue recognition memos for 3 new contracts with complex terms | Revenue Recognition Engine applied ASC 606 analysis; drafted memos for Controller review with cited guidance |
| 1:00 | Working on the quarterly tax provision — waiting for the tax team's workpapers | Tax Provision Calculator already computed the provision with ASC 740 workpapers; ready for Tax Director review |
| 2:30 | Consolidating 8 entity financials — chasing intercompany reconciliation breaks | Consolidation Agent eliminated IC transactions; Intercompany Reconciliation resolved 95% of breaks |
| 4:00 | Reviewing the financial statements package before filing — checking for disclosure completeness | Financial Statement Generator produced the package; Regulatory Filing Orchestrator validated XBRL and disclosures |

---

## Transformation Impact Metrics

| Metric | Before (Manual) | After (Agent-Augmented) | Shift |
|--------|-----------------|------------------------|-------|
| **Close Cycle Time** | 8-10 days | 3-4 days | Automated reconciliations, parallel processing |
| **Forecast Accuracy** | 70-75% | 92%+ | ML models + qualitative signal incorporation |
| **Invoice Processing** | 60% touchless | 95%+ touchless | OCR + AI matching + auto-resolution |
| **DSO** | 48 days | 35 days | Predictive collections, automated cash application |
| **Audit Findings** | Discovered at year-end | Continuous monitoring | Real-time control testing |
| **Tax Provision Cycle** | 3-4 weeks | 3-5 days | Automated calculations, automated workpapers |
| **Management Reporting** | 2-3 days post-close | Same-day | Automated data pipelines + narrative generation |
| **Fraud Detection** | Annual review | Continuous | ML anomaly detection + behavioral analysis |
