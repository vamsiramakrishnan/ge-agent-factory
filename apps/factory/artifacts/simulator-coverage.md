# Simulator Coverage Report

Generated: 2026-06-06T09:43:24.117Z

Use cases: 363

Sources: 2151

## Summary

| Status | Count |
| --- | ---: |
| simulator | 848 |
| platform_dependency | 622 |
| domain_facade | 89 |
| first_party_mcp | 117 |
| generic_fixture | 475 |

## Gate Results

- Failing sources: 0
- Warning sources: 475

## Failing Sources

| Use Case | System | Direction | Kind | Reason |
| --- | --- | --- | --- | --- |

## Coverage By Use Case

### finance/BankReconciliationAgent - Bank Reconciliation Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bank Portals | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/BudgetBuilderConsolidation - Budget Builder & Consolidation

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SAP BPC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### finance/CashApplicationAgent - Cash Application Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bank Portals | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/CashFlowForecaster - Cash Flow Forecaster

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bloomberg | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/CollectionsPriorityEngine - Collections Priority Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/CreditRiskScorer - Credit Risk Scorer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Moody's | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/DebtCovenantTracker - Debt Covenant Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Document Repository | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/DunningCommunicationDrafter - Dunning Communication Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email / CRM | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/ESGSustainabilityReporter - ESG & Sustainability Reporter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| CDP | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/FXExposureMonitor - FX Exposure Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bloomberg | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/InvestmentPortfolioOptimizer - Investment Portfolio Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bloomberg | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/InvestorRelationsPrepAgent - Investor Relations Prep Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bloomberg | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| S&P Capital IQ | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/JournalEntryAutoPosting - Journal Entry Auto-Posting

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Oracle Financials | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### finance/PeerBenchmarkingAgent - Peer Benchmarking Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| S&P Capital IQ | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Bloomberg | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/RegulatoryChangeMonitor - Regulatory Change Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bloomberg Tax | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| CCH AnswerConnect | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/RegulatoryFilingOrchestrator - Regulatory Filing Orchestrator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SEC EDGAR | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/RevenueRecognitionEngine - Revenue Recognition Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| RevPro/Zuora | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### finance/TaxAuditPrepAgent - Tax Audit Prep Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Document Management | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/TaxResearchAssistant - Tax Research Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| CCH AnswerConnect | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Bloomberg Tax | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Internal Tax Memos | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/TransferPricingMonitor - Transfer Pricing Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| OECD / Bureau van Dijk | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/VendorMasterDataManager - Vendor Master Data Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| D&B (Dun & Bradstreet) | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| IRS TIN Matching | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### finance/WithholdingTaxAgent - Withholding Tax Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Tax Databases | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/AttritionAnalytics - Attrition Analytics Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Culture Amp | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/AttritionPrediction - Attrition Prediction & Intervention

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Culture Amp | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/BenefitsAssistant - Benefits Q&A & Enrollment

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Benefits Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/BenefitsUtilizationAnalyzer - Benefits Utilization & Cost Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Benefits Carrier Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Benefits Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Carrier Reports | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/CandidateSourcing - Candidate Sourcing & Outreach Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Indeed | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/CommunicationSentimentAnalyzer - Communication Reach & Sentiment Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Intranet | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/CompPhilosophyCommunicator - Compensation Philosophy Communicator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ComplianceTrackingEscalation - Compliance Tracking & Escalation Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ComplianceTrainingGenerator - Compliance Training Content Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Legal DB | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/DEICommunicationProgramming - DEI Communication & Programming Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Intranet | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/DEIDashboard - DEI Dashboard & Reporting

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Tableau | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ERCaseIntelligence - ER Case Intelligence

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| NAVEX | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Legal DB | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ERGImpact - ERG Engagement & Impact

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Recognition Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Survey Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/EmployeeCommunicationDrafter - Employee Communication Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Intranet | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/EngagementOutcomeCorrelation - Engagement-to-Outcome Correlation Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Finance System | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Culture Amp | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/EngagementSynthesizer - Engagement Insight Synthesizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Culture Amp | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/EquityParticipantCommunicator - Equity Participant Communicator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Carta/Shareworks | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| E*Trade | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Carta | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ExitInterviewSynthesizer - Exit Interview Insight Synthesizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Survey Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/FeedbackTrendAnalyzer - Feedback Trend Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Survey Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/HRDataLakeQuery - HR Data Lake Query

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Cloud | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/HRTechIntelligence - HR Tech Stack Intelligence

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Gartner | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| G2 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Admin | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| License Manager | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/HiPoDevelopmentJourney - HiPo Development Journey Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Mentoring Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/HiPoIdentification - HiPo Identification & Nomination Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| 360 Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/InclusiveHiringAudit - Inclusive Hiring Audit

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/InterviewScheduling - Interview Scheduling & Coordination

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Zoom | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/InterviewScorecardBuilder - Interview Question & Scorecard Builder

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/JobArchitectureSync - Job Architecture Sync Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Mercer | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/JobDescriptionOptimizer - Job Description Generator & Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Textio | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| LinkedIn | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/LDPlanDrafter - L&D Plan Narrative Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/LaborMarketIntelligence - Labor Market Intelligence

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LinkedIn Talent Insights | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Lightcast | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| BLS Data | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/LeadershipProgramDesign - Leadership Program Design Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Assessment Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/LearningContentSummarizer - Learning Content Summarizer & Quiz Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Degreed | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/LearningPathRecommendation - Learning Path Recommendation

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Degreed | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Udemy | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Coursera | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/LeaveUtilizationAnalyzer - Leave Utilization & Compliance Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Benefits Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/MarketBenchmarking - Market Benchmarking Analysis Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Mercer | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Radford | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Payscale | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/MeritPromotionModeler - Merit & Promotion Budget Modeler Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Mercer | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SAP BPC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/NewHireQA - New Hire Q&A Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/OfferPackageModeler - Offer Package Modeler Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Mercer | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Radford | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/OnboardingEffectivenessAnalyzer - Onboarding Effectiveness Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Survey Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/OnboardingOrchestration - Onboarding Orchestration

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/OrgStructureAnalyzer - Org Structure Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Visio | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/PayEquityAudit - Pay Equity Audit

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Syndio | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/PayrollReconciliation - Payroll Reconciliation & Compliance Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ADP | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Tax Systems | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/PayrollValidation - Payroll Input Validation

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ADP | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/PolicyDraftingReview - Policy Drafting & Review Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Legal DB | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ProgramImpactEvaluation - Program Impact Evaluation Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Survey Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ProgressiveDisciplineAdvisor - Progressive Discipline Advisor Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Legal KB | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Legal DB | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/QueryResolution - Employee Query Resolution

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Knowledge Base | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/RecognitionNudge - Recognition Nudge & Celebration

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bonusly/Achievers | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Recognition Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/RecognitionProgramAnalytics - Recognition Program Analytics Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bonusly/Achievers | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Recognition Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/RequisitionPrioritization - Requisition Prioritization Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/RestructuringImpactAssessment - Restructuring Impact Assessment Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SAP BPC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Skills DB | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ResumeScreening - Resume Screening & Shortlisting

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Google Cloud AI | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/ReviewCycleOrchestration - Review Cycle Orchestration Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### hr/SelectionDebriefSummarizer - Selection Debrief Summarizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Google Meet | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/SkillsGapAnalyzer - Skills Gap Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Degreed | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Skills DB | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| LMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/SourcingChannelAnalytics - Sourcing Channel Analytics Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Indeed | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| ATS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/SuccessionPipelineDashboard - Succession Pipeline Dashboard Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Tableau | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/SuccessorReadiness - Successor Readiness Assessment

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Assessment Platform | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/SurveyDesignCommunication - Survey Design & Communication Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Culture Amp | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/TotalRewardsOptimizer - Total Rewards Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Mercer | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| E*Trade | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/VendorEvaluationAssistant - Vendor Evaluation Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Gartner | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| G2 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Web | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/WorkforceCostModeling - Workforce Cost Modeling

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SAP BPC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### hr/WorkforceScenarioModeling - Workforce Scenario Modeling

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SAP BPC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/APICatalogGovernance - API Catalog & Governance

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Ardoq | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/ArchitectureComplianceScanner - Architecture Compliance Scanner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SonarQube | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/BackupDRComplianceAgent - Backup & DR Compliance Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| AWS Backup | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| GCP Cloud Storage | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/CICDPipelineOptimizer - CI/CD Pipeline Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Jenkins | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| ArgoCD | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/CapacityPlanningAgent - Capacity Planning Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| AWS CloudWatch | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/CloudCostOptimizer - Cloud Cost Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| AWS Cost Explorer | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| GCP Billing | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/CodeReviewAssistant - Code Review Assistant

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SonarQube | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GitLab | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/CompliancePostureScanner - Compliance Posture Scanner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Qualys | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| AWS Security Hub | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| GCP Security Command Center | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/DataCatalogLineageAgent - Data Catalog & Lineage Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Dataplex | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/DataPipelineHealthMonitor - Data Pipeline Health Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Apache Airflow | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/DatabasePerformanceAdvisor - Database Performance Advisor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| CloudSQL | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/DependencyVulnerabilityScanner - Dependency Vulnerability Scanner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Snyk | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| NIST NVD | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/FeatureFlagManager - Feature Flag Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LaunchDarkly | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/ITBudgetForecastAgent - IT Budget Forecast Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| AWS Cost Explorer | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| GCP Billing | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/ITControlTestingAgent - IT Control Testing Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| RSA Archer | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/ITGRCDashboard - IT GRC Dashboard & Reporter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| RSA Archer | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/IaCDriftDetector - IaC Drift Detector

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| AWS CloudFormation | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/IdentityAccessAnomalyDetector - Identity & Access Anomaly Detector

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Chronicle SIEM | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Chronicle | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/IntegrationPatternAdvisor - Integration Pattern Advisor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Pub/Sub | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/LicenseComplianceMonitor - License Compliance Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Zylo | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/MLModelRegistryMonitor - ML Model Registry & Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| MLflow | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/MajorIncidentCoordinator - Major Incident Coordinator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Zoom | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/NetworkDNSHealthMonitor - Network & DNS Health Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| AWS Route 53 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Palo Alto | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/PenTestFindingsTracker - Penetration Test Findings Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| HackerOne | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/PhishingEmailThreatAnalyzer - Phishing & Email Threat Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Chronicle SIEM | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Chronicle | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/RegulatoryChangeMonitor - Regulatory Change Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Thomson Reuters | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/RiskRegisterAgent - Risk Register Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| RSA Archer | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/SIEMAlertTriageAgent - SIEM Alert Triage Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Chronicle SIEM | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Splunk | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/SecurityIncidentResponder - Security Incident Responder

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Chronicle SIEM | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Splunk | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Chronicle | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/ShadowITDetector - Shadow IT Detector

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Palo Alto | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/SystemDependencyMapper - System Dependency Mapper

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Ardoq | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/TechDebtPrioritizer - Tech Debt Prioritizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SonarQube | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/TechnologyRadarTrendScout - Technology Radar & Trend Scout

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Gartner API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/ThreatIntelligenceAggregator - Threat Intelligence Aggregator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Chronicle SIEM | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| MITRE ATT&CK | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Splunk | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/VendorRationalizationAgent - Vendor Rationalization Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Zylo | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/VulnerabilityPrioritizationAgent - Vulnerability Prioritization Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Qualys | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Tenable | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Snyk | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### it/WorkspaceAnalyticsAgent - Workspace Analytics Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Microsoft 365 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### it/ZeroTrustPolicyEvaluator - Zero Trust Policy Evaluator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Palo Alto Prisma | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Google BeyondCorp | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/ABMCampaignManager - ABM Campaign Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Demandbase | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| 6sense | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/ABTestAnalyzer - A/B Test Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Optimize | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/AnalystRelationsTracker - Analyst & Influencer Relations Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Cision | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/AudienceSegmentationEngine - Audience Segmentation Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| 6sense | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/BrandGuidelinesEnforcer - Brand Guidelines Enforcer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bynder | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Figma | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Canva | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/BrandHealthMonitor - Brand Health Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Brandwatch | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Trends | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/BrandVoiceChecker - Brand Voice Checker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Contentful | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/CampaignCalendarOrchestrator - Campaign Calendar Orchestrator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Asana | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/CommunityEngagementResponder - Community Engagement Responder

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Hootsuite | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/CompetitiveBattleCards - Competitive Battle Card Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Gong | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| G2 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Highspot | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/CompetitiveIntelligenceMonitor - Competitive Intelligence Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Crayon | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/ContentBriefGenerator - Content Brief Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Ahrefs | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/ContentPerformanceAnalyzer - Content Performance Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/ContentRepurposingAgent - Content Repurposing Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Canva | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/ConversionRateOptimizer - Conversion Rate Optimization Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Hotjar | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Optimize | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/CreativeAssetGenerator - Creative Asset Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Figma | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Canva | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Bynder | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/CrisisCommsAdvisor - Crisis Communications Advisor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Brandwatch | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/CustomerJourneyMapper - Customer Journey Mapper

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| 6sense | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/CustomerVoiceMonitor - Customer Voice & Review Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| G2 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Trustpilot | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Gartner Peer Insights | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/DAMContentLifecycleManager - DAM & Content Lifecycle Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Bynder | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Brandfolder | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Contentful | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/EmailDeliverabilityManager - Email Deliverability Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Postmaster | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/ExecThoughtLeadership - Executive Thought Leadership Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/GTMLaunchPlanner - GTM Launch Planner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Asana | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/InfluencerDiscoveryTracker - Influencer Discovery & Tracking

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/InternalCommsDrafter - Internal Communications Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/KeywordStrategyAgent - Keyword Strategy Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Ahrefs | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Trends | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Search Console | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/LandingPageOptimizer - Landing Page Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Unbounce | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Optimize | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/LeadScoringQualificationAgent - Lead Scoring & Qualification Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| 6sense | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Demandbase | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/LongFormContentDrafter - Long-Form Content Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Contentful | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/MarTechHealthMonitor - MarTech Stack Health Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/MarketResearchSynthesizer - Market Research Synthesizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Gartner | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Forrester | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| G2 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/MarketTrendDetector - Market Trend & Signal Detector

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Trends | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LinkedIn | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/MarketingDashboardGenerator - Marketing Dashboard Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/MarketingOKRTracker - Marketing OKR Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/MultiTouchAttributionEngine - Multi-Touch Attribution Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/PPCBidManagementAgent - PPC Bid Management Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Microsoft Ads | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/PersonaICPRefiner - Persona & ICP Refiner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| 6sense | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Clearbit | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/PredictivePipelineForecaster - Predictive Pipeline Forecaster

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| 6sense | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/PressReleaseDrafter - Press Release & Comms Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| PR Newswire | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Cision | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| WordPress | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/SEOAuditEngine - SEO Audit & Recommendation Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Ahrefs | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SEMrush | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Search Console | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/SalesEnablementContentAgent - Sales Enablement Content Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Highspot | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/SocialContentCalendarManager - Social Content Calendar Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Hootsuite | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Canva | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/SocialListeningAnalyzer - Social Listening & Sentiment Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Brandwatch | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/SocialMediaAnalyticsDashboard - Social Media Analytics Dashboard

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Hootsuite | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/TechnicalSEOMonitor - Technical SEO Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Search Console | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Ahrefs | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Screaming Frog | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/UGCAdvocacyManager - UGC & Advocacy Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Sprout Social | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/UTMGovernanceAgent - UTM & Tracking Governance Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/WebinarEventEngine - Webinar & Event Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Zoom | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### marketing/WebsitePersonalizationEngine - Website Personalization Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Google Optimize | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Analytics 4 | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| GA4 | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### marketing/WinLossAnalysisAgent - Win/Loss Analysis Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Gong | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/AuditCorrectiveActionTracker - Audit & Corrective Action Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Audit Tools | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/BackgroundSanctionsScreener - Background & Sanctions Screener

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| LexisNexis | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| OFAC/SDN | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| World-Check | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Dun & Bradstreet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/BenchmarkIntelligenceAgent - Benchmark Intelligence Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Hackett | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| CAPS/Gartner | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Ardent Partners | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| CAPS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Gartner | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/BidEvaluationAnalyzer - Bid Evaluation & Scenario Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Excel Imports | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/BusinessReviewPrepAgent - Business Review Prep Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Scorecard Data | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Contract Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Market Intelligence | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/CatalogCurationRecommendation - Catalog Curation & Recommendation

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Amazon Business | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Ariba Catalog | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Punchout catalogs | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Ariba | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/CategoryRoadmapPlanner - Category Roadmap Planner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Category Strategy Docs | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Savings Pipeline | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Market Intel Feeds | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/CategoryStrategyGenerator - Category Strategy Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| S&P Global Platts | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/ClauseRiskAnalyzer - Clause Risk Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Legal Playbook | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/CommodityPriceForecaster - Commodity Price Forecaster

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| S&P Global Platts | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| ICIS | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Mintec | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LME/CBOT | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LME | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| CBOT | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/ConcentrationRiskAnalyzer - Concentration Risk Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Spend Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Supplier Master | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Contract Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/ContractAuthoringAgent - Contract Authoring Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Agiloft | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/DeliveryPerformanceMonitor - Delivery Performance Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| TMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| ASN Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| IoT/GPS Tracking | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/DemandForecastingAggregation - Demand Forecasting & Aggregation

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Oracle ERP | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/FinancialHealthAssessor - Financial Health Assessor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| RapidRatings | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Dun & Bradstreet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Moody's | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SEC EDGAR | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/ForceMajeureAdvisor - Force Majeure Advisor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Legal Knowledge Base | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/GoodsReceiptValidator - Goods Receipt & Service Entry Validator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| WMS | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| IoT/RFID | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/InnovationValueEngTracker - Innovation & Value Engineering Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Supplier Portal | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Contract Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Engineering Change Orders | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/InsuranceLiabilityMonitor - Insurance & Liability Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Contract System | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Supplier Portal | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/InvoiceDataExtraction - Invoice Data Extraction

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Kofax/Tungsten | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/MROFacilitiesOptimization - MRO & Facilities Optimization

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Maximo | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| eMaint | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| VMI systems | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/MakeVsBuyAnalyzer - Make-vs-Buy Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Market Benchmarks | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/MarketIntelligenceMonitor - Market Intelligence Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| S&P Global Platts | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| ICIS | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Mintec | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Dun & Bradstreet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/NegotiationPrepAgent - Negotiation Prep Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Market Intel Feeds | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Spend data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Market intel | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/ObligationMiningTracking - Obligation Mining & Tracking

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Asana/Jira | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/P2PCycleTimeAnalyzer - P2P Cycle Time Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Celonis | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/PCardReconciliationAgent - P-Card Reconciliation Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Citibank/JP Morgan | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Citibank/JP Morgan Commercial Card | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/PaymentOptimizationAgent - Payment Optimization Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Treasury Systems | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/PriceVarianceAnalyzer - Price Variance Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Contract System | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/ProcurementMaturityAssessor - Procurement Maturity Assessor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Survey Tools | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Internal Process Metrics | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Benchmark Databases | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/PurchaseOrderAutoGeneration - Purchase Order Auto-Generation

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| EDI/Supplier Portal | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Ariba | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/QualityIncidentAnalyzer - Quality Incident Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SAP QM (QM01/QM02) | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Quality Management Systems | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/RFxBuilderOrchestrator - RFx Builder & Orchestrator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email / Supplier Portal | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/RedlineComparisonAgent - Redline Comparison Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Microsoft Word | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/RegulatoryComplianceTracker - Regulatory Compliance Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| MetricStream | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Regulatory Feeds | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/RelationshipHealthAnalyzer - Relationship Health Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email Metadata | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Meeting Logs | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Escalation Records | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Survey Data | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/RequisitionIntakeRouting - Requisition Intake & Smart Routing

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Oracle ERP | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Oracle | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SanctionsWatchlistScreener - Sanctions & Watchlist Screener

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| OFAC/SDN | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| World-Check | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| LexisNexis | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Dow Jones Risk & Compliance | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| EU Sanctions | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/ServicesProcurementSOWManager - Services Procurement & SOW Manager

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Beeline | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Contract System | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| VMS platforms | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/ShouldCostModeler - Should-Cost Modeler

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Commodity Price Feeds | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Industry Benchmarks | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| SAP S/4HANA (BOM/routing) | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SoleSourceJustification - Sole/Single Source Justification Drafter

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Supplier Databases | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| ThomasNet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Market research | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SourcingChannelOptimizer - Sourcing Channel Optimizer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Amazon Business | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SpecStandardizationAgent - Specification Standardization Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| PLM Systems | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Engineering drawings | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SpendClassificationEnrichment - Spend Classification & Enrichment

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| SpendHQ | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Sievo | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SpendCubeBuilderEnrichment - Spend Cube Builder & Enrichment

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Ariba | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| SpendHQ | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Sievo | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SpotBuyNegotiationAgent - Spot Buy Negotiation Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Amazon Business | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Supplier Marketplaces | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Email API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/StakeholderSatisfactionAnalyzer - Stakeholder Satisfaction Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Email Data | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SubTierVisibilityAgent - Sub-Tier Visibility Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Resilinc | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Everstream | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| CMRT/CRT Questionnaires | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SupplierConsolidationAnalyzer - Supplier Consolidation Analyzer

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Contract System | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Vendor Master | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Contract Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SupplierDevelopmentPlanner - Supplier Development Planner

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Scorecard Data | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Capability Assessments | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| Industry Benchmarks | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SupplierDiscoveryMatching - Supplier Discovery & Matching

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| ThomasNet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Dun & Bradstreet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google Search API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SupplierDiversityTracker - Supplier Diversity Tracker

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Supplier.io | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| NMSDC/WBENC/SBA | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Ariba/Coupa | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| NMSDC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| WBENC | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| SBA | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SupplierOnboardingOrchestrator - Supplier Onboarding Orchestrator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| IRS TIN Matching | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Banking Systems | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| IRS TIN | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SupplierPreQualScreener - Supplier Pre-Qualification Screener

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Dun & Bradstreet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SupplierRiskScoringEngine - Supplier Risk Scoring Engine

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Dun & Bradstreet | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| RapidRatings | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Resilinc | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| BitSight | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| D&B | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Moody's | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/SupplierScorecardGenerator - Supplier Scorecard Generator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Supplier Portal | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

### procurement/SupplyChainDisruptionMonitor - Supply Chain Disruption Monitor

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Resilinc | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Everstream | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Google News API | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Maritime AIS | generic_fixture | warn | Fixture/feed fallback is acceptable for now |
| Weather APIs | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/ThreeWayMatchExceptionHandler - Three-Way Match Exception Handler

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Kofax | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/TotalCostOwnershipModeler - Total Cost of Ownership Modeler

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Logistics Systems | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/TravelExpenseComplianceAgent - Travel & Expense Compliance Agent

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| Egencia/Navan | generic_fixture | warn | Operational fixture fallback until simulator is implemented |
| P-card Data | generic_fixture | warn | Operational fixture fallback until simulator is implemented |

### procurement/WhatIfScenarioSimulator - What-If Scenario Simulator

| System | Coverage | Severity | Detail |
| --- | --- | --- | --- |
| S&P Global Platts | generic_fixture | warn | Fixture/feed fallback is acceptable for now |

