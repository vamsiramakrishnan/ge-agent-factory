# Use Case Data Source Map

Generated from `src/components/slides/use-cases`. Use this to choose the right mock source shape before generating fixtures.

## Source Classes

### ai_or_model

| System | Uses | Recommended Cloud Target | Data Shape | Examples |
| --- | ---: | --- | --- | --- |
| Google Cloud AI | 1 | model/runtime dependency | do not generate mock tables except eval prompts | hr/AttritionPrediction |
| Google Document AI | 4 | model/runtime dependency | do not generate mock tables except eval prompts | finance/InvoiceProcessingMatching, procurement/InsuranceLiabilityMonitor, procurement/InvoiceDataExtraction, procurement/PCardReconciliationAgent |
| Vertex AI | 222 | model/runtime dependency | do not generate mock tables except eval prompts | finance/APPolicyComplianceMonitor, finance/ARAgingDSOAnalyzer, finance/ASC606ContractAnalyzer, finance/AccountReconciliationAgent |
| Vertex AI (Gemini) | 341 | model/runtime dependency | do not generate mock tables except eval prompts | finance/APAgingAnalyzer, finance/APPolicyComplianceMonitor, finance/ARAgingDSOAnalyzer, finance/ASC606ContractAnalyzer |
| Vertex AI Feature Store | 1 | model/runtime dependency | do not generate mock tables except eval prompts | it/FeatureStoreManager |
| Vertex AI Model Registry | 1 | model/runtime dependency | do not generate mock tables except eval prompts | it/MLModelRegistryMonitor |
| Vertex Tax | 1 | model/runtime dependency | do not generate mock tables except eval prompts | finance/SalesUseTaxAutomation |

### analytics_warehouse

| System | Uses | Recommended Cloud Target | Data Shape | Examples |
| --- | ---: | --- | --- | --- |
| 6sense | 3 | BigQuery table | metrics, snapshots, facts, time series | marketing/ABMCampaignManager, marketing/CustomerJourneyMapper, marketing/PredictivePipelineForecaster |
| Ahrefs | 4 | BigQuery table | metrics, snapshots, facts, time series | marketing/ContentBriefGenerator, marketing/KeywordStrategyAgent, marketing/SEOAuditEngine, marketing/TechnicalSEOMonitor |
| Anaplan | 4 | BigQuery table | metrics, snapshots, facts, time series | finance/RollingForecastEngine, finance/ScenarioModelingSensitivity, hr/WorkforceScenarioModeling, marketing/BudgetAllocatorForecaster |
| Apigee | 1 | BigQuery table | metrics, snapshots, facts, time series | it/APICatalogGovernance |
| Ardoq | 2 | BigQuery table | metrics, snapshots, facts, time series | it/APICatalogGovernance, it/SystemDependencyMapper |
| AWS CloudWatch | 1 | BigQuery table | metrics, snapshots, facts, time series | it/CapacityPlanningAgent |
| BigQuery | 272 | BigQuery table | metrics, snapshots, facts, time series | finance/APAgingAnalyzer, finance/APPolicyComplianceMonitor, finance/ARAgingDSOAnalyzer, finance/ASC606ContractAnalyzer |
| BigQuery Admin | 1 | BigQuery table | metrics, snapshots, facts, time series | it/CostPerQueryOptimizer |
| Brandwatch | 3 | BigQuery table | metrics, snapshots, facts, time series | marketing/BrandHealthMonitor, marketing/CrisisCommsAdvisor, marketing/SocialListeningAnalyzer |
| CAPS/Gartner | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/BenchmarkIntelligenceAgent |
| Celonis | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/P2PCycleTimeAnalyzer |
| Chronicle SIEM | 5 | BigQuery table | metrics, snapshots, facts, time series | it/IdentityAccessAnomalyDetector, it/PhishingEmailThreatAnalyzer, it/SIEMAlertTriageAgent, it/SecurityIncidentResponder |
| Contract Data | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/BusinessReviewPrepAgent |
| Cornerstone | 2 | BigQuery table | metrics, snapshots, facts, time series | hr/ProgramImpactEvaluation, hr/SkillsGapAnalyzer |
| Coupa | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/ProcurementKPIDashboard |
| Coupa Analytics | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/CategorySpendDashboard |
| Coupa Catalog | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/SourcingChannelOptimizer |
| D&B | 1 | BigQuery table | metrics, snapshots, facts, time series | finance/CreditRiskScorer |
| D&B (Dun & Bradstreet) | 1 | BigQuery table | metrics, snapshots, facts, time series | finance/VendorMasterDataManager |
| Datadog | 17 | BigQuery table | metrics, snapshots, facts, time series | it/CICDPipelineOptimizer, it/CapacityPlanningAgent, it/ChangeRiskAssessor, it/CloudCostOptimizer |
| dbt | 2 | BigQuery table | metrics, snapshots, facts, time series | it/DataCatalogLineageAgent, it/DataPipelineHealthMonitor |
| Dun & Bradstreet | 2 | BigQuery table | metrics, snapshots, facts, time series | procurement/FinancialHealthAssessor, procurement/SupplierRiskScoringEngine |
| Everstream | 2 | BigQuery table | metrics, snapshots, facts, time series | procurement/SubTierVisibilityAgent, procurement/SupplyChainDisruptionMonitor |
| Finance System | 1 | BigQuery table | metrics, snapshots, facts, time series | hr/EngagementOutcomeCorrelation |
| G2 | 3 | BigQuery table | metrics, snapshots, facts, time series | hr/HRTechIntelligence, marketing/CustomerVoiceMonitor, marketing/MarketResearchSynthesizer |
| Gong | 2 | BigQuery table | metrics, snapshots, facts, time series | marketing/CompetitiveBattleCards, marketing/WinLossAnalysisAgent |
| Google Ads | 4 | BigQuery table | metrics, snapshots, facts, time series | marketing/AdCopyGenerator, marketing/MarketingMixModeler, marketing/PPCBidManagementAgent, marketing/PaidMediaOptimizer |
| Google Analytics 4 | 14 | BigQuery table | metrics, snapshots, facts, time series | marketing/ABTestAnalyzer, marketing/ContentBriefGenerator, marketing/ContentPerformanceAnalyzer, marketing/ConversionRateOptimizer |
| Google BigQuery | 36 | BigQuery table | metrics, snapshots, facts, time series | hr/AttritionAnalytics, hr/AttritionPrediction, hr/BenefitsUtilizationAnalyzer, hr/CalibrationAnalytics |
| Google Dataplex | 1 | BigQuery table | metrics, snapshots, facts, time series | it/DataCatalogLineageAgent |
| Google Docs | 1 | BigQuery table | metrics, snapshots, facts, time series | hr/InterviewScorecardBuilder |
| Google Optimize | 4 | BigQuery table | metrics, snapshots, facts, time series | marketing/ABTestAnalyzer, marketing/ConversionRateOptimizer, marketing/LandingPageOptimizer, marketing/WebsitePersonalizationEngine |
| Google Search API | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/SupplierDiscoveryMatching |
| Google Search Console | 3 | BigQuery table | metrics, snapshots, facts, time series | marketing/KeywordStrategyAgent, marketing/SEOAuditEngine, marketing/TechnicalSEOMonitor |
| Greenhouse | 1 | BigQuery table | metrics, snapshots, facts, time series | hr/SelectionDebriefSummarizer |
| Hackett | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/BenchmarkIntelligenceAgent |
| Highspot | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/SalesEnablementContentAgent |
| Hootsuite | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/SocialMediaAnalyticsDashboard |
| Hotjar | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/ConversionRateOptimizer |
| HubSpot | 7 | BigQuery table | metrics, snapshots, facts, time series | marketing/ConversionRateOptimizer, marketing/EmailDeliverabilityManager, marketing/MarketingDashboardGenerator, marketing/MarketingOKRTracker |
| Icertis Analytics | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/ContractAnalyticsDashboard |
| Internal Process Metrics | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/ProcurementMaturityAssessor |
| IoT/RFID | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/GoodsReceiptValidator |
| Jira | 1 | BigQuery table | metrics, snapshots, facts, time series | it/ITOKRKPIDashboard |
| LinkedIn | 2 | BigQuery table | metrics, snapshots, facts, time series | hr/SourcingChannelAnalytics, marketing/ExecThoughtLeadership |
| LinkedIn Ads | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/AdCopyGenerator |
| Looker | 51 | BigQuery table | metrics, snapshots, facts, time series | finance/APAgingAnalyzer, finance/ARAgingDSOAnalyzer, finance/AdHocQueryAgent, finance/BoardDeckGenerator |
| Marketo | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/LeadNurtureOptimizer |
| Meta Ads | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/MarketingMixModeler |
| Meta Ads Manager | 3 | BigQuery table | metrics, snapshots, facts, time series | marketing/AdCopyGenerator, marketing/BudgetAllocatorForecaster, marketing/PaidMediaOptimizer |
| MetricStream | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/RegulatoryComplianceTracker |
| Microsoft Ads | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/PPCBidManagementAgent |
| Mintec | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/MarketIntelligenceMonitor |
| MLflow | 1 | BigQuery table | metrics, snapshots, facts, time series | it/MLModelRegistryMonitor |
| Moody's | 1 | BigQuery table | metrics, snapshots, facts, time series | finance/CreditRiskScorer |
| NIST NVD | 1 | BigQuery table | metrics, snapshots, facts, time series | it/DependencyVulnerabilityScanner |
| OneTrust | 1 | BigQuery table | metrics, snapshots, facts, time series | it/ITGRCDashboard |
| Qualtrics | 3 | BigQuery table | metrics, snapshots, facts, time series | hr/EngagementOutcomeCorrelation, hr/SurveyDesignCommunication, procurement/StakeholderSatisfactionAnalyzer |
| RapidRatings | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/FinancialHealthAssessor |
| RSA Archer | 1 | BigQuery table | metrics, snapshots, facts, time series | it/ITGRCDashboard |
| S&P Global Platts | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/WhatIfScenarioSimulator |
| Salesforce CRM | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/UGCAdvocacyManager |
| Salesforce Marketing Cloud | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/EmailCopyOptimizer |
| SAP Ariba | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/ProcurementKPIDashboard |
| SAP Ariba Analytics | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/CategorySpendDashboard |
| SAP BPC | 1 | BigQuery table | metrics, snapshots, facts, time series | hr/RestructuringImpactAssessment |
| SAP S/4HANA | 2 | BigQuery table | metrics, snapshots, facts, time series | procurement/RenewalExpiryMonitor, procurement/WhatIfScenarioSimulator |
| SAP S/4HANA QM/MM | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/SupplierScorecardGenerator |
| Savings Pipeline | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/CategoryRoadmapPlanner |
| Scorecard Data | 2 | BigQuery table | metrics, snapshots, facts, time series | procurement/BusinessReviewPrepAgent, procurement/SupplierDevelopmentPlanner |
| Screaming Frog | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/TechnicalSEOMonitor |
| SEMrush | 5 | BigQuery table | metrics, snapshots, facts, time series | marketing/CompetitiveIntelligenceMonitor, marketing/ContentBriefGenerator, marketing/ContentPerformanceAnalyzer, marketing/KeywordStrategyAgent |
| ServiceNow | 2 | BigQuery table | metrics, snapshots, facts, time series | it/ITOKRKPIDashboard, it/ITSMAnalyticsDashboard |
| Sievo | 2 | BigQuery table | metrics, snapshots, facts, time series | procurement/SpendClassificationEnrichment, procurement/SpendCubeBuilderEnrichment |
| Snyk | 1 | BigQuery table | metrics, snapshots, facts, time series | it/DependencyVulnerabilityScanner |
| SonarQube | 3 | BigQuery table | metrics, snapshots, facts, time series | it/ArchitectureComplianceScanner, it/CodeReviewAssistant, it/TechDebtPrioritizer |
| SpendHQ | 2 | BigQuery table | metrics, snapshots, facts, time series | procurement/SpendClassificationEnrichment, procurement/SpendCubeBuilderEnrichment |
| Splunk | 3 | BigQuery table | metrics, snapshots, facts, time series | it/SIEMAlertTriageAgent, it/SecurityIncidentResponder, it/ThreatIntelligenceAggregator |
| Sprout Social | 7 | BigQuery table | metrics, snapshots, facts, time series | marketing/BrandHealthMonitor, marketing/CrisisCommsAdvisor, marketing/InfluencerDiscoveryTracker, marketing/SocialContentCalendarManager |
| Supplier Portal | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/SupplierScorecardGenerator |
| Survey Data | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/RelationshipHealthAnalyzer |
| Treasury Systems | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/PaymentOptimizationAgent |
| WMS | 1 | BigQuery table | metrics, snapshots, facts, time series | procurement/GoodsReceiptValidator |
| Workday | 1 | BigQuery table | metrics, snapshots, facts, time series | hr/ERGImpact |
| YouTube | 1 | BigQuery table | metrics, snapshots, facts, time series | marketing/InfluencerDiscoveryTracker |
| Zylo | 1 | BigQuery table | metrics, snapshots, facts, time series | it/LicenseComplianceMonitor |

### collaboration_event

| System | Uses | Recommended Cloud Target | Data Shape | Examples |
| --- | ---: | --- | --- | --- |
| Anaplan | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | finance/BudgetBuilderConsolidation |
| Asana | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/CampaignCalendarOrchestrator, marketing/GTMLaunchPlanner |
| Asana/Jira | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/ObligationMiningTracking |
| Brandfolder | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/DAMContentLifecycleManager |
| Bynder | 3 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/BrandGuidelinesEnforcer, marketing/CreativeAssetGenerator, marketing/DAMContentLifecycleManager |
| Canva | 4 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/BrandGuidelinesEnforcer, marketing/ContentRepurposingAgent, marketing/CreativeAssetGenerator, marketing/SocialContentCalendarManager |
| CMRT/CRT Questionnaires | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/SubTierVisibilityAgent |
| EDI/Supplier Portal | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/PurchaseOrderAutoGeneration |
| Email | 3 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | hr/ComplianceTrackingEscalation, hr/ReviewCycleOrchestration, procurement/AuditCorrectiveActionTracker |
| Email (Gmail) | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | hr/CommunicationSentimentAnalyzer |
| Email / CRM | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | finance/DunningCommunicationDrafter |
| Email / Supplier Portal | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/RFxBuilderOrchestrator |
| Email API | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/SpotBuyNegotiationAgent |
| Email Data | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/StakeholderSatisfactionAnalyzer |
| Email Metadata | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/RelationshipHealthAnalyzer |
| Excel Imports | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/BidEvaluationAnalyzer |
| Figma | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/BrandGuidelinesEnforcer, marketing/CreativeAssetGenerator |
| GitHub | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | it/ChangeRiskAssessor |
| Gmail | 8 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | hr/CandidateSourcing, hr/ChangeCommunicationDrafter, hr/CommunicationSentimentAnalyzer, hr/CompensationLetterGenerator |
| Google Calendar | 7 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | hr/InterviewScheduling, hr/InterviewScorecardBuilder, hr/OneOnOnePrep, it/MeetingRoomOptimizer |
| Google Chat | 5 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | hr/BenefitsAssistant, hr/LeaveAccommodationIntake, hr/NewHireQA, hr/PolicyAssistant |
| Google Postmaster | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/EmailDeliverabilityManager |
| Google Slides | 8 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | finance/BoardDeckGenerator, finance/InvestorRelationsPrepAgent, finance/ManagementReportingAgent, hr/EngagementSynthesizer |
| Google Workspace | 7 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | it/DeviceLifecycleManager, it/IdentityAccessAnomalyDetector, it/MeetingRoomOptimizer, it/SelfServiceITBot |
| Google Workspace Admin | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | it/DeviceLifecycleManager |
| Hootsuite | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/CommunityEngagementResponder, marketing/SocialContentCalendarManager |
| HubSpot | 11 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/ABTestAnalyzer, marketing/BudgetAllocatorForecaster, marketing/CampaignBuilderOrchestrator, marketing/CampaignCalendarOrchestrator |
| Jira | 5 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | hr/OKRProgressTracker, it/ChangeRiskAssessor, it/IncidentToCodeTracer, it/PenTestFindingsTracker |
| LinkedIn | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/MarketTrendDetector |
| LinkedIn Ads | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/ListManagementAgent |
| Marketo | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/EmailCopyOptimizer, marketing/EmailDeliverabilityManager |
| Meeting Logs | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/RelationshipHealthAnalyzer |
| PagerDuty | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | it/SecurityIncidentResponder |
| PR Newswire | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/PressReleaseDrafter |
| ServiceNow | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | finance/CloseChecklistOrchestrator, it/ChangeRiskAssessor |
| Slack | 42 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | finance/CloseChecklistOrchestrator, hr/ChangeCommunicationDrafter, hr/CommunicationSentimentAnalyzer, hr/CompPhilosophyCommunicator |
| Slack/Email | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/MaverickSpendDetectorNudge |
| Sprout Social | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/CommunityEngagementResponder |
| Supplier Portal | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/InnovationValueEngTracker, procurement/InsuranceLiabilityMonitor |
| Survey Tools | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | procurement/ProcurementMaturityAssessor |
| Unbounce | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/LandingPageOptimizer |
| WordPress | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/PressReleaseDrafter |
| Workiva | 2 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | finance/ESGSustainabilityReporter, finance/FinancialStatementGenerator |
| Zoom | 1 | BigQuery event table; optional API mock | messages, events, notifications, delivery state | marketing/WebinarEventEngine |

### document_store

| System | Uses | Recommended Cloud Target | Data Shape | Examples |
| --- | ---: | --- | --- | --- |
| Ariba SLP | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/SupplierOnboardingOrchestrator |
| Category Strategy Docs | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/CategoryRoadmapPlanner |
| Confluence | 11 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/NewHireQA, hr/PolicyAssistant, it/ADRDrafter, it/IntegrationPatternAdvisor |
| Contentful | 3 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/BrandVoiceChecker, marketing/DAMContentLifecycleManager, marketing/LongFormContentDrafter |
| Coupa | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/APPolicyComplianceMonitor, procurement/PCardReconciliationAgent |
| CrowdStrike | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | it/CompliancePostureScanner |
| Degreed | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/LearningContentSummarizer, hr/LearningPathRecommendation |
| Document Management | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/TaxAuditPrepAgent |
| Document Repository | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/DebtCovenantTracker |
| DocuSign CLM | 5 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/AgreementHierarchyTracker, procurement/ClauseRiskAnalyzer, procurement/ContractAuthoringAgent, procurement/ObligationMiningTracking |
| Google Docs | 29 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/AuditReportGenerator, hr/ChangeCommunicationDrafter, hr/CompPhilosophyCommunicator, hr/CompensationLetterGenerator |
| Google Drive | 9 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/BenefitsAssistant, hr/LearningContentSummarizer, hr/NewHireQA, hr/QueryResolution |
| Google Sheets | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/UTMGovernanceAgent |
| Google Workspace | 14 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/OffboardingOrchestration, hr/OnboardingOrchestration, hr/PreboardingOrchestration, it/AccessProvisioningOrchestrator |
| Highspot | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/CompetitiveBattleCards |
| HubSpot | 9 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/ABMCampaignManager, marketing/AudienceSegmentationEngine, marketing/BrandVoiceChecker, marketing/ContentPerformanceAnalyzer |
| Icertis | 3 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/AgreementHierarchyTracker, procurement/ClauseRiskAnalyzer, procurement/RedlineComparisonAgent |
| Internal Tax Memos | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/TaxResearchAssistant |
| Knowledge Base | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/QueryResolution |
| Legal KB | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/ProgressiveDisciplineAdvisor |
| Legal Knowledge Base | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/ForceMajeureAdvisor |
| LinkedIn | 3 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/AnalystRelationsTracker, marketing/ContentRepurposingAgent, marketing/InfluencerDiscoveryTracker |
| Microsoft 365 | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | it/WorkspaceAnalyticsAgent |
| Microsoft Word | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/RedlineComparisonAgent |
| OECD / Bureau van Dijk | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/TransferPricingMonitor |
| Policy docs | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/SoleSourceJustification, procurement/TravelExpenseComplianceAgent |
| Policy Documents | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/SoleSourceJustification |
| Pub/Sub | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | it/IntegrationPatternAdvisor |
| SAP Concur | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | procurement/PCardReconciliationAgent, procurement/TravelExpenseComplianceAgent |
| SAP S/4HANA SD/FI | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/RevenueRecognitionEngine |
| SEMrush | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/CompetitiveBattleCards, marketing/MarketTrendDetector |
| ServiceNow | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/QueryResolution, it/KnowledgeBaseAutoResolver |
| ServiceNow GRC | 3 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | it/ITGRCDashboard, it/PolicyLifecycleManager, it/RegulatoryChangeMonitor |
| SharePoint | 2 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/PolicyAssistant, hr/PolicyDraftingReview |
| SharePoint/Google Drive | 3 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/PolicyComplianceScanner, hr/PolicyAssistant, procurement/ProcurementPolicyAssistant |
| Slack | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/SalesEnablementContentAgent |
| Terraform | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | it/BackupDRComplianceAgent |
| WordPress | 8 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | marketing/BrandVoiceChecker, marketing/ContentBriefGenerator, marketing/ContentPerformanceAnalyzer, marketing/ContentRepurposingAgent |
| Workday | 4 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | hr/CompPhilosophyCommunicator, hr/NewHireQA, hr/OfferPackageModeler, hr/PolicyAssistant |
| Workiva | 1 | Cloud Storage + BigQuery documents_manifest | documents with metadata, sections, citations | finance/RegulatoryFilingOrchestrator |

### external_feed

| System | Uses | Recommended Cloud Target | Data Shape | Examples |
| --- | ---: | --- | --- | --- |
| 6sense | 3 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/AudienceSegmentationEngine, marketing/LeadScoringQualificationAgent, marketing/PersonaICPRefiner |
| Ardent Partners | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BenchmarkIntelligenceAgent |
| Bank Portals | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/BankReconciliationAgent, finance/CashApplicationAgent |
| Benchmark Databases | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/ProcurementMaturityAssessor |
| BitSight | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SupplierRiskScoringEngine |
| Bloomberg | 5 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/CashFlowForecaster, finance/FXExposureMonitor, finance/InvestmentPortfolioOptimizer, finance/InvestorRelationsPrepAgent |
| Bloomberg Tax | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/RegulatoryChangeMonitor, finance/TaxResearchAssistant |
| BLS Data | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/LaborMarketIntelligence |
| CCH AnswerConnect | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/RegulatoryChangeMonitor, finance/TaxResearchAssistant |
| CDP | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/ESGSustainabilityReporter |
| Cision | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/AnalystRelationsTracker, marketing/PressReleaseDrafter |
| Clearbit | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/PersonaICPRefiner |
| Commodity Price Feeds | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/ShouldCostModeler |
| Crayon | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/CompetitiveIntelligenceMonitor |
| D&B | 7 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/CollectionsPriorityEngine, finance/VendorMasterDataManager, procurement/BackgroundSanctionsScreener, procurement/FinancialHealthAssessor |
| Demandbase | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/ABMCampaignManager, marketing/LeadScoringQualificationAgent |
| Dow Jones Risk & Compliance | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SanctionsWatchlistScreener |
| Dun & Bradstreet | 4 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BackgroundSanctionsScreener, procurement/MarketIntelligenceMonitor, procurement/SupplierDiscoveryMatching, procurement/SupplierPreQualScreener |
| Forrester | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/MarketResearchSynthesizer |
| G2 | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/VendorEvaluationAssistant, marketing/CompetitiveBattleCards |
| Gartner | 4 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/HRTechIntelligence, hr/VendorEvaluationAssistant, marketing/MarketResearchSynthesizer, procurement/BenchmarkIntelligenceAgent |
| Gartner API | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | it/TechnologyRadarTrendScout |
| Google News | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BackgroundSanctionsScreener |
| Google News API | 6 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/CompetitiveIntelligenceMonitor, marketing/CrisisCommsAdvisor, marketing/ExecThoughtLeadership, marketing/MarketTrendDetector |
| Google Trends | 3 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/BrandHealthMonitor, marketing/KeywordStrategyAgent, marketing/MarketTrendDetector |
| ICIS | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/CommodityPriceForecaster, procurement/MarketIntelligenceMonitor |
| Indeed | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/CandidateSourcing, hr/SourcingChannelAnalytics |
| Industry Benchmarks | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/ShouldCostModeler, procurement/SupplierDevelopmentPlanner |
| IoT/GPS Tracking | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/DeliveryPerformanceMonitor |
| IRS TIN Matching | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/VendorMasterDataManager, procurement/SupplierOnboardingOrchestrator |
| LexisNexis | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BackgroundSanctionsScreener, procurement/SanctionsWatchlistScreener |
| Lightcast | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/LaborMarketIntelligence |
| LinkedIn | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/CandidateSourcing, marketing/CompetitiveIntelligenceMonitor |
| LinkedIn Talent Insights | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/LaborMarketIntelligence |
| LME/CBOT | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/CommodityPriceForecaster |
| Maritime AIS | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SupplyChainDisruptionMonitor |
| Market Benchmarks | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/MakeVsBuyAnalyzer |
| Market intel | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/NegotiationPrepAgent |
| Market Intel Feeds | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/CategoryRoadmapPlanner, procurement/NegotiationPrepAgent |
| Market Intelligence | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BusinessReviewPrepAgent |
| Market research | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SoleSourceJustification |
| Mercer | 5 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/JobArchitectureSync, hr/MarketBenchmarking, hr/MeritPromotionModeler, hr/OfferPackageModeler |
| Mintec | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/CommodityPriceForecaster |
| MITRE ATT&CK | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | it/ThreatIntelligenceAggregator |
| Moody's | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/FinancialHealthAssessor |
| NMSDC/WBENC/SBA | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SupplierDiversityTracker |
| OFAC/SDN | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BackgroundSanctionsScreener, procurement/SanctionsWatchlistScreener |
| Payscale | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/MarketBenchmarking |
| Radford | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | hr/MarketBenchmarking, hr/OfferPackageModeler |
| RapidRatings | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SupplierRiskScoringEngine |
| Regulatory Feeds | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/RegulatoryComplianceTracker |
| Resilinc | 3 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SubTierVisibilityAgent, procurement/SupplierRiskScoringEngine, procurement/SupplyChainDisruptionMonitor |
| S&P Capital IQ | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/InvestorRelationsPrepAgent, finance/PeerBenchmarkingAgent |
| S&P Global Platts | 3 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/CategoryStrategyGenerator, procurement/CommodityPriceForecaster, procurement/MarketIntelligenceMonitor |
| SEC EDGAR | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/RegulatoryFilingOrchestrator, procurement/FinancialHealthAssessor |
| SEMrush | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/BrandHealthMonitor |
| Supplier Databases | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SoleSourceJustification |
| Supplier Marketplaces | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SpotBuyNegotiationAgent |
| Supplier.io | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SupplierDiversityTracker |
| Tax Databases | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | finance/WithholdingTaxAgent |
| ThomasNet | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/SoleSourceJustification, procurement/SupplierDiscoveryMatching |
| Thomson Reuters | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | it/RegulatoryChangeMonitor |
| Trustpilot | 1 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | marketing/CustomerVoiceMonitor |
| World-Check | 2 | BigQuery raw/staged feed table | provider snapshots, scores, observations, timestamps | procurement/BackgroundSanctionsScreener, procurement/SanctionsWatchlistScreener |

### operational_system

| System | Uses | Recommended Cloud Target | Data Shape | Examples |
| --- | ---: | --- | --- | --- |
| 360 Platform | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/HiPoIdentification |
| AbsenceSoft | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/LeaveAccommodationIntake |
| Active Directory | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/DataChangeOrchestrator, hr/OffboardingOrchestration |
| ADP | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/PayrollReconciliation, hr/PayrollValidation |
| Agiloft | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ContractAuthoringAgent |
| Amazon Business | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CatalogCurationRecommendation, procurement/SourcingChannelOptimizer, procurement/SpotBuyNegotiationAgent |
| Anaplan | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/CapExAnalyzer, finance/FPAQueryAssistant, finance/HeadcountPlanningAgent, finance/VarianceAnalysisAgent |
| Apache Airflow | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/DataPipelineHealthMonitor |
| Apigee | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/IntegrationPatternAdvisor |
| ArgoCD | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CICDPipelineOptimizer |
| Ariba | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CatalogCurationRecommendation, procurement/PurchaseOrderAutoGeneration, procurement/SpendCubeBuilderEnrichment |
| Ariba Catalog | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CatalogCurationRecommendation |
| Ariba SLP | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/AuditCorrectiveActionTracker, procurement/CapabilityAssessmentAgent, procurement/SupplierPreQualScreener |
| Ariba/Coupa | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierDiversityTracker |
| ASN Data | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/DeliveryPerformanceMonitor |
| Assessment Platform | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/LeadershipProgramDesign, hr/SuccessorReadiness |
| ATS | 8 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/CandidateSourcing, hr/InclusiveHiringAudit, hr/InterviewScheduling, hr/InterviewScorecardBuilder |
| Audit Tools | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/AuditCorrectiveActionTracker |
| AuditBoard | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/AuditFindingTracker, finance/AuditReportGenerator, finance/RiskAssessmentAgent, finance/SOXControlTestingAgent |
| Avalara | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/SalesUseTaxAutomation |
| AWS Backup | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/BackupDRComplianceAgent |
| AWS CloudFormation | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/IaCDriftDetector |
| AWS Cost Explorer | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CloudCostOptimizer, it/ITBudgetForecastAgent |
| AWS Route 53 | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/NetworkDNSHealthMonitor |
| AWS Security Hub | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CompliancePostureScanner |
| Banking Systems | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierOnboardingOrchestrator |
| Basware | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/InvoiceProcessingMatching, procurement/InvoiceDataExtraction, procurement/ThreeWayMatchExceptionHandler |
| Beeline | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ServicesProcurementSOWManager |
| Benefitfocus | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/BenefitsAssistant |
| Benefits Carrier Data | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/BenefitsUtilizationAnalyzer |
| Benefits Platform | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/BenefitsAssistant, hr/BenefitsUtilizationAnalyzer, hr/LeaveUtilizationAnalyzer |
| BlackLine | 8 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/AccountReconciliationAgent, finance/AccrualsDeferralsEngine, finance/CloseChecklistOrchestrator, finance/ConsolidationEliminationAgent |
| Bonusly/Achievers | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/RecognitionNudge, hr/RecognitionProgramAnalytics |
| C2FO | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/EarlyPaymentDiscountAgent, procurement/PaymentOptimizationAgent |
| CAPA Tools | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/QualityIncidentAnalyzer |
| CAPA Tracking | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/AuditCorrectiveActionTracker |
| Capability Assessments | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierDevelopmentPlanner |
| CAPS | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/BenchmarkIntelligenceAgent |
| Carrier Reports | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/BenefitsUtilizationAnalyzer |
| Carta | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/EquityParticipantCommunicator |
| Carta/Shareworks | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/EquityParticipantCommunicator |
| CBOT | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CommodityPriceForecaster |
| Chronicle | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/IdentityAccessAnomalyDetector, it/PhishingEmailThreatAnalyzer, it/SecurityIncidentResponder |
| Citibank/JP Morgan | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/PCardReconciliationAgent |
| Citibank/JP Morgan Commercial Card | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/PCardReconciliationAgent |
| CloudSQL | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/DatabasePerformanceAdvisor |
| Contract Data | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ConcentrationRiskAnalyzer, procurement/InnovationValueEngTracker, procurement/SupplierConsolidationAnalyzer |
| Contract Repository | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/ASC606ContractAnalyzer, procurement/ForceMajeureAdvisor |
| Contract System | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/InsuranceLiabilityMonitor, procurement/PriceVarianceAnalyzer, procurement/ServicesProcurementSOWManager, procurement/SupplierConsolidationAnalyzer |
| Cornerstone | 7 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/ComplianceTrackingEscalation, hr/ComplianceTrainingGenerator, hr/HiPoDevelopmentJourney, hr/LDPlanDrafter |
| Coupa | 21 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/DuplicateInvoiceDetector, finance/InvoiceProcessingMatching, finance/VendorMasterDataManager, procurement/AuctionStrategyAdvisor |
| Coupa Catalog | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CatalogCurationRecommendation |
| Coupa Pay | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/DuplicatePaymentDetector, procurement/ThreeWayMatchExceptionHandler |
| Coupa Sourcing | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/RFxBuilderOrchestrator |
| Coupa/Ariba Catalog | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/MaverickSpendDetectorNudge |
| Coupa/Ariba Workflow | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ApprovalWorkflowOptimizer |
| Coursera | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/LearningPathRecommendation |
| CrowdStrike | 7 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/EndpointSecurityPosture, it/IdentityAccessAnomalyDetector, it/PhishingEmailThreatAnalyzer, it/SIEMAlertTriageAgent |
| CrowdStrike Falcon | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ThreatIntelligenceAggregator |
| Culture Amp | 5 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/AttritionAnalytics, hr/AttritionPrediction, hr/EngagementOutcomeCorrelation, hr/EngagementSynthesizer |
| Datadog | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ArchitectureComplianceScanner |
| Datadog APM | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/SystemDependencyMapper |
| dbt | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/DataQualityScorecard |
| Degreed | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/SkillsGapAnalyzer |
| DocuSign CLM | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/NegotiationPrepAgent |
| E*Trade | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/EquityParticipantCommunicator, hr/TotalRewardsOptimizer |
| Egencia/Navan | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/TravelExpenseComplianceAgent |
| eMaint | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/MROFacilitiesOptimization |
| Engineering Change Orders | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/InnovationValueEngTracker |
| Engineering drawings | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SpecStandardizationAgent |
| Escalation Records | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/RelationshipHealthAnalyzer |
| EU Sanctions | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SanctionsWatchlistScreener |
| GA4 | 8 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/ABTestAnalyzer, marketing/ConversionRateOptimizer, marketing/CustomerJourneyMapper, marketing/LandingPageOptimizer |
| Gartner Peer Insights | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/CustomerVoiceMonitor |
| GCP Billing | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CloudCostOptimizer, it/ITBudgetForecastAgent |
| GCP Cloud Storage | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/BackupDRComplianceAgent |
| GCP Security Command Center | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CompliancePostureScanner |
| GitHub | 14 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ADRDrafter, it/APICatalogGovernance, it/ArchitectureComplianceScanner, it/CodeReviewAssistant |
| GitHub / GitLab | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CodeReviewAssistant |
| GitHub Actions | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CICDPipelineOptimizer |
| GitHub Dependabot | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/DependencyVulnerabilityScanner |
| GitLab | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CodeReviewAssistant |
| Google Admin | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/HRTechIntelligence |
| Google Ads | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/BudgetAllocatorForecaster, marketing/CampaignROIAnalyzer |
| Google BeyondCorp | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ZeroTrustPolicyEvaluator |
| Google Cloud | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/HRDataLakeQuery |
| Google Cloud AI | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/ResumeScreening |
| Google Meet | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/SelectionDebriefSummarizer |
| Google Sheets | 10 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/CalibrationAnalytics, hr/JobArchitectureSync, hr/MeritPromotionModeler, hr/OKRProgressTracker |
| Google Slides | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/LDPlanDrafter, hr/WorkforcePlanDrafter |
| Greenhouse | 7 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/CandidateSourcing, hr/InclusiveHiringAudit, hr/InterviewScheduling, hr/InterviewScorecardBuilder |
| HackerOne | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/PenTestFindingsTracker |
| HighRadius | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/CashApplicationAgent, finance/CollectionsPriorityEngine, finance/DisputeResolutionAgent, finance/DunningCommunicationDrafter |
| HubSpot | 10 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/CampaignROIAnalyzer, marketing/DataQualityGovernanceAgent, marketing/FunnelVelocityAnalyzer, marketing/LandingPageOptimizer |
| Icertis | 5 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ContractAuthoringAgent, procurement/ContractComplianceAuditor, procurement/NegotiationPrepAgent, procurement/ObligationMiningTracking |
| Innovation Management | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/InnovationValueEngTracker |
| Insurance Cert Management | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/InsuranceLiabilityMonitor |
| Intranet | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/CommunicationSentimentAnalyzer, hr/DEICommunicationProgramming, hr/EmployeeCommunicationDrafter |
| IRS TIN | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierOnboardingOrchestrator |
| Jaggaer | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CapabilityAssessmentAgent, procurement/RFxBuilderOrchestrator, procurement/SupplierPreQualScreener |
| Jenkins | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CICDPipelineOptimizer |
| Jira | 6 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/AuditEvidenceCollector, it/DeveloperExperienceSurveyor, it/DigitalTransformationTracker, it/ReleaseNotesGenerator |
| Jira Portfolio | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/PortfolioPrioritizationEngine |
| Jira Service Mgmt | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/IntelligentTicketRouter |
| Kofax | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ThreeWayMatchExceptionHandler |
| Kofax/Tungsten | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/InvoiceDataExtraction |
| Kubernetes | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CapacityPlanningAgent, it/IncidentAutoRemediator, it/KubernetesClusterOptimizer |
| Kyriba | 8 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/BankReconciliationAgent, finance/CashFlowForecaster, finance/CustomerPaymentPredictor, finance/FXExposureMonitor |
| Lattice | 6 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/FeedbackTrendAnalyzer, hr/GoalDraftingAssistant, hr/OKRProgressTracker, hr/OneOnOnePrep |
| LaunchDarkly | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/FeatureFlagManager |
| LeanData | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/LeadRoutingEngine |
| LeanIX | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ReferenceArchitectureGenerator, it/TechnologyLifecycleManager |
| Legal DB | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/ComplianceTrainingGenerator, hr/ERCaseIntelligence, hr/PolicyDraftingReview, hr/ProgressiveDisciplineAdvisor |
| Legal Playbook | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ClauseRiskAnalyzer |
| License Manager | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/HRTechIntelligence |
| LinkedIn | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/JobDescriptionOptimizer |
| LinkedIn Ads | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/ABMCampaignManager, marketing/PaidMediaOptimizer |
| LME | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CommodityPriceForecaster |
| LMS | 15 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/CompPhilosophyCommunicator, hr/ComplianceTrackingEscalation, hr/ComplianceTrainingGenerator, hr/DEICommunicationProgramming |
| Logistics Systems | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/TotalCostOwnershipModeler |
| Longview/OneSource | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/TaxProvisionCalculator |
| ManageEngine | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/DeviceLifecycleManager, it/EndpointSecurityPosture, it/OnboardingTechSetup |
| Marketo | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/CampaignBuilderOrchestrator, marketing/CampaignOpsWorkflowBuilder, marketing/LeadScoringQualificationAgent, marketing/ListManagementAgent |
| Maximo | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/MROFacilitiesOptimization |
| Mentoring Platform | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/HiPoDevelopmentJourney |
| Meta Ads | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/PaidMediaOptimizer |
| Moody's | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierRiskScoringEngine |
| NAVEX | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/ERCaseIntelligence |
| NMSDC | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierDiversityTracker |
| Okta | 12 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/AccessProvisioningOrchestrator, it/DeviceLifecycleManager, it/EndpointSecurityPosture, it/IdentityAccessAnomalyDetector |
| OneTrust | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ITControlTestingAgent, it/RegulatoryChangeMonitor, marketing/MarketingComplianceManager |
| Oracle | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/RequisitionIntakeRouting |
| Oracle ERP | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/DemandForecastingAggregation, procurement/RequisitionIntakeRouting |
| Oracle Financials | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/JournalEntryAutoPosting |
| P-card Data | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/TravelExpenseComplianceAgent |
| PagerDuty | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/IncidentAutoRemediator, it/IncidentToCodeTracer, it/MajorIncidentCoordinator, it/SLOSLIMonitorReporter |
| Palo Alto | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/NetworkDNSHealthMonitor, it/ShadowITDetector |
| Palo Alto Prisma | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ZeroTrustPolicyEvaluator |
| PLM Systems | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SpecStandardizationAgent |
| Punchout catalogs | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CatalogCurationRecommendation |
| Quality Management Systems | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/QualityIncidentAnalyzer |
| Qualtrics | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/EngagementSynthesizer, hr/ExitInterviewSynthesizer |
| Qualys | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/CompliancePostureScanner, it/VulnerabilityPrioritizationAgent |
| Recognition Platform | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/ERGImpact, hr/RecognitionNudge, hr/RecognitionProgramAnalytics |
| RevPro/Zuora | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/RevenueRecognitionEngine |
| RSA Archer | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ITControlTestingAgent, it/RiskRegisterAgent |
| Salesforce | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/DisputeResolutionAgent, marketing/InternalCommsDrafter |
| Salesforce CRM | 30 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/RevenueForecastingAgent, marketing/ABMCampaignManager, marketing/AnalystRelationsTracker, marketing/AudienceSegmentationEngine |
| Salesforce Marketing Cloud | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/CampaignBuilderOrchestrator, marketing/CampaignOpsWorkflowBuilder |
| SAP Ariba | 8 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/AgreementHierarchyTracker, procurement/BidEvaluationAnalyzer, procurement/CategoryStrategyGenerator, procurement/ProcurementPolicyAssistant |
| SAP Ariba Category Mgmt | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/CategoryStrategyGenerator |
| SAP Ariba Contracts | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ContractAuthoringAgent, procurement/RenewalExpiryMonitor |
| SAP Ariba Discovery | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierDiscoveryMatching |
| SAP Ariba e-Auction | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/AuctionStrategyAdvisor |
| SAP Ariba Sourcing | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/RFxBuilderOrchestrator |
| SAP BPC | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/BudgetBuilderConsolidation, hr/MeritPromotionModeler, hr/WorkforceCostModeling, hr/WorkforceScenarioModeling |
| SAP Fieldglass | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ServicesProcurementSOWManager |
| SAP GRC | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/ContinuousControlsMonitor, finance/SOXControlTestingAgent, procurement/AuditCorrectiveActionTracker, procurement/RegulatoryComplianceTracker |
| SAP QM (QM01/QM02) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/QualityIncidentAnalyzer |
| SAP S/4HANA | 25 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/AdHocQueryAgent, finance/CapExAnalyzer, finance/CloseChecklistOrchestrator, finance/ContinuousControlsMonitor |
| SAP S/4HANA (Asset Accounting) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/CapExAnalyzer |
| SAP S/4HANA (BOM/routing) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ShouldCostModeler |
| SAP S/4HANA (MIRO) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/InvoiceProcessingMatching |
| SAP S/4HANA (MIRO/MIR7) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ThreeWayMatchExceptionHandler |
| SAP S/4HANA (Vendor Master) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/VendorMasterDataManager |
| SAP S/4HANA (XK01) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierOnboardingOrchestrator |
| SAP S/4HANA CO | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/CostAllocationAgent, finance/ProductProfitabilityAnalyzer, finance/StandardCostVarianceAgent |
| SAP S/4HANA CO (PP) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/StandardCostVarianceAgent |
| SAP S/4HANA CO/FI | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/COGSReconciliationAgent |
| SAP S/4HANA FI | 32 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/APAgingAnalyzer, finance/APPolicyComplianceMonitor, finance/ARAgingDSOAnalyzer, finance/AccountReconciliationAgent |
| SAP S/4HANA FI (F110) | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/VendorPaymentOptimizer, procurement/PaymentOptimizationAgent |
| SAP S/4HANA FI/CO | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/RollingForecastEngine, finance/VarianceAnalysisAgent |
| SAP S/4HANA FI/MM | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SpendClassificationEnrichment |
| SAP S/4HANA Material Master | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SpecStandardizationAgent |
| SAP S/4HANA MM | 6 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/DeliveryPerformanceMonitor, procurement/DemandPatternAnalyzer, procurement/GoodsReceiptValidator, procurement/MROFacilitiesOptimization |
| SAP S/4HANA MM (ME21N) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/PurchaseOrderAutoGeneration |
| SAP S/4HANA MM (ME51N) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/RequisitionIntakeRouting |
| SAP S/4HANA MM (MIGO) | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/GoodsReceiptValidator |
| SAP S/4HANA MM/FI | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/InventoryValuationAgent |
| SAP S/4HANA MM/PP | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/DemandForecastingAggregation |
| SAP S/4HANA SD | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/ASC606ContractAnalyzer, finance/RevenueForecastingAgent, finance/SalesUseTaxAutomation |
| SAP SuccessFactors | 6 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/DataChangeOrchestrator, hr/HRISDataQualityMonitor, hr/JobArchitectureSync, hr/OrgStructureAnalyzer |
| SBA | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierDiversityTracker |
| ServiceNow | 25 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/AuditFindingTracker, hr/ComplianceTrackingEscalation, hr/DataChangeOrchestrator, hr/ERCaseAnalytics |
| ServiceNow CMDB | 4 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ADRDrafter, it/ArchitectureComplianceScanner, it/SystemDependencyMapper, it/TechnologyLifecycleManager |
| ServiceNow GRC | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/AuditEvidenceCollector, it/ITControlTestingAgent, it/RiskRegisterAgent |
| ServiceNow SAM | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/LicenseComplianceMonitor, it/TechnologyLifecycleManager, it/VendorRationalizationAgent |
| ServiceNow SPM | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/ITBudgetForecastAgent, it/PortfolioPrioritizationEngine |
| Skills DB | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/RestructuringImpactAssessment, hr/SkillsGapAnalyzer |
| Snyk | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/VulnerabilityPrioritizationAgent |
| Spend data | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/NegotiationPrepAgent |
| Spend Data | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ConcentrationRiskAnalyzer |
| Supplier Master | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ConcentrationRiskAnalyzer |
| Survey Platform | 5 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/ERGImpact, hr/ExitInterviewSynthesizer, hr/FeedbackTrendAnalyzer, hr/OnboardingEffectivenessAnalyzer |
| Syndio | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/PayEquityAudit |
| Tableau | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/DEIDashboard, hr/SuccessionPipelineDashboard |
| Taulia | 3 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/EarlyPaymentDiscountAgent, finance/VendorPaymentOptimizer, procurement/PaymentOptimizationAgent |
| Tax Systems | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/PayrollReconciliation |
| Tenable | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/VulnerabilityPrioritizationAgent |
| Terraform | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/IaCDriftDetector, it/IncidentAutoRemediator |
| Textio | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/JobDescriptionOptimizer |
| TMS | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/DeliveryPerformanceMonitor |
| Udemy | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/LearningPathRecommendation |
| Vendor Master | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierConsolidationAnalyzer |
| Visio | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/OrgStructureAnalyzer |
| VMI systems | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/MROFacilitiesOptimization |
| VMS platforms | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/ServicesProcurementSOWManager |
| WBENC | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplierDiversityTracker |
| Weather APIs | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | procurement/SupplyChainDisruptionMonitor |
| Web | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/VendorEvaluationAssistant |
| Workday | 73 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/HeadcountPlanningAgent, hr/AttritionAnalytics, hr/AttritionPrediction, hr/BenefitsAssistant |
| Workday Adaptive | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | finance/BudgetBuilderConsolidation |
| YouTube | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/LearningContentSummarizer |
| Zendesk | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | marketing/CommunityEngagementResponder |
| Zoom | 2 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | hr/InterviewScheduling, it/MajorIncidentCoordinator |
| Zylo | 1 | BigQuery table or API-backed operational mock | source records with IDs, status, timestamps, audit fields | it/VendorRationalizationAgent |

## Per Use Case

### finance/APAgingAnalyzer — AP Aging Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### finance/APPolicyComplianceMonitor — AP Policy Compliance Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ARAgingDSOAnalyzer — AR Aging & DSO Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ASC606ContractAnalyzer — ASC 606 Contract Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA SD | operational_system | read | OData | BigQuery table or API-backed operational mock |
| Contract Repository | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/AccountReconciliationAgent — Account Reconciliation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BlackLine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/AccrualsDeferralsEngine — Accruals & Deferrals Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| BlackLine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/AdHocQueryAgent — Ad-Hoc Query Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | read | REST API | BigQuery table |
| SAP S/4HANA | operational_system | read | OData | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/AuditFindingTracker — Audit Finding Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AuditBoard | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/AuditReportGenerator — Audit Report Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AuditBoard | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/BankReconciliationAgent — Bank Reconciliation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kyriba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Bank Portals | external_feed | read | SFTP / SWIFT | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/BoardDeckGenerator — Board Deck Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | read | Looker API | BigQuery table |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/BudgetBuilderConsolidation — Budget Builder & Consolidation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Anaplan | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| SAP BPC | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Workday Adaptive | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/COGSReconciliationAgent — COGS Reconciliation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA CO/FI | operational_system | bidirectional | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CapExAnalyzer — Capital Expenditure Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA (Asset Accounting) | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Anaplan | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CashApplicationAgent — Cash Application Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HighRadius | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Bank Portals | external_feed | read | SFTP | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CashFlowForecaster — Cash Flow Forecaster

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kyriba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Bloomberg | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CloseChecklistOrchestrator — Close Checklist Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BlackLine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| ServiceNow | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Slack | collaboration_event | bidirectional | Webhook | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CollectionsPriorityEngine — Collections Priority Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HighRadius | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| D&B | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ConsolidationEliminationAgent — Consolidation & Elimination Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BlackLine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ContinuousControlsMonitor — Continuous Controls Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP GRC | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CostAllocationAgent — Cost Allocation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA CO | operational_system | bidirectional | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CreditRiskScorer — Credit Risk Scorer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| D&B | analytics_warehouse | read | REST API | BigQuery table |
| Moody's | analytics_warehouse | read | REST API | BigQuery table |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/CustomerPaymentPredictor — Customer Payment Predictor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Kyriba | operational_system | write | REST API | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/DebtCovenantTracker — Debt Covenant Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Document Repository | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/DisputeResolutionAgent — Dispute Resolution Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HighRadius | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Salesforce | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/DunningCommunicationDrafter — Dunning Communication Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| HighRadius | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Email / CRM | collaboration_event | write | SMTP / REST API | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/DuplicateInvoiceDetector — Duplicate Invoice Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ESGSustainabilityReporter — ESG & Sustainability Reporter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workiva | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| CDP | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/EarlyPaymentDiscountAgent — Early Payment Discount Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Taulia | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| C2FO | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/FPAQueryAssistant — FP&A Query Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | read | Looker API | BigQuery table |
| Anaplan | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/FXExposureMonitor — FX Exposure Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kyriba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Bloomberg | external_feed | read | REST API | BigQuery raw/staged feed table |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/FinancialStatementGenerator — Financial Statement Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | OData | BigQuery table or API-backed operational mock |
| Workiva | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/FraudDetectionEngine — Fraud Detection Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/GLAnomalyDetector — GL Anomaly Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/HeadcountPlanningAgent — Headcount Planning Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Anaplan | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/IntercompanyNettingAgent — Intercompany Netting Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kyriba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/IntercompanyReconciliation — Intercompany Reconciliation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BlackLine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/InventoryValuationAgent — Inventory Valuation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM/FI | operational_system | bidirectional | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/InvestmentPortfolioOptimizer — Investment Portfolio Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kyriba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Bloomberg | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/InvestorRelationsPrepAgent — Investor Relations Prep Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Bloomberg | external_feed | read | REST API | BigQuery raw/staged feed table |
| S&P Capital IQ | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/InvoiceProcessingMatching — Invoice Processing & Matching

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA (MIRO) | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Basware | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Document AI | ai_or_model | read | gRPC | model/runtime dependency |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/JournalEntryAutoPosting — Journal Entry Auto-Posting

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Oracle Financials | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BlackLine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/KPIDashboardBuilder — KPI Dashboard Builder

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/LiquidityDashboard — Liquidity Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kyriba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ManagementReportingAgent — Management Reporting Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | read | REST API | BigQuery table |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/MonthEndCloseAnalytics — Month-End Close Analytics

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BlackLine | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/PeerBenchmarkingAgent — Peer Benchmarking Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| S&P Capital IQ | external_feed | read | REST API | BigQuery raw/staged feed table |
| Bloomberg | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/PolicyComplianceScanner — Policy Compliance Scanner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SharePoint/Google Drive | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| SAP S/4HANA | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ProductProfitabilityAnalyzer — Product Profitability Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA CO | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/RegulatoryChangeMonitor — Regulatory Change Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Bloomberg Tax | external_feed | read | REST API | BigQuery raw/staged feed table |
| CCH AnswerConnect | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/RegulatoryFilingOrchestrator — Regulatory Filing Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workiva | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| SEC EDGAR | external_feed | bidirectional | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/RevenueForecastingAgent — Revenue Forecasting Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA SD | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/RevenueRecognitionEngine — Revenue Recognition Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA SD/FI | document_store | bidirectional | OData | Cloud Storage + BigQuery documents_manifest |
| RevPro/Zuora | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/RiskAssessmentAgent — Risk Assessment Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AuditBoard | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/RollingForecastEngine — Rolling Forecast Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI/CO | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Anaplan | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/SOXControlTestingAgent — SOX Control Testing Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AuditBoard | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP GRC | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/SalesUseTaxAutomation — Sales & Use Tax Automation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Avalara | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex Tax | ai_or_model | bidirectional | REST API | model/runtime dependency |
| SAP S/4HANA SD | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/ScenarioModelingSensitivity — Scenario Modeling & Sensitivity

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Anaplan | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/StandardCostVarianceAgent — Standard Cost Variance Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA CO (PP) | operational_system | read | OData | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA CO | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/TaxAuditPrepAgent — Tax Audit Prep Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Document Management | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/TaxProvisionCalculator — Tax Provision Calculator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Longview/OneSource | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/TaxResearchAssistant — Tax Research Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| CCH AnswerConnect | external_feed | read | REST API | BigQuery raw/staged feed table |
| Bloomberg Tax | external_feed | read | REST API | BigQuery raw/staged feed table |
| Internal Tax Memos | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/TransferPricingMonitor — Transfer Pricing Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| OECD / Bureau van Dijk | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/TrialBalanceValidator — Trial Balance Validator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BlackLine | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### finance/VarianceAnalysisAgent — Variance Analysis Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI/CO | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Anaplan | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/VendorMasterDataManager — Vendor Master Data Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA (Vendor Master) | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| D&B (Dun & Bradstreet) | analytics_warehouse | read | REST API | BigQuery table |
| IRS TIN Matching | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| D&B | external_feed | read | unknown | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/VendorPaymentOptimizer — Vendor Payment Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI (F110) | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Kyriba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Taulia | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA FI | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### finance/WithholdingTaxAgent — Withholding Tax Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Tax Databases | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### hr/AttritionAnalytics — Attrition Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Culture Amp | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/AttritionPrediction — Attrition Prediction & Intervention

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Cloud AI | ai_or_model | bidirectional | Vertex AI SDK | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Culture Amp | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/BenefitsAssistant — Benefits Q&A & Enrollment

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Benefitfocus | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Drive | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Benefits Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Chat | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/BenefitsUtilizationAnalyzer — Benefits Utilization & Cost Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Benefits Carrier Data | operational_system | read | SFTP/REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Benefits Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Carrier Reports | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/CalibrationAnalytics — Calibration Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/CandidateSourcing — Candidate Sourcing & Outreach Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| LinkedIn | external_feed | bidirectional | REST API | BigQuery raw/staged feed table |
| Indeed | external_feed | read | REST API | BigQuery raw/staged feed table |
| Greenhouse | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/ChangeCommunicationDrafter — Change Communication Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Slack | collaboration_event | write | Slack API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/CommunicationSentimentAnalyzer — Communication Reach & Sentiment Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Slack | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Email (Gmail) | collaboration_event | read | Workspace API | BigQuery event table; optional API mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Intranet | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/CompPhilosophyCommunicator — Compensation Philosophy Communicator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/CompensationLetterGenerator — Compensation Letter Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/ComplianceTrackingEscalation — Compliance Tracking & Escalation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Cornerstone | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Email | collaboration_event | write | SMTP/Workspace API | BigQuery event table; optional API mock |
| Slack | collaboration_event | write | Slack API | BigQuery event table; optional API mock |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/ComplianceTrainingGenerator — Compliance Training Content Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Cornerstone | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Legal DB | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |

### hr/DEICommunicationProgramming — DEI Communication & Programming Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Intranet | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/DEIDashboard — DEI Dashboard & Reporting

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Tableau | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/DataChangeOrchestrator — Employee Data Change Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Active Directory | operational_system | write | LDAP/Graph API | BigQuery table or API-backed operational mock |
| SAP SuccessFactors | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/ERCaseAnalytics — ER Case Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Workday | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/ERCaseIntelligence — ER Case Intelligence

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| NAVEX | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Legal DB | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/ERGImpact — ERG Engagement & Impact

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | analytics_warehouse | read | REST API | BigQuery table |
| Slack | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Recognition Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Survey Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/EmployeeCommunicationDrafter — Employee Communication Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Intranet | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/EngagementOutcomeCorrelation — Engagement-to-Outcome Correlation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualtrics | analytics_warehouse | read | REST API | BigQuery table |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Finance System | analytics_warehouse | read | REST API | BigQuery table |
| Culture Amp | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/EngagementSynthesizer — Engagement Insight Synthesizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualtrics | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Culture Amp | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/EquityParticipantCommunicator — Equity Participant Communicator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Carta/Shareworks | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| E*Trade | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Carta | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/ExitInterviewSynthesizer — Exit Interview Insight Synthesizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualtrics | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Survey Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |

### hr/FeedbackTrendAnalyzer — Feedback Trend Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Lattice | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Survey Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/GoalDraftingAssistant — Goal Drafting & Alignment Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Lattice | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### hr/HRDataLakeQuery — HR Data Lake Query

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Google Cloud | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/HRISDataQualityMonitor — HRIS Data Quality Monitor Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP SuccessFactors | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| ServiceNow | operational_system | write | REST API | BigQuery table or API-backed operational mock |

### hr/HRTechIntelligence — HR Tech Stack Intelligence

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Gartner | external_feed | read | REST API | BigQuery raw/staged feed table |
| G2 | analytics_warehouse | read | REST API | BigQuery table |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ServiceNow | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Admin | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| License Manager | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/HiPoDevelopmentJourney — HiPo Development Journey Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Cornerstone | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |
| Mentoring Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/HiPoIdentification — HiPo Identification & Nomination Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| 360 Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/InclusiveHiringAudit — Inclusive Hiring Audit

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Greenhouse | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/InterviewScheduling — Interview Scheduling & Coordination

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Greenhouse | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Calendar | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Zoom | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/InterviewScorecardBuilder — Interview Question & Scorecard Builder

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Greenhouse | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | analytics_warehouse | write | Workspace API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Calendar | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/JobArchitectureSync — Job Architecture Sync Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP SuccessFactors | operational_system | bidirectional | OData API | BigQuery table or API-backed operational mock |
| Mercer | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/JobDescriptionOptimizer — Job Description Generator & Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Textio | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LinkedIn | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/LDPlanDrafter — L&D Plan Narrative Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Cornerstone | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Slides | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/LaborMarketIntelligence — Labor Market Intelligence

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| LinkedIn Talent Insights | external_feed | read | REST API | BigQuery raw/staged feed table |
| Lightcast | external_feed | read | REST API | BigQuery raw/staged feed table |
| BLS Data | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/LeadershipProgramDesign — Leadership Program Design Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Cornerstone | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |
| Assessment Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/LearningContentSummarizer — Learning Content Summarizer & Quiz Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Cornerstone | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Degreed | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Drive | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |
| YouTube | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/LearningPathRecommendation — Learning Path Recommendation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Cornerstone | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Degreed | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Udemy | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Coursera | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/LeaveAccommodationIntake — Leave & Accommodation Intake Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| AbsenceSoft | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ServiceNow | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Chat | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/LeaveUtilizationAnalyzer — Leave Utilization & Compliance Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Benefits Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/MarketBenchmarking — Market Benchmarking Analysis Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Mercer | external_feed | read | REST API | BigQuery raw/staged feed table |
| Radford | external_feed | read | REST API | BigQuery raw/staged feed table |
| Payscale | external_feed | read | REST API | BigQuery raw/staged feed table |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/MeritPromotionModeler — Merit & Promotion Budget Modeler Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Mercer | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP BPC | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/NewHireQA — New Hire Q&A Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Drive | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Chat | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Confluence | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/OKRProgressTracker — OKR Progress Tracker Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Lattice | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Jira | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/OffboardingOrchestration — Offboarding Orchestration

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | document_store | write | Admin SDK | Cloud Storage + BigQuery documents_manifest |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Active Directory | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/OfferPackageModeler — Offer Package Modeler Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Mercer | external_feed | read | REST API | BigQuery raw/staged feed table |
| Radford | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/OnboardingEffectivenessAnalyzer — Onboarding Effectiveness Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Survey Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/OnboardingOrchestration — Onboarding Orchestration

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | write | Slack API | BigQuery event table; optional API mock |
| Google Workspace | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/OneOnOnePrep — 1:1 Meeting Prep

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Lattice | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Calendar | collaboration_event | read | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/OrgStructureAnalyzer — Org Structure Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP SuccessFactors | operational_system | read | OData API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Visio | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/PIPDocumentation — PIP Documentation Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ServiceNow | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/PayEquityAudit — Pay Equity Audit

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Syndio | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/PayrollReconciliation — Payroll Reconciliation & Compliance Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ADP | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Tax Systems | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/PayrollValidation — Payroll Input Validation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ADP | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/PerformanceNarrative — Performance Review Narrative Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Lattice | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### hr/PolicyAssistant — Policy Q&A Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SharePoint/Google Drive | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Workday | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Chat | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Confluence | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |
| SharePoint | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |

### hr/PolicyDraftingReview — Policy Drafting & Review Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Legal DB | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| SharePoint | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |

### hr/PreboardingOrchestration — Pre-boarding Orchestration Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Slack | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/ProgramImpactEvaluation — Program Impact Evaluation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Cornerstone | analytics_warehouse | read | REST API | BigQuery table |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Survey Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/ProgressiveDisciplineAdvisor — Progressive Discipline Advisor Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Legal KB | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Legal DB | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/QueryResolution — Employee Query Resolution

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Drive | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Chat | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Knowledge Base | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |

### hr/RecognitionNudge — Recognition Nudge & Celebration

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Bonusly/Achievers | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Recognition Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/RecognitionProgramAnalytics — Recognition Program Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Bonusly/Achievers | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Recognition Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/RequisitionIntake — Requisition Intake & Validation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Greenhouse | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP SuccessFactors | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| ServiceNow | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/RequisitionPrioritization — Requisition Prioritization Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/RestructuringImpactAssessment — Restructuring Impact Assessment Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP BPC | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP SuccessFactors | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Skills DB | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/ResumeScreening — Resume Screening & Shortlisting

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Greenhouse | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | write | BigQuery SQL | BigQuery table |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Cloud AI | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/ReviewCycleOrchestration — Review Cycle Orchestration Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Lattice | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | write | Slack API | BigQuery event table; optional API mock |
| Email | collaboration_event | write | SMTP | BigQuery event table; optional API mock |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/SelectionDebriefSummarizer — Selection Debrief Summarizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Greenhouse | analytics_warehouse | read | REST API | BigQuery table |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google Meet | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/ServiceDeliveryAnalytics — Service Delivery Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Workday | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/SkillsGapAnalyzer — Skills Gap Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Cornerstone | analytics_warehouse | read | REST API | BigQuery table |
| Degreed | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Skills DB | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| LMS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/SourcingChannelAnalytics — Sourcing Channel Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Greenhouse | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| LinkedIn | analytics_warehouse | read | REST API | BigQuery table |
| Indeed | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| ATS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/SuccessionPipelineDashboard — Succession Pipeline Dashboard Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Tableau | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/SuccessorReadiness — Successor Readiness Assessment

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Assessment Platform | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/SurveyDesignCommunication — Survey Design & Communication Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualtrics | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Culture Amp | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Gmail | collaboration_event | read | unknown | BigQuery event table; optional API mock |

### hr/TotalRewardsOptimizer — Total Rewards Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Mercer | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| E*Trade | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### hr/VendorEvaluationAssistant — Vendor Evaluation Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Gartner | external_feed | read | REST API | BigQuery raw/staged feed table |
| G2 | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Web | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/WorkforceCostModeling — Workforce Cost Modeling

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP BPC | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |
| Google Sheets | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/WorkforcePlanDrafter — Workforce Plan Document Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Slides | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### hr/WorkforceScenarioModeling — Workforce Scenario Modeling

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP BPC | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Anaplan | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google BigQuery | analytics_warehouse | read | unknown | BigQuery table |

### it/ADRDrafter — ADR Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Confluence | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| GitHub | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow CMDB | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/AIEthicsBiasMonitor — AI Ethics & Bias Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Vertex AI | ai_or_model | read | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### it/APICatalogGovernance — API Catalog & Governance

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Apigee | analytics_warehouse | bidirectional | REST API | BigQuery table |
| GitHub | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Ardoq | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/AccessProvisioningOrchestrator — Access Provisioning Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ArchitectureComplianceScanner — Architecture Compliance Scanner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| GitHub | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SonarQube | analytics_warehouse | read | REST API | BigQuery table |
| ServiceNow CMDB | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Datadog | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/AuditEvidenceCollector — Audit Evidence Collector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow GRC | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Drive | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Jira | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/BackupDRComplianceAgent — Backup & DR Compliance Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AWS Backup | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GCP Cloud Storage | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Terraform | document_store | read | CLI / REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/CICDPipelineOptimizer — CI/CD Pipeline Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Jenkins | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GitHub Actions | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| ArgoCD | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/CapacityPlanningAgent — Capacity Planning Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kubernetes | operational_system | read | Kubernetes API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| AWS CloudWatch | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ChangeRiskAssessor — Change Risk Assessor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Jira | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| GitHub | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/CloudCostOptimizer — Cloud Cost Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AWS Cost Explorer | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GCP Billing | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/CodeReviewAssistant — Code Review Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| GitHub / GitLab | operational_system | bidirectional | GraphQL API | BigQuery table or API-backed operational mock |
| SonarQube | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GitHub | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| GitLab | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/CompliancePostureScanner — Compliance Posture Scanner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualys | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| AWS Security Hub | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GCP Security Command Center | operational_system | read | gRPC | BigQuery table or API-backed operational mock |
| CrowdStrike | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/CostPerQueryOptimizer — Cost-per-Query Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| BigQuery Admin | analytics_warehouse | read | REST API | BigQuery table |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DataCatalogLineageAgent — Data Catalog & Lineage Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Dataplex | analytics_warehouse | bidirectional | gRPC | BigQuery table |
| dbt | analytics_warehouse | read | CLI / REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DataPipelineHealthMonitor — Data Pipeline Health Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Apache Airflow | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| dbt | analytics_warehouse | bidirectional | CLI / REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DataQualityScorecard — Data Quality Scorecard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| dbt | operational_system | read | CLI / REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DatabasePerformanceAdvisor — Database Performance Advisor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| CloudSQL | operational_system | read | SQL / REST API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DependencyVulnerabilityScanner — Dependency Vulnerability Scanner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Snyk | analytics_warehouse | read | REST API | BigQuery table |
| GitHub Dependabot | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| NIST NVD | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GitHub | operational_system | write | GraphQL API | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DeveloperExperienceSurveyor — Developer Experience Surveyor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| GitHub | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| Jira | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DeviceLifecycleManager — Device Lifecycle Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ManageEngine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace Admin | collaboration_event | read | Workspace API | BigQuery event table; optional API mock |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Workspace | collaboration_event | read | unknown | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/DigitalTransformationTracker — Digital Transformation Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Jira | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/EndpointSecurityPosture — Endpoint Security Posture Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| CrowdStrike | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ManageEngine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/FeatureFlagManager — Feature Flag Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| LaunchDarkly | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GitHub | operational_system | bidirectional | GraphQL API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/FeatureStoreManager — Feature Store Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Vertex AI Feature Store | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ITBudgetForecastAgent — IT Budget Forecast Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| AWS Cost Explorer | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GCP Billing | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow SPM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ITControlTestingAgent — IT Control Testing Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow GRC | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| RSA Archer | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| OneTrust | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ITGRCDashboard — IT GRC Dashboard & Reporter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow GRC | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| RSA Archer | analytics_warehouse | read | REST API | BigQuery table |
| OneTrust | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ITOKRKPIDashboard — IT OKR & KPI Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | analytics_warehouse | read | REST API | BigQuery table |
| Jira | analytics_warehouse | read | REST API | BigQuery table |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ITSMAnalyticsDashboard — ITSM Analytics Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/IaCDriftDetector — IaC Drift Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Terraform | operational_system | bidirectional | CLI / REST API | BigQuery table or API-backed operational mock |
| AWS CloudFormation | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| GitHub | operational_system | bidirectional | GraphQL API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/IdentityAccessAnomalyDetector — Identity & Access Anomaly Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Okta | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | collaboration_event | read | Workspace API | BigQuery event table; optional API mock |
| CrowdStrike | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Chronicle SIEM | analytics_warehouse | bidirectional | gRPC | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Chronicle | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/IncidentAutoRemediator — Incident Auto-Remediator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| PagerDuty | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| Kubernetes | operational_system | bidirectional | Kubernetes API | BigQuery table or API-backed operational mock |
| Terraform | operational_system | read | CLI / REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/IncidentToCodeTracer — Incident-to-Code Tracer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| PagerDuty | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| GitHub | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Jira | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/IntegrationPatternAdvisor — Integration Pattern Advisor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Confluence | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Apigee | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Pub/Sub | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/IntelligentTicketRouter — Intelligent Ticket Router

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Jira Service Mgmt | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/KnowledgeBaseAutoResolver — Knowledge Base Auto-Resolver

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Confluence | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Workspace | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/KubernetesClusterOptimizer — Kubernetes Cluster Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kubernetes | operational_system | bidirectional | Kubernetes API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/LicenseComplianceMonitor — License Compliance Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow SAM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Zylo | analytics_warehouse | read | REST API | BigQuery table |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/MLModelRegistryMonitor — ML Model Registry & Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Vertex AI Model Registry | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| MLflow | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/MajorIncidentCoordinator — Major Incident Coordinator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| PagerDuty | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Zoom | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/MeetingRoomOptimizer — Meeting Room & Resource Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Calendar | collaboration_event | read | Workspace API | BigQuery event table; optional API mock |
| Google Workspace | collaboration_event | read | Workspace API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/NetworkDNSHealthMonitor — Network & DNS Health Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| AWS Route 53 | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Palo Alto | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/OnboardingTechSetup — Onboarding Tech Setup Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Workday | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| ManageEngine | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/PenTestFindingsTracker — Penetration Test Findings Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HackerOne | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Jira | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/PhishingEmailThreatAnalyzer — Phishing & Email Threat Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Workspace | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| CrowdStrike | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Chronicle SIEM | analytics_warehouse | bidirectional | gRPC | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Chronicle | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/PolicyLifecycleManager — Policy Lifecycle Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Confluence | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| ServiceNow GRC | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Workspace | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/PortfolioPrioritizationEngine — Portfolio Prioritization Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Jira Portfolio | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow SPM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ProblemManagementAnalyzer — Problem Management Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ReferenceArchitectureGenerator — Reference Architecture Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Confluence | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| GitHub | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| LeanIX | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/RegulatoryChangeMonitor — Regulatory Change Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Thomson Reuters | external_feed | read | REST API | BigQuery raw/staged feed table |
| OneTrust | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow GRC | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Confluence | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ReleaseNotesGenerator — Release Notes Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| GitHub | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| Jira | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Confluence | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/RiskRegisterAgent — Risk Register Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow GRC | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| RSA Archer | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/SIEMAlertTriageAgent — SIEM Alert Triage Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Chronicle SIEM | analytics_warehouse | read | gRPC | BigQuery table |
| Splunk | analytics_warehouse | read | REST API | BigQuery table |
| CrowdStrike | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/SLABreachPredictor — SLA Breach Predictor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/SLOSLIMonitorReporter — SLO/SLI Monitor & Reporter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Datadog | analytics_warehouse | read | REST API | BigQuery table |
| PagerDuty | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/SecurityIncidentResponder — Security Incident Responder

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| CrowdStrike | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Chronicle SIEM | analytics_warehouse | read | gRPC | BigQuery table |
| PagerDuty | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Splunk | analytics_warehouse | read | REST API | BigQuery table |
| Slack | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Chronicle | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/SelfServiceITBot — Self-Service IT Bot

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Slack | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ServiceCatalogRecommender — Service Catalog Recommender

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ShadowITDetector — Shadow IT Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Workspace | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Palo Alto | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| CrowdStrike | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/StrategicInitiativeQA — Strategic Initiative Q&A

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Confluence | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Jira | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/SystemDependencyMapper — System Dependency Mapper

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Datadog APM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow CMDB | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| GitHub | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Ardoq | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/TechDebtPrioritizer — Tech Debt Prioritizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SonarQube | analytics_warehouse | read | REST API | BigQuery table |
| GitHub | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| Jira | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/TechnologyLifecycleManager — Technology Lifecycle Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow CMDB | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ServiceNow SAM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| LeanIX | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/TechnologyRadarTrendScout — Technology Radar & Trend Scout

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| GitHub | operational_system | read | GraphQL API | BigQuery table or API-backed operational mock |
| Gartner API | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Confluence | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ThreatIntelligenceAggregator — Threat Intelligence Aggregator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| CrowdStrike Falcon | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Chronicle SIEM | analytics_warehouse | bidirectional | gRPC | BigQuery table |
| MITRE ATT&CK | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Splunk | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/VendorRationalizationAgent — Vendor Rationalization Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| ServiceNow SAM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Zylo | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/VulnerabilityPrioritizationAgent — Vulnerability Prioritization Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualys | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Tenable | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Snyk | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| CrowdStrike | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/WorkspaceAnalyticsAgent — Workspace Analytics Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Workspace | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Microsoft 365 | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Slack | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### it/ZeroTrustPolicyEvaluator — Zero Trust Policy Evaluator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Okta | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Palo Alto Prisma | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google BeyondCorp | operational_system | read | gRPC | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/ABMCampaignManager — ABM Campaign Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Demandbase | external_feed | read | REST API | BigQuery raw/staged feed table |
| 6sense | analytics_warehouse | read | REST API | BigQuery table |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| HubSpot | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| LinkedIn Ads | operational_system | write | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/ABTestAnalyzer — A/B Test Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Optimize | analytics_warehouse | bidirectional | REST API | BigQuery table |
| HubSpot | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/AdCopyGenerator — Ad Copy Generator & Tester

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Ads | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Meta Ads Manager | analytics_warehouse | bidirectional | REST API | BigQuery table |
| LinkedIn Ads | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/AnalystRelationsTracker — Analyst & Influencer Relations Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Cision | external_feed | read | REST API | BigQuery raw/staged feed table |
| LinkedIn | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Workspace | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### marketing/AudienceSegmentationEngine — Audience Segmentation Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| 6sense | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/BrandGuidelinesEnforcer — Brand Guidelines Enforcer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Bynder | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Figma | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Google Drive | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Canva | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/BrandHealthMonitor — Brand Health Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Brandwatch | analytics_warehouse | read | REST API | BigQuery table |
| Sprout Social | analytics_warehouse | read | REST API | BigQuery table |
| Google Trends | external_feed | read | REST API | BigQuery raw/staged feed table |
| SEMrush | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |

### marketing/BrandVoiceChecker — Brand Voice Checker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| WordPress | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Contentful | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| HubSpot | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/BudgetAllocatorForecaster — Budget Allocator & Forecaster

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Ads | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Meta Ads Manager | analytics_warehouse | read | REST API | BigQuery table |
| HubSpot | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Anaplan | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |

### marketing/CampaignBuilderOrchestrator — Campaign Builder & Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Marketo | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Salesforce Marketing Cloud | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CampaignCalendarOrchestrator — Campaign Calendar Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Asana | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Google Calendar | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |

### marketing/CampaignOpsWorkflowBuilder — Campaign Ops Workflow Builder

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Marketo | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Salesforce Marketing Cloud | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Slack | collaboration_event | bidirectional | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CampaignROIAnalyzer — Campaign ROI Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Ads | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### marketing/CommunityEngagementResponder — Community Engagement Responder

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Sprout Social | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Hootsuite | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Zendesk | operational_system | write | REST API | BigQuery table or API-backed operational mock |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CompetitiveBattleCards — Competitive Battle Card Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Gong | analytics_warehouse | read | REST API | BigQuery table |
| SEMrush | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| G2 | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Highspot | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CompetitiveIntelligenceMonitor — Competitive Intelligence Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SEMrush | analytics_warehouse | read | REST API | BigQuery table |
| Crayon | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google News API | external_feed | read | REST API | BigQuery raw/staged feed table |
| LinkedIn | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/ContentBriefGenerator — Content Brief Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SEMrush | analytics_warehouse | read | REST API | BigQuery table |
| Ahrefs | analytics_warehouse | read | REST API | BigQuery table |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| WordPress | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Docs | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/ContentPerformanceAnalyzer — Content Performance Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| HubSpot | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| SEMrush | analytics_warehouse | read | REST API | BigQuery table |
| WordPress | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | read | unknown | BigQuery table |

### marketing/ContentRepurposingAgent — Content Repurposing Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| WordPress | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Canva | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| HubSpot | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| LinkedIn | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/ConversionRateOptimizer — Conversion Rate Optimization Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| Hotjar | analytics_warehouse | read | REST API | BigQuery table |
| Google Optimize | analytics_warehouse | bidirectional | REST API | BigQuery table |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CreativeAssetGenerator — Creative Asset Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Figma | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Canva | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Bynder | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Google Drive | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CrisisCommsAdvisor — Crisis Communications Advisor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Brandwatch | analytics_warehouse | read | REST API | BigQuery table |
| Sprout Social | analytics_warehouse | read | REST API | BigQuery table |
| Google News API | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/CustomerJourneyMapper — Customer Journey Mapper

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| 6sense | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### marketing/CustomerVoiceMonitor — Customer Voice & Review Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| G2 | analytics_warehouse | read | REST API | BigQuery table |
| Trustpilot | external_feed | bidirectional | REST API | BigQuery raw/staged feed table |
| Gartner Peer Insights | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/DAMContentLifecycleManager — DAM & Content Lifecycle Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Bynder | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Brandfolder | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Google Drive | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| WordPress | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Contentful | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |

### marketing/DataQualityGovernanceAgent — Data Quality & Governance Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| HubSpot | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/EmailCopyOptimizer — Email Copy Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Marketo | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Salesforce Marketing Cloud | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/EmailDeliverabilityManager — Email Deliverability Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| Marketo | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Google Postmaster | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/ExecThoughtLeadership — Executive Thought Leadership Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| LinkedIn | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Google News API | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| WordPress | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/FunnelVelocityAnalyzer — Funnel Velocity Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### marketing/GTMLaunchPlanner — GTM Launch Planner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Asana | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Google Workspace | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/InfluencerDiscoveryTracker — Influencer Discovery & Tracking

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Sprout Social | analytics_warehouse | read | REST API | BigQuery table |
| LinkedIn | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| YouTube | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/InternalCommsDrafter — Internal Communications Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Workspace | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| Slack | collaboration_event | bidirectional | Webhook | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Salesforce | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/KeywordStrategyAgent — Keyword Strategy Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SEMrush | analytics_warehouse | read | REST API | BigQuery table |
| Ahrefs | analytics_warehouse | read | REST API | BigQuery table |
| Google Trends | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google Search Console | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### marketing/LandingPageOptimizer — Landing Page Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| WordPress | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Unbounce | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| HubSpot | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Optimize | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/LeadNurtureOptimizer — Lead Nurture Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Marketo | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/LeadRoutingEngine — Lead Routing & Assignment Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| LeanData | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/LeadScoringQualificationAgent — Lead Scoring & Qualification Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Marketo | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| 6sense | external_feed | read | REST API | BigQuery raw/staged feed table |
| Demandbase | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |

### marketing/ListManagementAgent — List Management & Segmentation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Marketo | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LinkedIn Ads | collaboration_event | write | REST API | BigQuery event table; optional API mock |

### marketing/LongFormContentDrafter — Long-Form Content Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| WordPress | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Contentful | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarTechHealthMonitor — MarTech Stack Health Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| HubSpot | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarketResearchSynthesizer — Market Research Synthesizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Gartner | external_feed | read | REST API | BigQuery raw/staged feed table |
| Forrester | external_feed | read | REST API | BigQuery raw/staged feed table |
| G2 | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Workspace | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarketTrendDetector — Market Trend & Signal Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Trends | external_feed | read | REST API | BigQuery raw/staged feed table |
| SEMrush | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| LinkedIn | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Google News API | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarketingComplianceManager — Marketing Compliance & Consent Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| OneTrust | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| HubSpot | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarketingDashboardGenerator — Marketing Dashboard Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### marketing/MarketingMixModeler — Marketing Mix Modeler

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Ads | analytics_warehouse | read | REST API | BigQuery table |
| Meta Ads | analytics_warehouse | read | REST API | BigQuery table |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarketingOKRTracker — Marketing OKR Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MarketingPlanGenerator — Marketing Plan Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Looker | analytics_warehouse | read | REST API | BigQuery table |
| Google Workspace | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/MultiTouchAttributionEngine — Multi-Touch Attribution Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### marketing/PPCBidManagementAgent — PPC Bid Management Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Ads | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Microsoft Ads | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/PaidMediaOptimizer — Paid Media Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Ads | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Meta Ads Manager | analytics_warehouse | bidirectional | REST API | BigQuery table |
| LinkedIn Ads | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| HubSpot | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Meta Ads | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### marketing/PersonaICPRefiner — Persona & ICP Refiner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| 6sense | external_feed | read | REST API | BigQuery raw/staged feed table |
| Clearbit | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/PredictivePipelineForecaster — Predictive Pipeline Forecaster

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| 6sense | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/PressReleaseDrafter — Press Release & Comms Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Docs | document_store | bidirectional | Workspace API | Cloud Storage + BigQuery documents_manifest |
| PR Newswire | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Cision | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| WordPress | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/SEOAuditEngine — SEO Audit & Recommendation Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Ahrefs | analytics_warehouse | read | REST API | BigQuery table |
| SEMrush | analytics_warehouse | read | REST API | BigQuery table |
| Google Search Console | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Jira | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/SalesEnablementContentAgent — Sales Enablement Content Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Highspot | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Google Workspace | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Slack | document_store | write | Webhook | Cloud Storage + BigQuery documents_manifest |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/SocialContentCalendarManager — Social Content Calendar Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Sprout Social | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Hootsuite | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| HubSpot | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Canva | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/SocialListeningAnalyzer — Social Listening & Sentiment Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Sprout Social | analytics_warehouse | read | REST API | BigQuery table |
| Brandwatch | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/SocialMediaAnalyticsDashboard — Social Media Analytics Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Sprout Social | analytics_warehouse | read | REST API | BigQuery table |
| Hootsuite | analytics_warehouse | read | REST API | BigQuery table |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### marketing/TechnicalSEOMonitor — Technical SEO Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Search Console | analytics_warehouse | read | REST API | BigQuery table |
| Ahrefs | analytics_warehouse | read | REST API | BigQuery table |
| Screaming Frog | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/UGCAdvocacyManager — UGC & Advocacy Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Sprout Social | analytics_warehouse | read | REST API | BigQuery table |
| HubSpot | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Salesforce CRM | analytics_warehouse | read | REST API | BigQuery table |
| Google Drive | document_store | write | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/UTMGovernanceAgent — UTM & Tracking Governance Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | analytics_warehouse | bidirectional | REST API | BigQuery table |
| HubSpot | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Sheets | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |

### marketing/WebinarEventEngine — Webinar & Event Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Zoom | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| HubSpot | collaboration_event | bidirectional | REST API | BigQuery event table; optional API mock |
| Salesforce CRM | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Calendar | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/WebsitePersonalizationEngine — Website Personalization Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Google Optimize | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Google Analytics 4 | analytics_warehouse | read | REST API | BigQuery table |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| HubSpot | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| GA4 | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### marketing/WinLossAnalysisAgent — Win/Loss Analysis Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Salesforce CRM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Gong | analytics_warehouse | read | REST API | BigQuery table |
| Google Workspace | collaboration_event | bidirectional | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Slack | collaboration_event | write | Webhook | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/AgreementHierarchyTracker — Agreement Hierarchy Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| DocuSign CLM | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/ApprovalWorkflowOptimizer — Approval Workflow Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa/Ariba Workflow | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/AuctionStrategyAdvisor — Auction Strategy Advisor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Ariba e-Auction | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Coupa | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/AuditCorrectiveActionTracker — Audit & Corrective Action Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP GRC | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Ariba SLP | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| CAPA Tracking | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Email | collaboration_event | write | SMTP | BigQuery event table; optional API mock |
| Audit Tools | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/BackgroundSanctionsScreener — Background & Sanctions Screener

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| LexisNexis | external_feed | read | REST API | BigQuery raw/staged feed table |
| OFAC/SDN | external_feed | read | REST API | BigQuery raw/staged feed table |
| World-Check | external_feed | read | REST API | BigQuery raw/staged feed table |
| Dun & Bradstreet | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google News | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| D&B | external_feed | read | unknown | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/BenchmarkIntelligenceAgent — Benchmark Intelligence Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Hackett | analytics_warehouse | read | REST API | BigQuery table |
| CAPS/Gartner | analytics_warehouse | read | REST API | BigQuery table |
| Ardent Partners | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| CAPS | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Gartner | external_feed | read | unknown | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/BidEvaluationAnalyzer — Bid Evaluation & Scenario Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Excel Imports | collaboration_event | read | File Import | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/BusinessReviewPrepAgent — Business Review Prep Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Scorecard Data | analytics_warehouse | read | REST API | BigQuery table |
| Contract Data | analytics_warehouse | read | REST API | BigQuery table |
| Market Intelligence | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/CapabilityAssessmentAgent — Capability Assessment Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Ariba SLP | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Jaggaer | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/CatalogCurationRecommendation — Catalog Curation & Recommendation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa Catalog | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Amazon Business | operational_system | read | Punchout/cXML | BigQuery table or API-backed operational mock |
| Ariba Catalog | operational_system | read | cXML | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Punchout catalogs | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Ariba | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/CategoryRoadmapPlanner — Category Roadmap Planner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Category Strategy Docs | document_store | read | RAG Pipeline | Cloud Storage + BigQuery documents_manifest |
| Savings Pipeline | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Market Intel Feeds | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/CategorySpendDashboard — Category Spend Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa Analytics | analytics_warehouse | read | REST API | BigQuery table |
| SAP Ariba Analytics | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/CategoryStrategyGenerator — Category Strategy Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| S&P Global Platts | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| SAP Ariba Category Mgmt | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ClauseRiskAnalyzer — Clause Risk Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| DocuSign CLM | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Legal Playbook | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/CommodityPriceForecaster — Commodity Price Forecaster

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| S&P Global Platts | external_feed | read | REST API | BigQuery raw/staged feed table |
| ICIS | external_feed | read | REST API | BigQuery raw/staged feed table |
| Mintec | external_feed | read | REST API | BigQuery raw/staged feed table |
| LME/CBOT | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| LME | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| CBOT | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ConcentrationRiskAnalyzer — Concentration Risk Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Spend Data | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Supplier Master | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Contract Data | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ContractAnalyticsDashboard — Contract Analytics Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis Analytics | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/ContractAuthoringAgent — Contract Authoring Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| DocuSign CLM | document_store | write | REST API | Cloud Storage + BigQuery documents_manifest |
| Agiloft | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba Contracts | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ContractComplianceAuditor — Contract Compliance Auditor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/DeliveryPerformanceMonitor — Delivery Performance Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| TMS | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ASN Data | operational_system | read | EDI/REST | BigQuery table or API-backed operational mock |
| IoT/GPS Tracking | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/DemandForecastingAggregation — Demand Forecasting & Aggregation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM/PP | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Oracle ERP | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/DemandPatternAnalyzer — Demand Pattern Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/DuplicatePaymentDetector — Duplicate Payment Detector

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa Pay | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/FinancialHealthAssessor — Financial Health Assessor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| RapidRatings | analytics_warehouse | read | REST API | BigQuery table |
| Dun & Bradstreet | analytics_warehouse | read | REST API | BigQuery table |
| Moody's | external_feed | read | REST API | BigQuery raw/staged feed table |
| SEC EDGAR | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| D&B | external_feed | read | unknown | BigQuery raw/staged feed table |

### procurement/ForceMajeureAdvisor — Force Majeure Advisor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Contract Repository | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Legal Knowledge Base | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/GoodsReceiptValidator — Goods Receipt & Service Entry Validator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| WMS | analytics_warehouse | read | REST API | BigQuery table |
| IoT/RFID | analytics_warehouse | read | MQTT/REST | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA MM (MIGO) | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/InnovationValueEngTracker — Innovation & Value Engineering Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Supplier Portal | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Innovation Management | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Contract Data | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Engineering Change Orders | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/InsuranceLiabilityMonitor — Insurance & Liability Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Insurance Cert Management | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Contract System | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Supplier Portal | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Google Document AI | ai_or_model | bidirectional | REST API | model/runtime dependency |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/InvoiceDataExtraction — Invoice Data Extraction

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Kofax/Tungsten | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Basware | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Google Document AI | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/MROFacilitiesOptimization — MRO & Facilities Optimization

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Maximo | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| eMaint | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Coupa | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| VMI systems | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/MakeVsBuyAnalyzer — Make-vs-Buy Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Market Benchmarks | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/MarketIntelligenceMonitor — Market Intelligence Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| S&P Global Platts | external_feed | read | REST API | BigQuery raw/staged feed table |
| ICIS | external_feed | read | REST API | BigQuery raw/staged feed table |
| Mintec | analytics_warehouse | read | REST API | BigQuery table |
| Google News API | external_feed | read | REST API | BigQuery raw/staged feed table |
| Dun & Bradstreet | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |

### procurement/MaverickSpendDetectorNudge — Maverick Spend Detector & Nudge

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa/Ariba Catalog | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Slack/Email | collaboration_event | write | Webhook/SMTP | BigQuery event table; optional API mock |

### procurement/NegotiationPrepAgent — Negotiation Prep Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| DocuSign CLM | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Market Intel Feeds | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Spend data | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Market intel | external_feed | read | unknown | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ObligationMiningTracking — Obligation Mining & Tracking

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| DocuSign CLM | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Google Calendar | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Asana/Jira | collaboration_event | write | REST API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/P2PCycleTimeAnalyzer — P2P Cycle Time Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Celonis | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/PCardReconciliationAgent — P-Card Reconciliation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Citibank/JP Morgan | operational_system | read | SFTP/API | BigQuery table or API-backed operational mock |
| SAP Concur | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Coupa | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Google Document AI | ai_or_model | read | gRPC | model/runtime dependency |
| Citibank/JP Morgan Commercial Card | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/PaymentOptimizationAgent — Payment Optimization Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Taulia | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| C2FO | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Treasury Systems | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA FI (F110) | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/PriceVarianceAnalyzer — Price Variance Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Contract System | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ProcurementKPIDashboard — Procurement KPI Dashboard

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | bidirectional | Looker API | BigQuery table |
| Coupa | analytics_warehouse | read | REST API | BigQuery table |
| SAP Ariba | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/ProcurementMaturityAssessor — Procurement Maturity Assessor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Survey Tools | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Internal Process Metrics | analytics_warehouse | read | REST API | BigQuery table |
| Benchmark Databases | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/ProcurementPolicyAssistant — Procurement Policy Assistant

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SharePoint/Google Drive | document_store | read | Graph API / Drive API | Cloud Storage + BigQuery documents_manifest |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ProcurementValueReporter — Procurement Value Reporter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | read | Looker API | BigQuery table |
| Google Slides | collaboration_event | write | Workspace API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/PurchaseOrderAutoGeneration — Purchase Order Auto-Generation

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| EDI/Supplier Portal | collaboration_event | write | EDI/cXML | BigQuery event table; optional API mock |
| SAP S/4HANA MM (ME21N) | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Ariba | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/QualityIncidentAnalyzer — Quality Incident Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP QM (QM01/QM02) | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Quality Management Systems | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| CAPA Tools | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/RFxBuilderOrchestrator — RFx Builder & Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Ariba Sourcing | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Jaggaer | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Coupa Sourcing | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Email / Supplier Portal | collaboration_event | bidirectional | SMTP/REST | BigQuery event table; optional API mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/RedlineComparisonAgent — Redline Comparison Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| DocuSign CLM | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| Microsoft Word | document_store | read | File API | Cloud Storage + BigQuery documents_manifest |
| Google Docs | document_store | read | Workspace API | Cloud Storage + BigQuery documents_manifest |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/RegulatoryComplianceTracker — Regulatory Compliance Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| MetricStream | analytics_warehouse | read | REST API | BigQuery table |
| SAP GRC | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Regulatory Feeds | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/RelationshipHealthAnalyzer — Relationship Health Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Email Metadata | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Meeting Logs | collaboration_event | read | REST API | BigQuery event table; optional API mock |
| Escalation Records | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Survey Data | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/RenewalExpiryMonitor — Renewal & Expiry Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Icertis | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba Contracts | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | analytics_warehouse | read | REST API | BigQuery table |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/RequisitionIntakeRouting — Requisition Intake & Smart Routing

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA MM | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Oracle ERP | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| SAP S/4HANA MM (ME51N) | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Oracle | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/SanctionsWatchlistScreener — Sanctions & Watchlist Screener

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| OFAC/SDN | external_feed | read | REST API | BigQuery raw/staged feed table |
| World-Check | external_feed | read | REST API | BigQuery raw/staged feed table |
| LexisNexis | external_feed | read | REST API | BigQuery raw/staged feed table |
| Dow Jones Risk & Compliance | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| EU Sanctions | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/SavingsPipelineTracker — Savings Pipeline Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | Looker API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/SavingsRealizationTracker — Savings Realization Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ServicesProcurementSOWManager — Services Procurement & SOW Manager

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Fieldglass | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Beeline | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Contract System | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| VMS platforms | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/ShouldCostModeler — Should-Cost Modeler

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Commodity Price Feeds | external_feed | read | REST API | BigQuery raw/staged feed table |
| Industry Benchmarks | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA (BOM/routing) | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SoleSourceJustification — Sole/Single Source Justification Drafter

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Policy Documents | document_store | read | RAG Pipeline | Cloud Storage + BigQuery documents_manifest |
| Supplier Databases | external_feed | read | REST API | BigQuery raw/staged feed table |
| ThomasNet | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Policy docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |
| Market research | external_feed | read | unknown | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SourcingChannelOptimizer — Sourcing Channel Optimizer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa Catalog | analytics_warehouse | read | REST API | BigQuery table |
| Amazon Business | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/SpecStandardizationAgent — Specification Standardization Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| PLM Systems | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| SAP S/4HANA Material Master | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Engineering drawings | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SpendClassificationEnrichment — Spend Classification & Enrichment

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA FI/MM | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SpendHQ | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Sievo | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | write | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/SpendCubeBuilderEnrichment — Spend Cube Builder & Enrichment

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Ariba | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SpendHQ | analytics_warehouse | bidirectional | REST API | BigQuery table |
| Sievo | analytics_warehouse | bidirectional | REST API | BigQuery table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |

### procurement/SpotBuyNegotiationAgent — Spot Buy Negotiation Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Coupa | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Amazon Business | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Supplier Marketplaces | external_feed | read | REST API | BigQuery raw/staged feed table |
| Email API | collaboration_event | write | SMTP/API | BigQuery event table; optional API mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |

### procurement/StakeholderSatisfactionAnalyzer — Stakeholder Satisfaction Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Qualtrics | analytics_warehouse | read | REST API | BigQuery table |
| ServiceNow | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Email Data | collaboration_event | read | Gmail API | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SubTierVisibilityAgent — Sub-Tier Visibility Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Resilinc | external_feed | read | REST API | BigQuery raw/staged feed table |
| Everstream | analytics_warehouse | read | REST API | BigQuery table |
| CMRT/CRT Questionnaires | collaboration_event | read | File Upload | BigQuery event table; optional API mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SupplierConsolidationAnalyzer — Supplier Consolidation Analyzer

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Contract System | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vendor Master | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Contract Data | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SupplierDevelopmentPlanner — Supplier Development Planner

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Scorecard Data | analytics_warehouse | read | REST API | BigQuery table |
| Capability Assessments | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Industry Benchmarks | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SupplierDiscoveryMatching — Supplier Discovery & Matching

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Ariba Discovery | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| ThomasNet | external_feed | read | REST API | BigQuery raw/staged feed table |
| Dun & Bradstreet | external_feed | read | REST API | BigQuery raw/staged feed table |
| Google Search API | analytics_warehouse | read | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| D&B | external_feed | read | unknown | BigQuery raw/staged feed table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SupplierDiversityTracker — Supplier Diversity Tracker

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Supplier.io | external_feed | read | REST API | BigQuery raw/staged feed table |
| NMSDC/WBENC/SBA | external_feed | read | REST API | BigQuery raw/staged feed table |
| Ariba/Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| NMSDC | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| WBENC | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| SBA | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/SupplierOnboardingOrchestrator — Supplier Onboarding Orchestrator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA (XK01) | operational_system | write | RFC/BAPI | BigQuery table or API-backed operational mock |
| Ariba SLP | document_store | read | REST API | Cloud Storage + BigQuery documents_manifest |
| IRS TIN Matching | external_feed | read | REST API | BigQuery raw/staged feed table |
| Banking Systems | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| IRS TIN | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/SupplierPreQualScreener — Supplier Pre-Qualification Screener

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Ariba SLP | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Jaggaer | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Dun & Bradstreet | external_feed | read | REST API | BigQuery raw/staged feed table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| D&B | external_feed | read | unknown | BigQuery raw/staged feed table |

### procurement/SupplierRiskScoringEngine — Supplier Risk Scoring Engine

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Dun & Bradstreet | analytics_warehouse | read | REST API | BigQuery table |
| RapidRatings | external_feed | read | REST API | BigQuery raw/staged feed table |
| Resilinc | external_feed | read | REST API | BigQuery raw/staged feed table |
| BitSight | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| D&B | external_feed | read | unknown | BigQuery raw/staged feed table |
| Moody's | operational_system | read | unknown | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/SupplierScorecardGenerator — Supplier Scorecard Generator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA QM/MM | analytics_warehouse | read | REST API | BigQuery table |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Looker | analytics_warehouse | write | REST API | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Supplier Portal | analytics_warehouse | write | REST API | BigQuery table |

### procurement/SupplyChainDisruptionMonitor — Supply Chain Disruption Monitor

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| Resilinc | external_feed | read | REST API | BigQuery raw/staged feed table |
| Everstream | analytics_warehouse | read | REST API | BigQuery table |
| Google News API | external_feed | read | REST API | BigQuery raw/staged feed table |
| Maritime AIS | external_feed | read | REST API | BigQuery raw/staged feed table |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Weather APIs | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/TailSpendClassifier — Tail Spend Classifier & Opportunity Finder

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/ThreeWayMatchExceptionHandler — Three-Way Match Exception Handler

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | bidirectional | RFC/BAPI | BigQuery table or API-backed operational mock |
| Coupa Pay | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Basware | operational_system | bidirectional | REST API | BigQuery table or API-backed operational mock |
| Kofax | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| BigQuery | analytics_warehouse | read | BigQuery SQL | BigQuery table |
| SAP S/4HANA (MIRO/MIR7) | operational_system | read | unknown | BigQuery table or API-backed operational mock |

### procurement/TotalCostOwnershipModeler — Total Cost of Ownership Modeler

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP S/4HANA | operational_system | read | RFC/BAPI | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Logistics Systems | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

### procurement/TravelExpenseComplianceAgent — Travel & Expense Compliance Agent

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| SAP Concur | document_store | bidirectional | REST API | Cloud Storage + BigQuery documents_manifest |
| Egencia/Navan | operational_system | read | REST API | BigQuery table or API-backed operational mock |
| P-card Data | operational_system | read | SFTP/API | BigQuery table or API-backed operational mock |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| Policy docs | document_store | read | unknown | Cloud Storage + BigQuery documents_manifest |

### procurement/WhatIfScenarioSimulator — What-If Scenario Simulator

| System | Kind | Direction | Protocol | Mock Target |
| --- | --- | --- | --- | --- |
| BigQuery | analytics_warehouse | bidirectional | BigQuery SQL | BigQuery table |
| Vertex AI (Gemini) | ai_or_model | bidirectional | gRPC | model/runtime dependency |
| S&P Global Platts | analytics_warehouse | read | REST API | BigQuery table |
| SAP S/4HANA | analytics_warehouse | read | RFC/BAPI | BigQuery table |
| Vertex AI | ai_or_model | read | unknown | model/runtime dependency |

