import React from "react";
import { ChallengeSlide } from "../components/slides/story/ChallengeSlide";
import { SolutionSlide } from "../components/slides/story/SolutionSlide";
import { PeriodicTableSlide } from "../components/slides/story/PeriodicTableSlide";
import { DepartmentLandingSlide } from "../components/slides/story/DepartmentLandingSlide";

import { LandingSlide } from "../components/slides/story/LandingSlide";
import { PersonasSlide } from "../components/slides/story/PersonasSlide";
import { RACISlide } from "../components/slides/story/RACISlide";
import { DayInLifeSlide } from "../components/slides/story/DayInLifeSlide";
import { TransformationBlueprintSlide } from "../components/slides/story/TransformationBlueprintSlide";
import { HRTechLandscapeSlide } from "../components/slides/story/HRTechLandscapeSlide";
import { SectionDividerSlide } from "../components/slides/story/SectionDividerSlide";
import { ClosingCTASlide } from "../components/slides/story/ClosingCTASlide";
import { DeployYourOwnSlide } from "../components/onboarding/DeployYourOwnSlide";

// Architecture & Evolution
import { AgentEvolutionSlide } from "../components/slides/story/AgentEvolutionSlide";
import { IntegrationArchitectureSlide } from "../components/slides/story/IntegrationArchitectureSlide";

// Build & Impact
import { BuildTalentScoutSlide } from "../components/slides/story/BuildTalentScoutSlide";
import { BuildPeoplePartnerSlide } from "../components/slides/story/BuildPeoplePartnerSlide";
import { BuildOpsArchitectSlide } from "../components/slides/story/BuildOpsArchitectSlide";
import { ImpactSlide } from "../components/slides/story/ImpactSlide";
import { RoadmapSlide } from "../components/slides/story/RoadmapSlide";
import { ClosingSlide } from "../components/slides/story/ClosingSlide";

// Icons for section dividers
import { Users, AlertTriangle, Lightbulb, Wrench, Map, BarChart3, Rocket, Briefcase, Calculator, Monitor, Megaphone } from "lucide-react";

// ═══════════════════════════════════════════════════════
// LAZY-LOADED COMPONENTS (code-split)
// ═══════════════════════════════════════════════════════

const LazyFallback = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="animate-pulse text-secondary/40 text-sm font-headline">Loading...</div>
  </div>
);

const WorkforcePlanningCatalog = React.lazy(() => import("../components/slides/domains/hr/WorkforcePlanningCatalog").then(m => ({ default: m.WorkforcePlanningCatalog })));
const TalentAcquisitionCatalog = React.lazy(() => import("../components/slides/domains/hr/TalentAcquisitionCatalog").then(m => ({ default: m.TalentAcquisitionCatalog })));
const PerformanceManagementCatalog = React.lazy(() => import("../components/slides/domains/hr/PerformanceManagementCatalog").then(m => ({ default: m.PerformanceManagementCatalog })));
const TotalRewardsCatalog = React.lazy(() => import("../components/slides/domains/hr/TotalRewardsCatalog").then(m => ({ default: m.TotalRewardsCatalog })));
const LearningDevelopmentCatalog = React.lazy(() => import("../components/slides/domains/hr/LearningDevelopmentCatalog").then(m => ({ default: m.LearningDevelopmentCatalog })));
const EmployeeRelationsCatalog = React.lazy(() => import("../components/slides/domains/hr/EmployeeRelationsCatalog").then(m => ({ default: m.EmployeeRelationsCatalog })));
const EmployeeEngagementCatalog = React.lazy(() => import("../components/slides/domains/hr/EmployeeEngagementCatalog").then(m => ({ default: m.EmployeeEngagementCatalog })));
const HROperationsCatalog = React.lazy(() => import("../components/slides/domains/hr/HROperationsCatalog").then(m => ({ default: m.HROperationsCatalog })));
const DEIBelongingCatalog = React.lazy(() => import("../components/slides/domains/hr/DEIBelongingCatalog").then(m => ({ default: m.DEIBelongingCatalog })));
const PeopleAnalyticsCatalog = React.lazy(() => import("../components/slides/domains/hr/PeopleAnalyticsCatalog").then(m => ({ default: m.PeopleAnalyticsCatalog })));
const WorkforceScenarioModeling = React.lazy(() => import("../components/slides/use-cases/hr/WorkforceScenarioModeling").then(m => ({ default: m.WorkforceScenarioModeling })));
const LaborMarketIntelligence = React.lazy(() => import("../components/slides/use-cases/hr/LaborMarketIntelligence").then(m => ({ default: m.LaborMarketIntelligence })));
const WorkforcePlanDrafter = React.lazy(() => import("../components/slides/use-cases/hr/WorkforcePlanDrafter").then(m => ({ default: m.WorkforcePlanDrafter })));
const OrgStructureAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/OrgStructureAnalyzer").then(m => ({ default: m.OrgStructureAnalyzer })));
const ChangeCommunicationDrafter = React.lazy(() => import("../components/slides/use-cases/hr/ChangeCommunicationDrafter").then(m => ({ default: m.ChangeCommunicationDrafter })));
const RestructuringImpactAssessment = React.lazy(() => import("../components/slides/use-cases/hr/RestructuringImpactAssessment").then(m => ({ default: m.RestructuringImpactAssessment })));
const JobDescriptionOptimizer = React.lazy(() => import("../components/slides/use-cases/hr/JobDescriptionOptimizer").then(m => ({ default: m.JobDescriptionOptimizer })));
const JobArchitectureSync = React.lazy(() => import("../components/slides/use-cases/hr/JobArchitectureSync").then(m => ({ default: m.JobArchitectureSync })));
const RequisitionIntake = React.lazy(() => import("../components/slides/use-cases/hr/RequisitionIntake").then(m => ({ default: m.RequisitionIntake })));
const RequisitionPrioritization = React.lazy(() => import("../components/slides/use-cases/hr/RequisitionPrioritization").then(m => ({ default: m.RequisitionPrioritization })));
const CandidateSourcing = React.lazy(() => import("../components/slides/use-cases/hr/CandidateSourcing").then(m => ({ default: m.CandidateSourcing })));
const ResumeScreening = React.lazy(() => import("../components/slides/use-cases/hr/ResumeScreening").then(m => ({ default: m.ResumeScreening })));
const SourcingChannelAnalytics = React.lazy(() => import("../components/slides/use-cases/hr/SourcingChannelAnalytics").then(m => ({ default: m.SourcingChannelAnalytics })));
const InterviewScorecardBuilder = React.lazy(() => import("../components/slides/use-cases/hr/InterviewScorecardBuilder").then(m => ({ default: m.InterviewScorecardBuilder })));
const InterviewScheduling = React.lazy(() => import("../components/slides/use-cases/hr/InterviewScheduling").then(m => ({ default: m.InterviewScheduling })));
const SelectionDebriefSummarizer = React.lazy(() => import("../components/slides/use-cases/hr/SelectionDebriefSummarizer").then(m => ({ default: m.SelectionDebriefSummarizer })));
const OfferPackageModeler = React.lazy(() => import("../components/slides/use-cases/hr/OfferPackageModeler").then(m => ({ default: m.OfferPackageModeler })));
const PreboardingOrchestration = React.lazy(() => import("../components/slides/use-cases/hr/PreboardingOrchestration").then(m => ({ default: m.PreboardingOrchestration })));
const OnboardingOrchestration = React.lazy(() => import("../components/slides/use-cases/hr/OnboardingOrchestration").then(m => ({ default: m.OnboardingOrchestration })));
const NewHireQA = React.lazy(() => import("../components/slides/use-cases/hr/NewHireQA").then(m => ({ default: m.NewHireQA })));
const OnboardingEffectivenessAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/OnboardingEffectivenessAnalyzer").then(m => ({ default: m.OnboardingEffectivenessAnalyzer })));
const GoalDraftingAssistant = React.lazy(() => import("../components/slides/use-cases/hr/GoalDraftingAssistant").then(m => ({ default: m.GoalDraftingAssistant })));
const OKRProgressTracker = React.lazy(() => import("../components/slides/use-cases/hr/OKRProgressTracker").then(m => ({ default: m.OKRProgressTracker })));
const OneOnOnePrep = React.lazy(() => import("../components/slides/use-cases/hr/OneOnOnePrep").then(m => ({ default: m.OneOnOnePrep })));
const FeedbackTrendAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/FeedbackTrendAnalyzer").then(m => ({ default: m.FeedbackTrendAnalyzer })));
const PerformanceNarrative = React.lazy(() => import("../components/slides/use-cases/hr/PerformanceNarrative").then(m => ({ default: m.PerformanceNarrative })));
const CalibrationAnalytics = React.lazy(() => import("../components/slides/use-cases/hr/CalibrationAnalytics").then(m => ({ default: m.CalibrationAnalytics })));
const ReviewCycleOrchestration = React.lazy(() => import("../components/slides/use-cases/hr/ReviewCycleOrchestration").then(m => ({ default: m.ReviewCycleOrchestration })));
const SuccessorReadiness = React.lazy(() => import("../components/slides/use-cases/hr/SuccessorReadiness").then(m => ({ default: m.SuccessorReadiness })));
const SuccessionPipelineDashboard = React.lazy(() => import("../components/slides/use-cases/hr/SuccessionPipelineDashboard").then(m => ({ default: m.SuccessionPipelineDashboard })));
const HiPoIdentification = React.lazy(() => import("../components/slides/use-cases/hr/HiPoIdentification").then(m => ({ default: m.HiPoIdentification })));
const HiPoDevelopmentJourney = React.lazy(() => import("../components/slides/use-cases/hr/HiPoDevelopmentJourney").then(m => ({ default: m.HiPoDevelopmentJourney })));
const MarketBenchmarking = React.lazy(() => import("../components/slides/use-cases/hr/MarketBenchmarking").then(m => ({ default: m.MarketBenchmarking })));
const CompPhilosophyCommunicator = React.lazy(() => import("../components/slides/use-cases/hr/CompPhilosophyCommunicator").then(m => ({ default: m.CompPhilosophyCommunicator })));
const MeritPromotionModeler = React.lazy(() => import("../components/slides/use-cases/hr/MeritPromotionModeler").then(m => ({ default: m.MeritPromotionModeler })));
const PayEquityAudit = React.lazy(() => import("../components/slides/use-cases/hr/PayEquityAudit").then(m => ({ default: m.PayEquityAudit })));
const CompensationLetterGenerator = React.lazy(() => import("../components/slides/use-cases/hr/CompensationLetterGenerator").then(m => ({ default: m.CompensationLetterGenerator })));
const BenefitsAssistant = React.lazy(() => import("../components/slides/use-cases/hr/BenefitsAssistant").then(m => ({ default: m.BenefitsAssistant })));
const BenefitsUtilizationAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/BenefitsUtilizationAnalyzer").then(m => ({ default: m.BenefitsUtilizationAnalyzer })));
const TotalRewardsOptimizer = React.lazy(() => import("../components/slides/use-cases/hr/TotalRewardsOptimizer").then(m => ({ default: m.TotalRewardsOptimizer })));
const EquityParticipantCommunicator = React.lazy(() => import("../components/slides/use-cases/hr/EquityParticipantCommunicator").then(m => ({ default: m.EquityParticipantCommunicator })));
const SkillsGapAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/SkillsGapAnalyzer").then(m => ({ default: m.SkillsGapAnalyzer })));
const LDPlanDrafter = React.lazy(() => import("../components/slides/use-cases/hr/LDPlanDrafter").then(m => ({ default: m.LDPlanDrafter })));
const LearningContentSummarizer = React.lazy(() => import("../components/slides/use-cases/hr/LearningContentSummarizer").then(m => ({ default: m.LearningContentSummarizer })));
const LearningPathRecommendation = React.lazy(() => import("../components/slides/use-cases/hr/LearningPathRecommendation").then(m => ({ default: m.LearningPathRecommendation })));
const ComplianceTrainingGenerator = React.lazy(() => import("../components/slides/use-cases/hr/ComplianceTrainingGenerator").then(m => ({ default: m.ComplianceTrainingGenerator })));
const ComplianceTrackingEscalation = React.lazy(() => import("../components/slides/use-cases/hr/ComplianceTrackingEscalation").then(m => ({ default: m.ComplianceTrackingEscalation })));
const LeadershipProgramDesign = React.lazy(() => import("../components/slides/use-cases/hr/LeadershipProgramDesign").then(m => ({ default: m.LeadershipProgramDesign })));
const ProgramImpactEvaluation = React.lazy(() => import("../components/slides/use-cases/hr/ProgramImpactEvaluation").then(m => ({ default: m.ProgramImpactEvaluation })));
const ERCaseIntelligence = React.lazy(() => import("../components/slides/use-cases/hr/ERCaseIntelligence").then(m => ({ default: m.ERCaseIntelligence })));
const ERCaseAnalytics = React.lazy(() => import("../components/slides/use-cases/hr/ERCaseAnalytics").then(m => ({ default: m.ERCaseAnalytics })));
const PIPDocumentation = React.lazy(() => import("../components/slides/use-cases/hr/PIPDocumentation").then(m => ({ default: m.PIPDocumentation })));
const ProgressiveDisciplineAdvisor = React.lazy(() => import("../components/slides/use-cases/hr/ProgressiveDisciplineAdvisor").then(m => ({ default: m.ProgressiveDisciplineAdvisor })));
const PolicyAssistant = React.lazy(() => import("../components/slides/use-cases/hr/PolicyAssistant").then(m => ({ default: m.PolicyAssistant })));
const PolicyDraftingReview = React.lazy(() => import("../components/slides/use-cases/hr/PolicyDraftingReview").then(m => ({ default: m.PolicyDraftingReview })));
const LeaveAccommodationIntake = React.lazy(() => import("../components/slides/use-cases/hr/LeaveAccommodationIntake").then(m => ({ default: m.LeaveAccommodationIntake })));
const LeaveUtilizationAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/LeaveUtilizationAnalyzer").then(m => ({ default: m.LeaveUtilizationAnalyzer })));
const SurveyDesignCommunication = React.lazy(() => import("../components/slides/use-cases/hr/SurveyDesignCommunication").then(m => ({ default: m.SurveyDesignCommunication })));
const EngagementSynthesizer = React.lazy(() => import("../components/slides/use-cases/hr/EngagementSynthesizer").then(m => ({ default: m.EngagementSynthesizer })));
const EngagementOutcomeCorrelation = React.lazy(() => import("../components/slides/use-cases/hr/EngagementOutcomeCorrelation").then(m => ({ default: m.EngagementOutcomeCorrelation })));
const RecognitionProgramAnalytics = React.lazy(() => import("../components/slides/use-cases/hr/RecognitionProgramAnalytics").then(m => ({ default: m.RecognitionProgramAnalytics })));
const RecognitionNudge = React.lazy(() => import("../components/slides/use-cases/hr/RecognitionNudge").then(m => ({ default: m.RecognitionNudge })));
const EmployeeCommunicationDrafter = React.lazy(() => import("../components/slides/use-cases/hr/EmployeeCommunicationDrafter").then(m => ({ default: m.EmployeeCommunicationDrafter })));
const CommunicationSentimentAnalyzer = React.lazy(() => import("../components/slides/use-cases/hr/CommunicationSentimentAnalyzer").then(m => ({ default: m.CommunicationSentimentAnalyzer })));
const HRISDataQualityMonitor = React.lazy(() => import("../components/slides/use-cases/hr/HRISDataQualityMonitor").then(m => ({ default: m.HRISDataQualityMonitor })));
const DataChangeOrchestrator = React.lazy(() => import("../components/slides/use-cases/hr/DataChangeOrchestrator").then(m => ({ default: m.DataChangeOrchestrator })));
const QueryResolution = React.lazy(() => import("../components/slides/use-cases/hr/QueryResolution").then(m => ({ default: m.QueryResolution })));
const ServiceDeliveryAnalytics = React.lazy(() => import("../components/slides/use-cases/hr/ServiceDeliveryAnalytics").then(m => ({ default: m.ServiceDeliveryAnalytics })));
const PayrollValidation = React.lazy(() => import("../components/slides/use-cases/hr/PayrollValidation").then(m => ({ default: m.PayrollValidation })));
const PayrollReconciliation = React.lazy(() => import("../components/slides/use-cases/hr/PayrollReconciliation").then(m => ({ default: m.PayrollReconciliation })));
const OffboardingOrchestration = React.lazy(() => import("../components/slides/use-cases/hr/OffboardingOrchestration").then(m => ({ default: m.OffboardingOrchestration })));
const ExitInterviewSynthesizer = React.lazy(() => import("../components/slides/use-cases/hr/ExitInterviewSynthesizer").then(m => ({ default: m.ExitInterviewSynthesizer })));
const AttritionAnalytics = React.lazy(() => import("../components/slides/use-cases/hr/AttritionAnalytics").then(m => ({ default: m.AttritionAnalytics })));
const DEIDashboard = React.lazy(() => import("../components/slides/use-cases/hr/DEIDashboard").then(m => ({ default: m.DEIDashboard })));
const InclusiveHiringAudit = React.lazy(() => import("../components/slides/use-cases/hr/InclusiveHiringAudit").then(m => ({ default: m.InclusiveHiringAudit })));
const DEICommunicationProgramming = React.lazy(() => import("../components/slides/use-cases/hr/DEICommunicationProgramming").then(m => ({ default: m.DEICommunicationProgramming })));
const ERGImpact = React.lazy(() => import("../components/slides/use-cases/hr/ERGImpact").then(m => ({ default: m.ERGImpact })));
const HRDataLakeQuery = React.lazy(() => import("../components/slides/use-cases/hr/HRDataLakeQuery").then(m => ({ default: m.HRDataLakeQuery })));
const AttritionPrediction = React.lazy(() => import("../components/slides/use-cases/hr/AttritionPrediction").then(m => ({ default: m.AttritionPrediction })));
const WorkforceCostModeling = React.lazy(() => import("../components/slides/use-cases/hr/WorkforceCostModeling").then(m => ({ default: m.WorkforceCostModeling })));
const HRTechIntelligence = React.lazy(() => import("../components/slides/use-cases/hr/HRTechIntelligence").then(m => ({ default: m.HRTechIntelligence })));
const VendorEvaluationAssistant = React.lazy(() => import("../components/slides/use-cases/hr/VendorEvaluationAssistant").then(m => ({ default: m.VendorEvaluationAssistant })));
const ProcurementStrategyCatalog = React.lazy(() => import("../components/slides/domains/procurement/ProcurementStrategyCatalog").then(m => ({ default: m.ProcurementStrategyCatalog })));
const StrategicSourcingCatalog = React.lazy(() => import("../components/slides/domains/procurement/StrategicSourcingCatalog").then(m => ({ default: m.StrategicSourcingCatalog })));
const SupplierDiscoveryCatalog = React.lazy(() => import("../components/slides/domains/procurement/SupplierDiscoveryCatalog").then(m => ({ default: m.SupplierDiscoveryCatalog })));
const ContractLifecycleCatalog = React.lazy(() => import("../components/slides/domains/procurement/ContractLifecycleCatalog").then(m => ({ default: m.ContractLifecycleCatalog })));
const ProcureToPayCatalog = React.lazy(() => import("../components/slides/domains/procurement/ProcureToPayCatalog").then(m => ({ default: m.ProcureToPayCatalog })));
const SupplierRiskCatalog = React.lazy(() => import("../components/slides/domains/procurement/SupplierRiskCatalog").then(m => ({ default: m.SupplierRiskCatalog })));
const SupplierPerformanceCatalog = React.lazy(() => import("../components/slides/domains/procurement/SupplierPerformanceCatalog").then(m => ({ default: m.SupplierPerformanceCatalog })));
const IndirectTailSpendCatalog = React.lazy(() => import("../components/slides/domains/procurement/IndirectTailSpendCatalog").then(m => ({ default: m.IndirectTailSpendCatalog })));
const SpendAnalyticsCatalog = React.lazy(() => import("../components/slides/domains/procurement/SpendAnalyticsCatalog").then(m => ({ default: m.SpendAnalyticsCatalog })));
const CategoryStrategyGenerator = React.lazy(() => import("../components/slides/use-cases/procurement/CategoryStrategyGenerator").then(m => ({ default: m.CategoryStrategyGenerator })));
const DemandForecastingAggregation = React.lazy(() => import("../components/slides/use-cases/procurement/DemandForecastingAggregation").then(m => ({ default: m.DemandForecastingAggregation })));
const MakeVsBuyAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/MakeVsBuyAnalyzer").then(m => ({ default: m.MakeVsBuyAnalyzer })));
const ProcurementPolicyAssistant = React.lazy(() => import("../components/slides/use-cases/procurement/ProcurementPolicyAssistant").then(m => ({ default: m.ProcurementPolicyAssistant })));
const SavingsPipelineTracker = React.lazy(() => import("../components/slides/use-cases/procurement/SavingsPipelineTracker").then(m => ({ default: m.SavingsPipelineTracker })));
const ProcurementMaturityAssessor = React.lazy(() => import("../components/slides/use-cases/procurement/ProcurementMaturityAssessor").then(m => ({ default: m.ProcurementMaturityAssessor })));
const StakeholderSatisfactionAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/StakeholderSatisfactionAnalyzer").then(m => ({ default: m.StakeholderSatisfactionAnalyzer })));
const SpendClassificationEnrichment = React.lazy(() => import("../components/slides/use-cases/procurement/SpendClassificationEnrichment").then(m => ({ default: m.SpendClassificationEnrichment })));
const MarketIntelligenceMonitor = React.lazy(() => import("../components/slides/use-cases/procurement/MarketIntelligenceMonitor").then(m => ({ default: m.MarketIntelligenceMonitor })));
const ShouldCostModeler = React.lazy(() => import("../components/slides/use-cases/procurement/ShouldCostModeler").then(m => ({ default: m.ShouldCostModeler })));
const RFxBuilderOrchestrator = React.lazy(() => import("../components/slides/use-cases/procurement/RFxBuilderOrchestrator").then(m => ({ default: m.RFxBuilderOrchestrator })));
const BidEvaluationAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/BidEvaluationAnalyzer").then(m => ({ default: m.BidEvaluationAnalyzer })));
const AuctionStrategyAdvisor = React.lazy(() => import("../components/slides/use-cases/procurement/AuctionStrategyAdvisor").then(m => ({ default: m.AuctionStrategyAdvisor })));
const NegotiationPrepAgent = React.lazy(() => import("../components/slides/use-cases/procurement/NegotiationPrepAgent").then(m => ({ default: m.NegotiationPrepAgent })));
const CategorySpendDashboard = React.lazy(() => import("../components/slides/use-cases/procurement/CategorySpendDashboard").then(m => ({ default: m.CategorySpendDashboard })));
const SoleSourceJustification = React.lazy(() => import("../components/slides/use-cases/procurement/SoleSourceJustification").then(m => ({ default: m.SoleSourceJustification })));
const CategoryRoadmapPlanner = React.lazy(() => import("../components/slides/use-cases/procurement/CategoryRoadmapPlanner").then(m => ({ default: m.CategoryRoadmapPlanner })));
const SpecStandardizationAgent = React.lazy(() => import("../components/slides/use-cases/procurement/SpecStandardizationAgent").then(m => ({ default: m.SpecStandardizationAgent })));
const SourcingChannelOptimizer = React.lazy(() => import("../components/slides/use-cases/procurement/SourcingChannelOptimizer").then(m => ({ default: m.SourcingChannelOptimizer })));
const SupplierDiscoveryMatching = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierDiscoveryMatching").then(m => ({ default: m.SupplierDiscoveryMatching })));
const SupplierPreQualScreener = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierPreQualScreener").then(m => ({ default: m.SupplierPreQualScreener })));
const FinancialHealthAssessor = React.lazy(() => import("../components/slides/use-cases/procurement/FinancialHealthAssessor").then(m => ({ default: m.FinancialHealthAssessor })));
const SupplierDiversityTracker = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierDiversityTracker").then(m => ({ default: m.SupplierDiversityTracker })));
const SupplierOnboardingOrchestrator = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierOnboardingOrchestrator").then(m => ({ default: m.SupplierOnboardingOrchestrator })));
const CapabilityAssessmentAgent = React.lazy(() => import("../components/slides/use-cases/procurement/CapabilityAssessmentAgent").then(m => ({ default: m.CapabilityAssessmentAgent })));
const SupplierConsolidationAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierConsolidationAnalyzer").then(m => ({ default: m.SupplierConsolidationAnalyzer })));
const BackgroundSanctionsScreener = React.lazy(() => import("../components/slides/use-cases/procurement/BackgroundSanctionsScreener").then(m => ({ default: m.BackgroundSanctionsScreener })));
const ContractAuthoringAgent = React.lazy(() => import("../components/slides/use-cases/procurement/ContractAuthoringAgent").then(m => ({ default: m.ContractAuthoringAgent })));
const ClauseRiskAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/ClauseRiskAnalyzer").then(m => ({ default: m.ClauseRiskAnalyzer })));
const ObligationMiningTracking = React.lazy(() => import("../components/slides/use-cases/procurement/ObligationMiningTracking").then(m => ({ default: m.ObligationMiningTracking })));
const RenewalExpiryMonitor = React.lazy(() => import("../components/slides/use-cases/procurement/RenewalExpiryMonitor").then(m => ({ default: m.RenewalExpiryMonitor })));
const RedlineComparisonAgent = React.lazy(() => import("../components/slides/use-cases/procurement/RedlineComparisonAgent").then(m => ({ default: m.RedlineComparisonAgent })));
const ContractComplianceAuditor = React.lazy(() => import("../components/slides/use-cases/procurement/ContractComplianceAuditor").then(m => ({ default: m.ContractComplianceAuditor })));
const AgreementHierarchyTracker = React.lazy(() => import("../components/slides/use-cases/procurement/AgreementHierarchyTracker").then(m => ({ default: m.AgreementHierarchyTracker })));
const ContractAnalyticsDashboard = React.lazy(() => import("../components/slides/use-cases/procurement/ContractAnalyticsDashboard").then(m => ({ default: m.ContractAnalyticsDashboard })));
const ForceMajeureAdvisor = React.lazy(() => import("../components/slides/use-cases/procurement/ForceMajeureAdvisor").then(m => ({ default: m.ForceMajeureAdvisor })));
const RequisitionIntakeRouting = React.lazy(() => import("../components/slides/use-cases/procurement/RequisitionIntakeRouting").then(m => ({ default: m.RequisitionIntakeRouting })));
const PurchaseOrderAutoGeneration = React.lazy(() => import("../components/slides/use-cases/procurement/PurchaseOrderAutoGeneration").then(m => ({ default: m.PurchaseOrderAutoGeneration })));
const ThreeWayMatchExceptionHandler = React.lazy(() => import("../components/slides/use-cases/procurement/ThreeWayMatchExceptionHandler").then(m => ({ default: m.ThreeWayMatchExceptionHandler })));
const InvoiceDataExtraction = React.lazy(() => import("../components/slides/use-cases/procurement/InvoiceDataExtraction").then(m => ({ default: m.InvoiceDataExtraction })));
const DuplicatePaymentDetector = React.lazy(() => import("../components/slides/use-cases/procurement/DuplicatePaymentDetector").then(m => ({ default: m.DuplicatePaymentDetector })));
const MaverickSpendDetectorNudge = React.lazy(() => import("../components/slides/use-cases/procurement/MaverickSpendDetectorNudge").then(m => ({ default: m.MaverickSpendDetectorNudge })));
const PaymentOptimizationAgent = React.lazy(() => import("../components/slides/use-cases/procurement/PaymentOptimizationAgent").then(m => ({ default: m.PaymentOptimizationAgent })));
const GoodsReceiptValidator = React.lazy(() => import("../components/slides/use-cases/procurement/GoodsReceiptValidator").then(m => ({ default: m.GoodsReceiptValidator })));
const P2PCycleTimeAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/P2PCycleTimeAnalyzer").then(m => ({ default: m.P2PCycleTimeAnalyzer })));
const ApprovalWorkflowOptimizer = React.lazy(() => import("../components/slides/use-cases/procurement/ApprovalWorkflowOptimizer").then(m => ({ default: m.ApprovalWorkflowOptimizer })));
const PCardReconciliationAgent = React.lazy(() => import("../components/slides/use-cases/procurement/PCardReconciliationAgent").then(m => ({ default: m.PCardReconciliationAgent })));
const SupplierRiskScoringEngine = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierRiskScoringEngine").then(m => ({ default: m.SupplierRiskScoringEngine })));
const SupplyChainDisruptionMonitor = React.lazy(() => import("../components/slides/use-cases/procurement/SupplyChainDisruptionMonitor").then(m => ({ default: m.SupplyChainDisruptionMonitor })));
const SanctionsWatchlistScreener = React.lazy(() => import("../components/slides/use-cases/procurement/SanctionsWatchlistScreener").then(m => ({ default: m.SanctionsWatchlistScreener })));
const RegulatoryComplianceTracker = React.lazy(() => import("../components/slides/use-cases/procurement/RegulatoryComplianceTracker").then(m => ({ default: m.RegulatoryComplianceTracker })));
const SubTierVisibilityAgent = React.lazy(() => import("../components/slides/use-cases/procurement/SubTierVisibilityAgent").then(m => ({ default: m.SubTierVisibilityAgent })));
const AuditCorrectiveActionTracker = React.lazy(() => import("../components/slides/use-cases/procurement/AuditCorrectiveActionTracker").then(m => ({ default: m.AuditCorrectiveActionTracker })));
const ConcentrationRiskAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/ConcentrationRiskAnalyzer").then(m => ({ default: m.ConcentrationRiskAnalyzer })));
const InsuranceLiabilityMonitor = React.lazy(() => import("../components/slides/use-cases/procurement/InsuranceLiabilityMonitor").then(m => ({ default: m.InsuranceLiabilityMonitor })));
const SupplierScorecardGenerator = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierScorecardGenerator").then(m => ({ default: m.SupplierScorecardGenerator })));
const QualityIncidentAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/QualityIncidentAnalyzer").then(m => ({ default: m.QualityIncidentAnalyzer })));
const DeliveryPerformanceMonitor = React.lazy(() => import("../components/slides/use-cases/procurement/DeliveryPerformanceMonitor").then(m => ({ default: m.DeliveryPerformanceMonitor })));
const BusinessReviewPrepAgent = React.lazy(() => import("../components/slides/use-cases/procurement/BusinessReviewPrepAgent").then(m => ({ default: m.BusinessReviewPrepAgent })));
const SupplierDevelopmentPlanner = React.lazy(() => import("../components/slides/use-cases/procurement/SupplierDevelopmentPlanner").then(m => ({ default: m.SupplierDevelopmentPlanner })));
const RelationshipHealthAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/RelationshipHealthAnalyzer").then(m => ({ default: m.RelationshipHealthAnalyzer })));
const InnovationValueEngTracker = React.lazy(() => import("../components/slides/use-cases/procurement/InnovationValueEngTracker").then(m => ({ default: m.InnovationValueEngTracker })));
const TailSpendClassifier = React.lazy(() => import("../components/slides/use-cases/procurement/TailSpendClassifier").then(m => ({ default: m.TailSpendClassifier })));
const CatalogCurationRecommendation = React.lazy(() => import("../components/slides/use-cases/procurement/CatalogCurationRecommendation").then(m => ({ default: m.CatalogCurationRecommendation })));
const SpotBuyNegotiationAgent = React.lazy(() => import("../components/slides/use-cases/procurement/SpotBuyNegotiationAgent").then(m => ({ default: m.SpotBuyNegotiationAgent })));
const MROFacilitiesOptimization = React.lazy(() => import("../components/slides/use-cases/procurement/MROFacilitiesOptimization").then(m => ({ default: m.MROFacilitiesOptimization })));
const TravelExpenseComplianceAgent = React.lazy(() => import("../components/slides/use-cases/procurement/TravelExpenseComplianceAgent").then(m => ({ default: m.TravelExpenseComplianceAgent })));
const ServicesProcurementSOWManager = React.lazy(() => import("../components/slides/use-cases/procurement/ServicesProcurementSOWManager").then(m => ({ default: m.ServicesProcurementSOWManager })));
const SpendCubeBuilderEnrichment = React.lazy(() => import("../components/slides/use-cases/procurement/SpendCubeBuilderEnrichment").then(m => ({ default: m.SpendCubeBuilderEnrichment })));
const SavingsRealizationTracker = React.lazy(() => import("../components/slides/use-cases/procurement/SavingsRealizationTracker").then(m => ({ default: m.SavingsRealizationTracker })));
const CommodityPriceForecaster = React.lazy(() => import("../components/slides/use-cases/procurement/CommodityPriceForecaster").then(m => ({ default: m.CommodityPriceForecaster })));
const ProcurementKPIDashboard = React.lazy(() => import("../components/slides/use-cases/procurement/ProcurementKPIDashboard").then(m => ({ default: m.ProcurementKPIDashboard })));
const TotalCostOwnershipModeler = React.lazy(() => import("../components/slides/use-cases/procurement/TotalCostOwnershipModeler").then(m => ({ default: m.TotalCostOwnershipModeler })));
const ProcurementValueReporter = React.lazy(() => import("../components/slides/use-cases/procurement/ProcurementValueReporter").then(m => ({ default: m.ProcurementValueReporter })));
const PriceVarianceAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/PriceVarianceAnalyzer").then(m => ({ default: m.PriceVarianceAnalyzer })));
const DemandPatternAnalyzer = React.lazy(() => import("../components/slides/use-cases/procurement/DemandPatternAnalyzer").then(m => ({ default: m.DemandPatternAnalyzer })));
const BenchmarkIntelligenceAgent = React.lazy(() => import("../components/slides/use-cases/procurement/BenchmarkIntelligenceAgent").then(m => ({ default: m.BenchmarkIntelligenceAgent })));
const WhatIfScenarioSimulator = React.lazy(() => import("../components/slides/use-cases/procurement/WhatIfScenarioSimulator").then(m => ({ default: m.WhatIfScenarioSimulator })));
const FPACatalog = React.lazy(() => import("../components/slides/domains/finance/FPACatalog").then(m => ({ default: m.FPACatalog })));
const GeneralLedgerCloseCatalog = React.lazy(() => import("../components/slides/domains/finance/GeneralLedgerCloseCatalog").then(m => ({ default: m.GeneralLedgerCloseCatalog })));
const AccountsPayableCatalog = React.lazy(() => import("../components/slides/domains/finance/AccountsPayableCatalog").then(m => ({ default: m.AccountsPayableCatalog })));
const AccountsReceivableCatalog = React.lazy(() => import("../components/slides/domains/finance/AccountsReceivableCatalog").then(m => ({ default: m.AccountsReceivableCatalog })));
const TreasuryCashCatalog = React.lazy(() => import("../components/slides/domains/finance/TreasuryCashCatalog").then(m => ({ default: m.TreasuryCashCatalog })));
const TaxComplianceCatalog = React.lazy(() => import("../components/slides/domains/finance/TaxComplianceCatalog").then(m => ({ default: m.TaxComplianceCatalog })));
const InternalAuditCatalog = React.lazy(() => import("../components/slides/domains/finance/InternalAuditCatalog").then(m => ({ default: m.InternalAuditCatalog })));
const RevenueCostAccountingCatalog = React.lazy(() => import("../components/slides/domains/finance/RevenueCostAccountingCatalog").then(m => ({ default: m.RevenueCostAccountingCatalog })));
const FinanceAnalyticsCatalog = React.lazy(() => import("../components/slides/domains/finance/FinanceAnalyticsCatalog").then(m => ({ default: m.FinanceAnalyticsCatalog })));
const BudgetBuilderConsolidation = React.lazy(() => import("../components/slides/use-cases/finance/BudgetBuilderConsolidation").then(m => ({ default: m.BudgetBuilderConsolidation })));
const RollingForecastEngine = React.lazy(() => import("../components/slides/use-cases/finance/RollingForecastEngine").then(m => ({ default: m.RollingForecastEngine })));
const VarianceAnalysisAgent = React.lazy(() => import("../components/slides/use-cases/finance/VarianceAnalysisAgent").then(m => ({ default: m.VarianceAnalysisAgent })));
const ScenarioModelingSensitivity = React.lazy(() => import("../components/slides/use-cases/finance/ScenarioModelingSensitivity").then(m => ({ default: m.ScenarioModelingSensitivity })));
const CapExAnalyzer = React.lazy(() => import("../components/slides/use-cases/finance/CapExAnalyzer").then(m => ({ default: m.CapExAnalyzer })));
const HeadcountPlanningAgent = React.lazy(() => import("../components/slides/use-cases/finance/HeadcountPlanningAgent").then(m => ({ default: m.HeadcountPlanningAgent })));
const RevenueForecastingAgent = React.lazy(() => import("../components/slides/use-cases/finance/RevenueForecastingAgent").then(m => ({ default: m.RevenueForecastingAgent })));
const BoardDeckGenerator = React.lazy(() => import("../components/slides/use-cases/finance/BoardDeckGenerator").then(m => ({ default: m.BoardDeckGenerator })));
const FPAQueryAssistant = React.lazy(() => import("../components/slides/use-cases/finance/FPAQueryAssistant").then(m => ({ default: m.FPAQueryAssistant })));
const JournalEntryAutoPosting = React.lazy(() => import("../components/slides/use-cases/finance/JournalEntryAutoPosting").then(m => ({ default: m.JournalEntryAutoPosting })));
const IntercompanyReconciliation = React.lazy(() => import("../components/slides/use-cases/finance/IntercompanyReconciliation").then(m => ({ default: m.IntercompanyReconciliation })));
const AccountReconciliationAgent = React.lazy(() => import("../components/slides/use-cases/finance/AccountReconciliationAgent").then(m => ({ default: m.AccountReconciliationAgent })));
const CloseChecklistOrchestrator = React.lazy(() => import("../components/slides/use-cases/finance/CloseChecklistOrchestrator").then(m => ({ default: m.CloseChecklistOrchestrator })));
const AccrualsDeferralsEngine = React.lazy(() => import("../components/slides/use-cases/finance/AccrualsDeferralsEngine").then(m => ({ default: m.AccrualsDeferralsEngine })));
const TrialBalanceValidator = React.lazy(() => import("../components/slides/use-cases/finance/TrialBalanceValidator").then(m => ({ default: m.TrialBalanceValidator })));
const MonthEndCloseAnalytics = React.lazy(() => import("../components/slides/use-cases/finance/MonthEndCloseAnalytics").then(m => ({ default: m.MonthEndCloseAnalytics })));
const GLAnomalyDetector = React.lazy(() => import("../components/slides/use-cases/finance/GLAnomalyDetector").then(m => ({ default: m.GLAnomalyDetector })));
const InvoiceProcessingMatching = React.lazy(() => import("../components/slides/use-cases/finance/InvoiceProcessingMatching").then(m => ({ default: m.InvoiceProcessingMatching })));
const VendorPaymentOptimizer = React.lazy(() => import("../components/slides/use-cases/finance/VendorPaymentOptimizer").then(m => ({ default: m.VendorPaymentOptimizer })));
const DuplicateInvoiceDetector = React.lazy(() => import("../components/slides/use-cases/finance/DuplicateInvoiceDetector").then(m => ({ default: m.DuplicateInvoiceDetector })));
const APAgingAnalyzer = React.lazy(() => import("../components/slides/use-cases/finance/APAgingAnalyzer").then(m => ({ default: m.APAgingAnalyzer })));
const VendorMasterDataManager = React.lazy(() => import("../components/slides/use-cases/finance/VendorMasterDataManager").then(m => ({ default: m.VendorMasterDataManager })));
const EarlyPaymentDiscountAgent = React.lazy(() => import("../components/slides/use-cases/finance/EarlyPaymentDiscountAgent").then(m => ({ default: m.EarlyPaymentDiscountAgent })));
const APPolicyComplianceMonitor = React.lazy(() => import("../components/slides/use-cases/finance/APPolicyComplianceMonitor").then(m => ({ default: m.APPolicyComplianceMonitor })));
const CashApplicationAgent = React.lazy(() => import("../components/slides/use-cases/finance/CashApplicationAgent").then(m => ({ default: m.CashApplicationAgent })));
const CollectionsPriorityEngine = React.lazy(() => import("../components/slides/use-cases/finance/CollectionsPriorityEngine").then(m => ({ default: m.CollectionsPriorityEngine })));
const DunningCommunicationDrafter = React.lazy(() => import("../components/slides/use-cases/finance/DunningCommunicationDrafter").then(m => ({ default: m.DunningCommunicationDrafter })));
const CreditRiskScorer = React.lazy(() => import("../components/slides/use-cases/finance/CreditRiskScorer").then(m => ({ default: m.CreditRiskScorer })));
const ARAgingDSOAnalyzer = React.lazy(() => import("../components/slides/use-cases/finance/ARAgingDSOAnalyzer").then(m => ({ default: m.ARAgingDSOAnalyzer })));
const DisputeResolutionAgent = React.lazy(() => import("../components/slides/use-cases/finance/DisputeResolutionAgent").then(m => ({ default: m.DisputeResolutionAgent })));
const CustomerPaymentPredictor = React.lazy(() => import("../components/slides/use-cases/finance/CustomerPaymentPredictor").then(m => ({ default: m.CustomerPaymentPredictor })));
const CashFlowForecaster = React.lazy(() => import("../components/slides/use-cases/finance/CashFlowForecaster").then(m => ({ default: m.CashFlowForecaster })));
const BankReconciliationAgent = React.lazy(() => import("../components/slides/use-cases/finance/BankReconciliationAgent").then(m => ({ default: m.BankReconciliationAgent })));
const FXExposureMonitor = React.lazy(() => import("../components/slides/use-cases/finance/FXExposureMonitor").then(m => ({ default: m.FXExposureMonitor })));
const InvestmentPortfolioOptimizer = React.lazy(() => import("../components/slides/use-cases/finance/InvestmentPortfolioOptimizer").then(m => ({ default: m.InvestmentPortfolioOptimizer })));
const DebtCovenantTracker = React.lazy(() => import("../components/slides/use-cases/finance/DebtCovenantTracker").then(m => ({ default: m.DebtCovenantTracker })));
const IntercompanyNettingAgent = React.lazy(() => import("../components/slides/use-cases/finance/IntercompanyNettingAgent").then(m => ({ default: m.IntercompanyNettingAgent })));
const LiquidityDashboard = React.lazy(() => import("../components/slides/use-cases/finance/LiquidityDashboard").then(m => ({ default: m.LiquidityDashboard })));
const TaxProvisionCalculator = React.lazy(() => import("../components/slides/use-cases/finance/TaxProvisionCalculator").then(m => ({ default: m.TaxProvisionCalculator })));
const TransferPricingMonitor = React.lazy(() => import("../components/slides/use-cases/finance/TransferPricingMonitor").then(m => ({ default: m.TransferPricingMonitor })));
const SalesUseTaxAutomation = React.lazy(() => import("../components/slides/use-cases/finance/SalesUseTaxAutomation").then(m => ({ default: m.SalesUseTaxAutomation })));
const RegulatoryFilingOrchestrator = React.lazy(() => import("../components/slides/use-cases/finance/RegulatoryFilingOrchestrator").then(m => ({ default: m.RegulatoryFilingOrchestrator })));
const TaxResearchAssistant = React.lazy(() => import("../components/slides/use-cases/finance/TaxResearchAssistant").then(m => ({ default: m.TaxResearchAssistant })));
const WithholdingTaxAgent = React.lazy(() => import("../components/slides/use-cases/finance/WithholdingTaxAgent").then(m => ({ default: m.WithholdingTaxAgent })));
const TaxAuditPrepAgent = React.lazy(() => import("../components/slides/use-cases/finance/TaxAuditPrepAgent").then(m => ({ default: m.TaxAuditPrepAgent })));
const RegulatoryChangeMonitor = React.lazy(() => import("../components/slides/use-cases/finance/RegulatoryChangeMonitor").then(m => ({ default: m.RegulatoryChangeMonitor })));
const SOXControlTestingAgent = React.lazy(() => import("../components/slides/use-cases/finance/SOXControlTestingAgent").then(m => ({ default: m.SOXControlTestingAgent })));
const ContinuousControlsMonitor = React.lazy(() => import("../components/slides/use-cases/finance/ContinuousControlsMonitor").then(m => ({ default: m.ContinuousControlsMonitor })));
const AuditFindingTracker = React.lazy(() => import("../components/slides/use-cases/finance/AuditFindingTracker").then(m => ({ default: m.AuditFindingTracker })));
const RiskAssessmentAgent = React.lazy(() => import("../components/slides/use-cases/finance/RiskAssessmentAgent").then(m => ({ default: m.RiskAssessmentAgent })));
const PolicyComplianceScanner = React.lazy(() => import("../components/slides/use-cases/finance/PolicyComplianceScanner").then(m => ({ default: m.PolicyComplianceScanner })));
const FraudDetectionEngine = React.lazy(() => import("../components/slides/use-cases/finance/FraudDetectionEngine").then(m => ({ default: m.FraudDetectionEngine })));
const AuditReportGenerator = React.lazy(() => import("../components/slides/use-cases/finance/AuditReportGenerator").then(m => ({ default: m.AuditReportGenerator })));
const RevenueRecognitionEngine = React.lazy(() => import("../components/slides/use-cases/finance/RevenueRecognitionEngine").then(m => ({ default: m.RevenueRecognitionEngine })));
const CostAllocationAgent = React.lazy(() => import("../components/slides/use-cases/finance/CostAllocationAgent").then(m => ({ default: m.CostAllocationAgent })));
const ProductProfitabilityAnalyzer = React.lazy(() => import("../components/slides/use-cases/finance/ProductProfitabilityAnalyzer").then(m => ({ default: m.ProductProfitabilityAnalyzer })));
const StandardCostVarianceAgent = React.lazy(() => import("../components/slides/use-cases/finance/StandardCostVarianceAgent").then(m => ({ default: m.StandardCostVarianceAgent })));
const ASC606ContractAnalyzer = React.lazy(() => import("../components/slides/use-cases/finance/ASC606ContractAnalyzer").then(m => ({ default: m.ASC606ContractAnalyzer })));
const InventoryValuationAgent = React.lazy(() => import("../components/slides/use-cases/finance/InventoryValuationAgent").then(m => ({ default: m.InventoryValuationAgent })));
const COGSReconciliationAgent = React.lazy(() => import("../components/slides/use-cases/finance/COGSReconciliationAgent").then(m => ({ default: m.COGSReconciliationAgent })));
const FinancialStatementGenerator = React.lazy(() => import("../components/slides/use-cases/finance/FinancialStatementGenerator").then(m => ({ default: m.FinancialStatementGenerator })));
const ManagementReportingAgent = React.lazy(() => import("../components/slides/use-cases/finance/ManagementReportingAgent").then(m => ({ default: m.ManagementReportingAgent })));
const KPIDashboardBuilder = React.lazy(() => import("../components/slides/use-cases/finance/KPIDashboardBuilder").then(m => ({ default: m.KPIDashboardBuilder })));
const AdHocQueryAgent = React.lazy(() => import("../components/slides/use-cases/finance/AdHocQueryAgent").then(m => ({ default: m.AdHocQueryAgent })));
const PeerBenchmarkingAgent = React.lazy(() => import("../components/slides/use-cases/finance/PeerBenchmarkingAgent").then(m => ({ default: m.PeerBenchmarkingAgent })));
const ConsolidationEliminationAgent = React.lazy(() => import("../components/slides/use-cases/finance/ConsolidationEliminationAgent").then(m => ({ default: m.ConsolidationEliminationAgent })));
const ESGSustainabilityReporter = React.lazy(() => import("../components/slides/use-cases/finance/ESGSustainabilityReporter").then(m => ({ default: m.ESGSustainabilityReporter })));
const InvestorRelationsPrepAgent = React.lazy(() => import("../components/slides/use-cases/finance/InvestorRelationsPrepAgent").then(m => ({ default: m.InvestorRelationsPrepAgent })));
const BrandCommsCatalog = React.lazy(() => import("../components/slides/domains/marketing/BrandCommsCatalog").then(m => ({ default: m.BrandCommsCatalog })));
const MarketingOperationsCatalog = React.lazy(() => import("../components/slides/domains/marketing/MarketingOperationsCatalog").then(m => ({ default: m.MarketingOperationsCatalog })));
const CustomerIntelCatalog = React.lazy(() => import("../components/slides/domains/marketing/CustomerIntelCatalog").then(m => ({ default: m.CustomerIntelCatalog })));
const BrandHealthMonitor = React.lazy(() => import("../components/slides/use-cases/marketing/BrandHealthMonitor").then(m => ({ default: m.BrandHealthMonitor })));
const PressReleaseDrafter = React.lazy(() => import("../components/slides/use-cases/marketing/PressReleaseDrafter").then(m => ({ default: m.PressReleaseDrafter })));
const CrisisCommsAdvisor = React.lazy(() => import("../components/slides/use-cases/marketing/CrisisCommsAdvisor").then(m => ({ default: m.CrisisCommsAdvisor })));
const ExecThoughtLeadership = React.lazy(() => import("../components/slides/use-cases/marketing/ExecThoughtLeadership").then(m => ({ default: m.ExecThoughtLeadership })));
const BrandGuidelinesEnforcer = React.lazy(() => import("../components/slides/use-cases/marketing/BrandGuidelinesEnforcer").then(m => ({ default: m.BrandGuidelinesEnforcer })));
const InternalCommsDrafter = React.lazy(() => import("../components/slides/use-cases/marketing/InternalCommsDrafter").then(m => ({ default: m.InternalCommsDrafter })));
const AnalystRelationsTracker = React.lazy(() => import("../components/slides/use-cases/marketing/AnalystRelationsTracker").then(m => ({ default: m.AnalystRelationsTracker })));
const MarTechHealthMonitor = React.lazy(() => import("../components/slides/use-cases/marketing/MarTechHealthMonitor").then(m => ({ default: m.MarTechHealthMonitor })));
const LeadRoutingEngine = React.lazy(() => import("../components/slides/use-cases/marketing/LeadRoutingEngine").then(m => ({ default: m.LeadRoutingEngine })));
const CampaignOpsWorkflowBuilder = React.lazy(() => import("../components/slides/use-cases/marketing/CampaignOpsWorkflowBuilder").then(m => ({ default: m.CampaignOpsWorkflowBuilder })));
const ListManagementAgent = React.lazy(() => import("../components/slides/use-cases/marketing/ListManagementAgent").then(m => ({ default: m.ListManagementAgent })));
const EmailDeliverabilityManager = React.lazy(() => import("../components/slides/use-cases/marketing/EmailDeliverabilityManager").then(m => ({ default: m.EmailDeliverabilityManager })));
const UTMGovernanceAgent = React.lazy(() => import("../components/slides/use-cases/marketing/UTMGovernanceAgent").then(m => ({ default: m.UTMGovernanceAgent })));
const MarketingComplianceManager = React.lazy(() => import("../components/slides/use-cases/marketing/MarketingComplianceManager").then(m => ({ default: m.MarketingComplianceManager })));
const MarketResearchSynthesizer = React.lazy(() => import("../components/slides/use-cases/marketing/MarketResearchSynthesizer").then(m => ({ default: m.MarketResearchSynthesizer })));
const WinLossAnalysisAgent = React.lazy(() => import("../components/slides/use-cases/marketing/WinLossAnalysisAgent").then(m => ({ default: m.WinLossAnalysisAgent })));
const CustomerVoiceMonitor = React.lazy(() => import("../components/slides/use-cases/marketing/CustomerVoiceMonitor").then(m => ({ default: m.CustomerVoiceMonitor })));
const PersonaICPRefiner = React.lazy(() => import("../components/slides/use-cases/marketing/PersonaICPRefiner").then(m => ({ default: m.PersonaICPRefiner })));
const CompetitiveBattleCards = React.lazy(() => import("../components/slides/use-cases/marketing/CompetitiveBattleCards").then(m => ({ default: m.CompetitiveBattleCards })));
const SalesEnablementContentAgent = React.lazy(() => import("../components/slides/use-cases/marketing/SalesEnablementContentAgent").then(m => ({ default: m.SalesEnablementContentAgent })));
const MarketTrendDetector = React.lazy(() => import("../components/slides/use-cases/marketing/MarketTrendDetector").then(m => ({ default: m.MarketTrendDetector })));
const MarketingStrategyCatalog = React.lazy(() => import("../components/slides/domains/marketing/MarketingStrategyCatalog").then(m => ({ default: m.MarketingStrategyCatalog })));
const ContentCreativeCatalog = React.lazy(() => import("../components/slides/domains/marketing/ContentCreativeCatalog").then(m => ({ default: m.ContentCreativeCatalog })));
const DemandGenerationCatalog = React.lazy(() => import("../components/slides/domains/marketing/DemandGenerationCatalog").then(m => ({ default: m.DemandGenerationCatalog })));
const DigitalMarketingCatalog = React.lazy(() => import("../components/slides/domains/marketing/DigitalMarketingCatalog").then(m => ({ default: m.DigitalMarketingCatalog })));
const SocialMediaCatalog = React.lazy(() => import("../components/slides/domains/marketing/SocialMediaCatalog").then(m => ({ default: m.SocialMediaCatalog })));
const MarketingAnalyticsCatalog = React.lazy(() => import("../components/slides/domains/marketing/MarketingAnalyticsCatalog").then(m => ({ default: m.MarketingAnalyticsCatalog })));
const MarketingPlanGenerator = React.lazy(() => import("../components/slides/use-cases/marketing/MarketingPlanGenerator").then(m => ({ default: m.MarketingPlanGenerator })));
const BudgetAllocatorForecaster = React.lazy(() => import("../components/slides/use-cases/marketing/BudgetAllocatorForecaster").then(m => ({ default: m.BudgetAllocatorForecaster })));
const CompetitiveIntelligenceMonitor = React.lazy(() => import("../components/slides/use-cases/marketing/CompetitiveIntelligenceMonitor").then(m => ({ default: m.CompetitiveIntelligenceMonitor })));
const GTMLaunchPlanner = React.lazy(() => import("../components/slides/use-cases/marketing/GTMLaunchPlanner").then(m => ({ default: m.GTMLaunchPlanner })));
const AudienceSegmentationEngine = React.lazy(() => import("../components/slides/use-cases/marketing/AudienceSegmentationEngine").then(m => ({ default: m.AudienceSegmentationEngine })));
const CampaignCalendarOrchestrator = React.lazy(() => import("../components/slides/use-cases/marketing/CampaignCalendarOrchestrator").then(m => ({ default: m.CampaignCalendarOrchestrator })));
const MarketingOKRTracker = React.lazy(() => import("../components/slides/use-cases/marketing/MarketingOKRTracker").then(m => ({ default: m.MarketingOKRTracker })));
const ContentBriefGenerator = React.lazy(() => import("../components/slides/use-cases/marketing/ContentBriefGenerator").then(m => ({ default: m.ContentBriefGenerator })));
const LongFormContentDrafter = React.lazy(() => import("../components/slides/use-cases/marketing/LongFormContentDrafter").then(m => ({ default: m.LongFormContentDrafter })));
const CreativeAssetGenerator = React.lazy(() => import("../components/slides/use-cases/marketing/CreativeAssetGenerator").then(m => ({ default: m.CreativeAssetGenerator })));
const ContentPerformanceAnalyzer = React.lazy(() => import("../components/slides/use-cases/marketing/ContentPerformanceAnalyzer").then(m => ({ default: m.ContentPerformanceAnalyzer })));
const EmailCopyOptimizer = React.lazy(() => import("../components/slides/use-cases/marketing/EmailCopyOptimizer").then(m => ({ default: m.EmailCopyOptimizer })));
const ContentRepurposingAgent = React.lazy(() => import("../components/slides/use-cases/marketing/ContentRepurposingAgent").then(m => ({ default: m.ContentRepurposingAgent })));
const BrandVoiceChecker = React.lazy(() => import("../components/slides/use-cases/marketing/BrandVoiceChecker").then(m => ({ default: m.BrandVoiceChecker })));
const DAMContentLifecycleManager = React.lazy(() => import("../components/slides/use-cases/marketing/DAMContentLifecycleManager").then(m => ({ default: m.DAMContentLifecycleManager })));
const CampaignBuilderOrchestrator = React.lazy(() => import("../components/slides/use-cases/marketing/CampaignBuilderOrchestrator").then(m => ({ default: m.CampaignBuilderOrchestrator })));
const LeadScoringQualificationAgent = React.lazy(() => import("../components/slides/use-cases/marketing/LeadScoringQualificationAgent").then(m => ({ default: m.LeadScoringQualificationAgent })));
const ABMCampaignManager = React.lazy(() => import("../components/slides/use-cases/marketing/ABMCampaignManager").then(m => ({ default: m.ABMCampaignManager })));
const PaidMediaOptimizer = React.lazy(() => import("../components/slides/use-cases/marketing/PaidMediaOptimizer").then(m => ({ default: m.PaidMediaOptimizer })));
const WebinarEventEngine = React.lazy(() => import("../components/slides/use-cases/marketing/WebinarEventEngine").then(m => ({ default: m.WebinarEventEngine })));
const LeadNurtureOptimizer = React.lazy(() => import("../components/slides/use-cases/marketing/LeadNurtureOptimizer").then(m => ({ default: m.LeadNurtureOptimizer })));
const LandingPageOptimizer = React.lazy(() => import("../components/slides/use-cases/marketing/LandingPageOptimizer").then(m => ({ default: m.LandingPageOptimizer })));
const CampaignROIAnalyzer = React.lazy(() => import("../components/slides/use-cases/marketing/CampaignROIAnalyzer").then(m => ({ default: m.CampaignROIAnalyzer })));
const SEOAuditEngine = React.lazy(() => import("../components/slides/use-cases/marketing/SEOAuditEngine").then(m => ({ default: m.SEOAuditEngine })));
const KeywordStrategyAgent = React.lazy(() => import("../components/slides/use-cases/marketing/KeywordStrategyAgent").then(m => ({ default: m.KeywordStrategyAgent })));
const PPCBidManagementAgent = React.lazy(() => import("../components/slides/use-cases/marketing/PPCBidManagementAgent").then(m => ({ default: m.PPCBidManagementAgent })));
const AdCopyGenerator = React.lazy(() => import("../components/slides/use-cases/marketing/AdCopyGenerator").then(m => ({ default: m.AdCopyGenerator })));
const WebsitePersonalizationEngine = React.lazy(() => import("../components/slides/use-cases/marketing/WebsitePersonalizationEngine").then(m => ({ default: m.WebsitePersonalizationEngine })));
const TechnicalSEOMonitor = React.lazy(() => import("../components/slides/use-cases/marketing/TechnicalSEOMonitor").then(m => ({ default: m.TechnicalSEOMonitor })));
const ConversionRateOptimizer = React.lazy(() => import("../components/slides/use-cases/marketing/ConversionRateOptimizer").then(m => ({ default: m.ConversionRateOptimizer })));
const SocialContentCalendarManager = React.lazy(() => import("../components/slides/use-cases/marketing/SocialContentCalendarManager").then(m => ({ default: m.SocialContentCalendarManager })));
const SocialListeningAnalyzer = React.lazy(() => import("../components/slides/use-cases/marketing/SocialListeningAnalyzer").then(m => ({ default: m.SocialListeningAnalyzer })));
const CommunityEngagementResponder = React.lazy(() => import("../components/slides/use-cases/marketing/CommunityEngagementResponder").then(m => ({ default: m.CommunityEngagementResponder })));
const InfluencerDiscoveryTracker = React.lazy(() => import("../components/slides/use-cases/marketing/InfluencerDiscoveryTracker").then(m => ({ default: m.InfluencerDiscoveryTracker })));
const SocialMediaAnalyticsDashboard = React.lazy(() => import("../components/slides/use-cases/marketing/SocialMediaAnalyticsDashboard").then(m => ({ default: m.SocialMediaAnalyticsDashboard })));
const UGCAdvocacyManager = React.lazy(() => import("../components/slides/use-cases/marketing/UGCAdvocacyManager").then(m => ({ default: m.UGCAdvocacyManager })));
const MultiTouchAttributionEngine = React.lazy(() => import("../components/slides/use-cases/marketing/MultiTouchAttributionEngine").then(m => ({ default: m.MultiTouchAttributionEngine })));
const MarketingDashboardGenerator = React.lazy(() => import("../components/slides/use-cases/marketing/MarketingDashboardGenerator").then(m => ({ default: m.MarketingDashboardGenerator })));
const ABTestAnalyzer = React.lazy(() => import("../components/slides/use-cases/marketing/ABTestAnalyzer").then(m => ({ default: m.ABTestAnalyzer })));
const CustomerJourneyMapper = React.lazy(() => import("../components/slides/use-cases/marketing/CustomerJourneyMapper").then(m => ({ default: m.CustomerJourneyMapper })));
const MarketingMixModeler = React.lazy(() => import("../components/slides/use-cases/marketing/MarketingMixModeler").then(m => ({ default: m.MarketingMixModeler })));
const FunnelVelocityAnalyzer = React.lazy(() => import("../components/slides/use-cases/marketing/FunnelVelocityAnalyzer").then(m => ({ default: m.FunnelVelocityAnalyzer })));
const PredictivePipelineForecaster = React.lazy(() => import("../components/slides/use-cases/marketing/PredictivePipelineForecaster").then(m => ({ default: m.PredictivePipelineForecaster })));
const DataQualityGovernanceAgent = React.lazy(() => import("../components/slides/use-cases/marketing/DataQualityGovernanceAgent").then(m => ({ default: m.DataQualityGovernanceAgent })));
const EnterpriseArchitectureCatalog = React.lazy(() => import("../components/slides/domains/it/EnterpriseArchitectureCatalog").then(m => ({ default: m.EnterpriseArchitectureCatalog })));
const ITGovernanceCatalog = React.lazy(() => import("../components/slides/domains/it/ITGovernanceCatalog").then(m => ({ default: m.ITGovernanceCatalog })));
const EndUserComputingCatalog = React.lazy(() => import("../components/slides/domains/it/EndUserComputingCatalog").then(m => ({ default: m.EndUserComputingCatalog })));
const ITStrategyPortfolioCatalog = React.lazy(() => import("../components/slides/domains/it/ITStrategyPortfolioCatalog").then(m => ({ default: m.ITStrategyPortfolioCatalog })));
const SoftwareEngineeringCatalog = React.lazy(() => import("../components/slides/domains/it/SoftwareEngineeringCatalog").then(m => ({ default: m.SoftwareEngineeringCatalog })));
const InfraCloudOpsCatalog = React.lazy(() => import("../components/slides/domains/it/InfraCloudOpsCatalog").then(m => ({ default: m.InfraCloudOpsCatalog })));
const CybersecurityCatalog = React.lazy(() => import("../components/slides/domains/it/CybersecurityCatalog").then(m => ({ default: m.CybersecurityCatalog })));
const ITServiceManagementCatalog = React.lazy(() => import("../components/slides/domains/it/ITServiceManagementCatalog").then(m => ({ default: m.ITServiceManagementCatalog })));
const DataAIPlatformCatalog = React.lazy(() => import("../components/slides/domains/it/DataAIPlatformCatalog").then(m => ({ default: m.DataAIPlatformCatalog })));
const PortfolioPrioritizationEngine = React.lazy(() => import("../components/slides/use-cases/it/PortfolioPrioritizationEngine").then(m => ({ default: m.PortfolioPrioritizationEngine })));
const TechnologyRadarTrendScout = React.lazy(() => import("../components/slides/use-cases/it/TechnologyRadarTrendScout").then(m => ({ default: m.TechnologyRadarTrendScout })));
const ITBudgetForecastAgent = React.lazy(() => import("../components/slides/use-cases/it/ITBudgetForecastAgent").then(m => ({ default: m.ITBudgetForecastAgent })));
const DigitalTransformationTracker = React.lazy(() => import("../components/slides/use-cases/it/DigitalTransformationTracker").then(m => ({ default: m.DigitalTransformationTracker })));
const VendorRationalizationAgent = React.lazy(() => import("../components/slides/use-cases/it/VendorRationalizationAgent").then(m => ({ default: m.VendorRationalizationAgent })));
const ITOKRKPIDashboard = React.lazy(() => import("../components/slides/use-cases/it/ITOKRKPIDashboard").then(m => ({ default: m.ITOKRKPIDashboard })));
const StrategicInitiativeQA = React.lazy(() => import("../components/slides/use-cases/it/StrategicInitiativeQA").then(m => ({ default: m.StrategicInitiativeQA })));
const CICDPipelineOptimizer = React.lazy(() => import("../components/slides/use-cases/it/CICDPipelineOptimizer").then(m => ({ default: m.CICDPipelineOptimizer })));
const CodeReviewAssistant = React.lazy(() => import("../components/slides/use-cases/it/CodeReviewAssistant").then(m => ({ default: m.CodeReviewAssistant })));
const TechDebtPrioritizer = React.lazy(() => import("../components/slides/use-cases/it/TechDebtPrioritizer").then(m => ({ default: m.TechDebtPrioritizer })));
const ReleaseNotesGenerator = React.lazy(() => import("../components/slides/use-cases/it/ReleaseNotesGenerator").then(m => ({ default: m.ReleaseNotesGenerator })));
const IncidentToCodeTracer = React.lazy(() => import("../components/slides/use-cases/it/IncidentToCodeTracer").then(m => ({ default: m.IncidentToCodeTracer })));
const DependencyVulnerabilityScanner = React.lazy(() => import("../components/slides/use-cases/it/DependencyVulnerabilityScanner").then(m => ({ default: m.DependencyVulnerabilityScanner })));
const FeatureFlagManager = React.lazy(() => import("../components/slides/use-cases/it/FeatureFlagManager").then(m => ({ default: m.FeatureFlagManager })));
const DeveloperExperienceSurveyor = React.lazy(() => import("../components/slides/use-cases/it/DeveloperExperienceSurveyor").then(m => ({ default: m.DeveloperExperienceSurveyor })));
const IaCDriftDetector = React.lazy(() => import("../components/slides/use-cases/it/IaCDriftDetector").then(m => ({ default: m.IaCDriftDetector })));
const CloudCostOptimizer = React.lazy(() => import("../components/slides/use-cases/it/CloudCostOptimizer").then(m => ({ default: m.CloudCostOptimizer })));
const CapacityPlanningAgent = React.lazy(() => import("../components/slides/use-cases/it/CapacityPlanningAgent").then(m => ({ default: m.CapacityPlanningAgent })));
const IncidentAutoRemediator = React.lazy(() => import("../components/slides/use-cases/it/IncidentAutoRemediator").then(m => ({ default: m.IncidentAutoRemediator })));
const SLOSLIMonitorReporter = React.lazy(() => import("../components/slides/use-cases/it/SLOSLIMonitorReporter").then(m => ({ default: m.SLOSLIMonitorReporter })));
const KubernetesClusterOptimizer = React.lazy(() => import("../components/slides/use-cases/it/KubernetesClusterOptimizer").then(m => ({ default: m.KubernetesClusterOptimizer })));
const DatabasePerformanceAdvisor = React.lazy(() => import("../components/slides/use-cases/it/DatabasePerformanceAdvisor").then(m => ({ default: m.DatabasePerformanceAdvisor })));
const NetworkDNSHealthMonitor = React.lazy(() => import("../components/slides/use-cases/it/NetworkDNSHealthMonitor").then(m => ({ default: m.NetworkDNSHealthMonitor })));
const BackupDRComplianceAgent = React.lazy(() => import("../components/slides/use-cases/it/BackupDRComplianceAgent").then(m => ({ default: m.BackupDRComplianceAgent })));
const ThreatIntelligenceAggregator = React.lazy(() => import("../components/slides/use-cases/it/ThreatIntelligenceAggregator").then(m => ({ default: m.ThreatIntelligenceAggregator })));
const VulnerabilityPrioritizationAgent = React.lazy(() => import("../components/slides/use-cases/it/VulnerabilityPrioritizationAgent").then(m => ({ default: m.VulnerabilityPrioritizationAgent })));
const SIEMAlertTriageAgent = React.lazy(() => import("../components/slides/use-cases/it/SIEMAlertTriageAgent").then(m => ({ default: m.SIEMAlertTriageAgent })));
const PhishingEmailThreatAnalyzer = React.lazy(() => import("../components/slides/use-cases/it/PhishingEmailThreatAnalyzer").then(m => ({ default: m.PhishingEmailThreatAnalyzer })));
const IdentityAccessAnomalyDetector = React.lazy(() => import("../components/slides/use-cases/it/IdentityAccessAnomalyDetector").then(m => ({ default: m.IdentityAccessAnomalyDetector })));
const CompliancePostureScanner = React.lazy(() => import("../components/slides/use-cases/it/CompliancePostureScanner").then(m => ({ default: m.CompliancePostureScanner })));
const PenTestFindingsTracker = React.lazy(() => import("../components/slides/use-cases/it/PenTestFindingsTracker").then(m => ({ default: m.PenTestFindingsTracker })));
const SecurityIncidentResponder = React.lazy(() => import("../components/slides/use-cases/it/SecurityIncidentResponder").then(m => ({ default: m.SecurityIncidentResponder })));
const ZeroTrustPolicyEvaluator = React.lazy(() => import("../components/slides/use-cases/it/ZeroTrustPolicyEvaluator").then(m => ({ default: m.ZeroTrustPolicyEvaluator })));
const IntelligentTicketRouter = React.lazy(() => import("../components/slides/use-cases/it/IntelligentTicketRouter").then(m => ({ default: m.IntelligentTicketRouter })));
const KnowledgeBaseAutoResolver = React.lazy(() => import("../components/slides/use-cases/it/KnowledgeBaseAutoResolver").then(m => ({ default: m.KnowledgeBaseAutoResolver })));
const SLABreachPredictor = React.lazy(() => import("../components/slides/use-cases/it/SLABreachPredictor").then(m => ({ default: m.SLABreachPredictor })));
const ChangeRiskAssessor = React.lazy(() => import("../components/slides/use-cases/it/ChangeRiskAssessor").then(m => ({ default: m.ChangeRiskAssessor })));
const MajorIncidentCoordinator = React.lazy(() => import("../components/slides/use-cases/it/MajorIncidentCoordinator").then(m => ({ default: m.MajorIncidentCoordinator })));
const ProblemManagementAnalyzer = React.lazy(() => import("../components/slides/use-cases/it/ProblemManagementAnalyzer").then(m => ({ default: m.ProblemManagementAnalyzer })));
const ServiceCatalogRecommender = React.lazy(() => import("../components/slides/use-cases/it/ServiceCatalogRecommender").then(m => ({ default: m.ServiceCatalogRecommender })));
const ITSMAnalyticsDashboard = React.lazy(() => import("../components/slides/use-cases/it/ITSMAnalyticsDashboard").then(m => ({ default: m.ITSMAnalyticsDashboard })));
const DataPipelineHealthMonitor = React.lazy(() => import("../components/slides/use-cases/it/DataPipelineHealthMonitor").then(m => ({ default: m.DataPipelineHealthMonitor })));
const DataQualityScorecard = React.lazy(() => import("../components/slides/use-cases/it/DataQualityScorecard").then(m => ({ default: m.DataQualityScorecard })));
const MLModelRegistryMonitor = React.lazy(() => import("../components/slides/use-cases/it/MLModelRegistryMonitor").then(m => ({ default: m.MLModelRegistryMonitor })));
const FeatureStoreManager = React.lazy(() => import("../components/slides/use-cases/it/FeatureStoreManager").then(m => ({ default: m.FeatureStoreManager })));
const CostPerQueryOptimizer = React.lazy(() => import("../components/slides/use-cases/it/CostPerQueryOptimizer").then(m => ({ default: m.CostPerQueryOptimizer })));
const DataCatalogLineageAgent = React.lazy(() => import("../components/slides/use-cases/it/DataCatalogLineageAgent").then(m => ({ default: m.DataCatalogLineageAgent })));
const AIEthicsBiasMonitor = React.lazy(() => import("../components/slides/use-cases/it/AIEthicsBiasMonitor").then(m => ({ default: m.AIEthicsBiasMonitor })));
const ADRDrafter = React.lazy(() => import("../components/slides/use-cases/it/ADRDrafter").then(m => ({ default: m.ADRDrafter })));
const APICatalogGovernance = React.lazy(() => import("../components/slides/use-cases/it/APICatalogGovernance").then(m => ({ default: m.APICatalogGovernance })));
const SystemDependencyMapper = React.lazy(() => import("../components/slides/use-cases/it/SystemDependencyMapper").then(m => ({ default: m.SystemDependencyMapper })));
const TechnologyLifecycleManager = React.lazy(() => import("../components/slides/use-cases/it/TechnologyLifecycleManager").then(m => ({ default: m.TechnologyLifecycleManager })));
const IntegrationPatternAdvisor = React.lazy(() => import("../components/slides/use-cases/it/IntegrationPatternAdvisor").then(m => ({ default: m.IntegrationPatternAdvisor })));
const ArchitectureComplianceScanner = React.lazy(() => import("../components/slides/use-cases/it/ArchitectureComplianceScanner").then(m => ({ default: m.ArchitectureComplianceScanner })));
const ReferenceArchitectureGenerator = React.lazy(() => import("../components/slides/use-cases/it/ReferenceArchitectureGenerator").then(m => ({ default: m.ReferenceArchitectureGenerator })));
const ITControlTestingAgent = React.lazy(() => import("../components/slides/use-cases/it/ITControlTestingAgent").then(m => ({ default: m.ITControlTestingAgent })));
const AuditEvidenceCollector = React.lazy(() => import("../components/slides/use-cases/it/AuditEvidenceCollector").then(m => ({ default: m.AuditEvidenceCollector })));
const PolicyLifecycleManager = React.lazy(() => import("../components/slides/use-cases/it/PolicyLifecycleManager").then(m => ({ default: m.PolicyLifecycleManager })));
const LicenseComplianceMonitor = React.lazy(() => import("../components/slides/use-cases/it/LicenseComplianceMonitor").then(m => ({ default: m.LicenseComplianceMonitor })));
const RiskRegisterAgent = React.lazy(() => import("../components/slides/use-cases/it/RiskRegisterAgent").then(m => ({ default: m.RiskRegisterAgent })));
const ITRegulatoryChangeMonitor = React.lazy(() => import("../components/slides/use-cases/it/RegulatoryChangeMonitor").then(m => ({ default: m.RegulatoryChangeMonitor })));
const ITGRCDashboard = React.lazy(() => import("../components/slides/use-cases/it/ITGRCDashboard").then(m => ({ default: m.ITGRCDashboard })));
const DeviceLifecycleManager = React.lazy(() => import("../components/slides/use-cases/it/DeviceLifecycleManager").then(m => ({ default: m.DeviceLifecycleManager })));
const AccessProvisioningOrchestrator = React.lazy(() => import("../components/slides/use-cases/it/AccessProvisioningOrchestrator").then(m => ({ default: m.AccessProvisioningOrchestrator })));
const WorkspaceAnalyticsAgent = React.lazy(() => import("../components/slides/use-cases/it/WorkspaceAnalyticsAgent").then(m => ({ default: m.WorkspaceAnalyticsAgent })));
const SelfServiceITBot = React.lazy(() => import("../components/slides/use-cases/it/SelfServiceITBot").then(m => ({ default: m.SelfServiceITBot })));
const EndpointSecurityPosture = React.lazy(() => import("../components/slides/use-cases/it/EndpointSecurityPosture").then(m => ({ default: m.EndpointSecurityPosture })));
const MeetingRoomOptimizer = React.lazy(() => import("../components/slides/use-cases/it/MeetingRoomOptimizer").then(m => ({ default: m.MeetingRoomOptimizer })));
const OnboardingTechSetup = React.lazy(() => import("../components/slides/use-cases/it/OnboardingTechSetup").then(m => ({ default: m.OnboardingTechSetup })));
const ShadowITDetector = React.lazy(() => import("../components/slides/use-cases/it/ShadowITDetector").then(m => ({ default: m.ShadowITDetector })));

export interface SlideConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  level: 0 | 1 | 2 | 3 | 4;
  parent?: string;
  domain?: number;
  department?: "hr" | "procurement" | "finance" | "marketing" | "it";
}

export const SLIDES: SlideConfig[] = [

  // ═══════════════════════════════════════════════════════
  // ACT I — THE OPENING
  // "First, who... then what." — Jim Collins
  // ═══════════════════════════════════════════════════════

  { id: "landing", title: "People First", content: <LandingSlide />, level: 0 },

  // ═══════════════════════════════════════════════════════
  // ACT II — THE HUMAN COST
  // Why transformation must start with understanding people
  // ═══════════════════════════════════════════════════════

  { id: "act-2", title: "The Human Cost", content: <SectionDividerSlide sectionNumber="I" title="The Human Cost" subtitle="Before we talk about technology, let's talk about the people it's failing." quote="The most dangerous phrase in business is 'we've always done it this way.'" quoteAuthor="Grace Hopper" icon={AlertTriangle} accentColor="#9e4300" />, level: 0 },
  { id: "challenge", title: "The Challenge", content: <ChallengeSlide />, level: 0 },
  { id: "personas", title: "12 HR Personas", content: <PersonasSlide />, level: 0 },
  { id: "day-in-life", title: "A Day in the Life", content: <DayInLifeSlide />, level: 0 },
  { id: "raci", title: "Who Owns What", content: <RACISlide />, level: 0 },

  // ═══════════════════════════════════════════════════════
  // ACT III — THE VISION
  // What if every HR professional had a team of AI agents?
  // ═══════════════════════════════════════════════════════

  { id: "act-3", title: "The Vision", content: <SectionDividerSlide sectionNumber="II" title="The Agentic Vision" subtitle="What if every HR professional had a team of AI agents — not replacing them, but amplifying what makes them human?" quote="The best technology disappears. It doesn't replace the human — it reveals what was always possible." icon={Lightbulb} accentColor="#005bbf" />, level: 0 },
  { id: "solution", title: "The Blueprint", content: <SolutionSlide />, level: 0 },
  { id: "tech-landscape", title: "HR Tech Landscape", content: <HRTechLandscapeSlide />, level: 0 },

  // ═══════════════════════════════════════════════════════
  // ACT IV — THE PLATFORM
  // The technical foundation that makes it real
  // ═══════════════════════════════════════════════════════

  { id: "act-4", title: "The Platform", content: <SectionDividerSlide sectionNumber="III" title="The Platform" subtitle="From grounded RAG to orchestrated multi-agent systems — built on Google Cloud." quote="We shape our tools, and thereafter our tools shape us." quoteAuthor="Marshall McLuhan" icon={Wrench} accentColor="#8b5cf6" />, level: 0 },
  { id: "agent-evolution", title: "Evolution of Agents", content: <AgentEvolutionSlide />, level: 0 },
  { id: "integration-arch", title: "Integration Architecture", content: <IntegrationArchitectureSlide />, level: 0 },

  // ═══════════════════════════════════════════════════════
  // ACT V — THE MAP
  // 82 agents across 10 domains — the full landscape
  // ═══════════════════════════════════════════════════════

  { id: "act-5", title: "The Map", content: <SectionDividerSlide sectionNumber="IV" title="228 Agents. 28 Domains." subtitle="The complete periodic table of enterprise agentic capabilities — HR, Procurement, and Finance. Click any element to explore." quote="You can't automate what you don't understand. Start with the people, map the processes, then build the agents." icon={Map} accentColor="#10b981" />, level: 0 },

  // L1: Capability Map
  { id: "domain-map", title: "Enterprise Capability Map", content: <PeriodicTableSlide />, level: 1 },

  // L2: Department Landing Pages
  { id: "dept-hr", title: "HR & People Operations", content: <DepartmentLandingSlide title="HR & People Operations" subtitle="10 Domains • 82 Agents • 12 Personas" description="The complete HR transformation — from workforce planning through talent acquisition, performance management, and people analytics. Every agent grounded in real personas, real systems, and real workflows." icon={Users} accentColor="#3b82f6" domainRange={[1, 10]} />, level: 2, parent: "domain-map", department: "hr" },
  { id: "dept-procurement", title: "Procurement", content: <DepartmentLandingSlide title="Procurement" subtitle="9 Domains • 78 Agents • 12 Personas" description="End-to-end procurement transformation — Plan → Source → Contract → Purchase → Pay → Manage → Analyze. Every agent grounded in real enterprise systems, real vendor names, and the three-layer capability model." icon={Briefcase} accentColor="#ea580c" domainRange={[11, 19]} />, level: 2, parent: "domain-map", department: "procurement" },
  { id: "dept-finance", title: "Finance", content: <DepartmentLandingSlide title="Finance" subtitle="9 Domains • 68 Agents • 12 Personas" description="End-to-end finance transformation — Plan → Record → Pay → Collect → Manage → Comply → Assure → Measure → Analyze." icon={Calculator} accentColor="#0f766e" domainRange={[20, 28]} />, level: 2, parent: "domain-map", department: "finance" },
  { id: "dept-it", title: "Information Technology", content: <DepartmentLandingSlide title="Information Technology" subtitle="9 Domains • 70 Agents • 12 Personas" description="End-to-end IT transformation — Strategize → Build → Run → Secure → Support → Platform → Architect → Govern → Enable." icon={Monitor} accentColor="#1d4ed8" domainRange={[38, 46]} />, level: 2, parent: "domain-map", department: "it" },
  { id: "dept-marketing", title: "Marketing", content: <DepartmentLandingSlide title="Marketing" subtitle="9 Domains • 65 Agents • 12 Personas" description="End-to-end marketing transformation — Research → Plan → Create → Distribute → Engage → Convert → Measure → Optimize." icon={Megaphone} accentColor="#7c3aed" domainRange={[29, 37]} />, level: 2, parent: "domain-map", department: "marketing" },

  // ═══════════════════════════════════════════════════════
  // HR — 82 AGENTS ACROSS 10 DOMAINS
  // ═══════════════════════════════════════════════════════

  // L3: Domain Catalogs + L4: Use Cases
  { id: "domain-1", title: "Workforce Planning", content: <React.Suspense fallback={<LazyFallback />}><WorkforcePlanningCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 1, department: "hr" },
  { id: "uc-101", title: "Workforce Scenario Modeling", content: <React.Suspense fallback={<LazyFallback />}><WorkforceScenarioModeling /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-102", title: "Labor Market Intelligence", content: <React.Suspense fallback={<LazyFallback />}><LaborMarketIntelligence /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-103", title: "Workforce Plan Drafter", content: <React.Suspense fallback={<LazyFallback />}><WorkforcePlanDrafter /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-104", title: "Org Structure Analyzer", content: <React.Suspense fallback={<LazyFallback />}><OrgStructureAnalyzer /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-105", title: "Change Communication Drafter", content: <React.Suspense fallback={<LazyFallback />}><ChangeCommunicationDrafter /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-106", title: "Restructuring Impact Assessment", content: <React.Suspense fallback={<LazyFallback />}><RestructuringImpactAssessment /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-107", title: "Job Description Optimizer", content: <React.Suspense fallback={<LazyFallback />}><JobDescriptionOptimizer /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },
  { id: "uc-108", title: "Job Architecture Sync", content: <React.Suspense fallback={<LazyFallback />}><JobArchitectureSync /></React.Suspense>, level: 4, parent: "domain-1", domain: 1, department: "hr" },

  // Domain 2 - Talent Acquisition & Onboarding (13 agents)
  { id: "domain-2", title: "Talent Acquisition Catalog", content: <React.Suspense fallback={<LazyFallback />}><TalentAcquisitionCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 2, department: "hr" },
  { id: "uc-201", title: "Requisition Intake", content: <React.Suspense fallback={<LazyFallback />}><RequisitionIntake /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-202", title: "Requisition Prioritization", content: <React.Suspense fallback={<LazyFallback />}><RequisitionPrioritization /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-203", title: "Candidate Sourcing", content: <React.Suspense fallback={<LazyFallback />}><CandidateSourcing /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-204", title: "Resume Screening", content: <React.Suspense fallback={<LazyFallback />}><ResumeScreening /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-205", title: "Sourcing Channel Analytics", content: <React.Suspense fallback={<LazyFallback />}><SourcingChannelAnalytics /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-206", title: "Interview Scorecard Builder", content: <React.Suspense fallback={<LazyFallback />}><InterviewScorecardBuilder /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-207", title: "Interview Scheduling", content: <React.Suspense fallback={<LazyFallback />}><InterviewScheduling /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-208", title: "Selection Debrief Summarizer", content: <React.Suspense fallback={<LazyFallback />}><SelectionDebriefSummarizer /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-209", title: "Offer Package Modeler", content: <React.Suspense fallback={<LazyFallback />}><OfferPackageModeler /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-210", title: "Pre-boarding Orchestration", content: <React.Suspense fallback={<LazyFallback />}><PreboardingOrchestration /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-211", title: "Onboarding Orchestration", content: <React.Suspense fallback={<LazyFallback />}><OnboardingOrchestration /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-212", title: "New Hire Q&A", content: <React.Suspense fallback={<LazyFallback />}><NewHireQA /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },
  { id: "uc-213", title: "Onboarding Effectiveness", content: <React.Suspense fallback={<LazyFallback />}><OnboardingEffectivenessAnalyzer /></React.Suspense>, level: 4, parent: "domain-2", domain: 2 },

  // Domain 3 - Performance & Talent Management (11 agents)
  { id: "domain-3", title: "Performance Management Catalog", content: <React.Suspense fallback={<LazyFallback />}><PerformanceManagementCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 3, department: "hr" },
  { id: "uc-301", title: "Goal Drafting Assistant", content: <React.Suspense fallback={<LazyFallback />}><GoalDraftingAssistant /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-302", title: "OKR Progress Tracker", content: <React.Suspense fallback={<LazyFallback />}><OKRProgressTracker /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-303", title: "1:1 Meeting Prep", content: <React.Suspense fallback={<LazyFallback />}><OneOnOnePrep /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-304", title: "Feedback Trend Analyzer", content: <React.Suspense fallback={<LazyFallback />}><FeedbackTrendAnalyzer /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-305", title: "Performance Narrative", content: <React.Suspense fallback={<LazyFallback />}><PerformanceNarrative /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-306", title: "Calibration Analytics", content: <React.Suspense fallback={<LazyFallback />}><CalibrationAnalytics /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-307", title: "Review Cycle Orchestration", content: <React.Suspense fallback={<LazyFallback />}><ReviewCycleOrchestration /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-308", title: "Successor Readiness", content: <React.Suspense fallback={<LazyFallback />}><SuccessorReadiness /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-309", title: "Succession Pipeline Dashboard", content: <React.Suspense fallback={<LazyFallback />}><SuccessionPipelineDashboard /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-310", title: "HiPo Identification", content: <React.Suspense fallback={<LazyFallback />}><HiPoIdentification /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },
  { id: "uc-311", title: "HiPo Development Journey", content: <React.Suspense fallback={<LazyFallback />}><HiPoDevelopmentJourney /></React.Suspense>, level: 4, parent: "domain-3", domain: 3, department: "hr" },

  // Domain 4 - Compensation, Benefits & Total Rewards (9 agents)
  { id: "domain-4", title: "Total Rewards Catalog", content: <React.Suspense fallback={<LazyFallback />}><TotalRewardsCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 4, department: "hr" },
  { id: "uc-401", title: "Market Benchmarking", content: <React.Suspense fallback={<LazyFallback />}><MarketBenchmarking /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-402", title: "Comp Philosophy Communicator", content: <React.Suspense fallback={<LazyFallback />}><CompPhilosophyCommunicator /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-403", title: "Merit & Promotion Modeler", content: <React.Suspense fallback={<LazyFallback />}><MeritPromotionModeler /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-404", title: "Pay Equity Audit", content: <React.Suspense fallback={<LazyFallback />}><PayEquityAudit /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-405", title: "Compensation Letter Generator", content: <React.Suspense fallback={<LazyFallback />}><CompensationLetterGenerator /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-406", title: "Benefits Assistant", content: <React.Suspense fallback={<LazyFallback />}><BenefitsAssistant /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-407", title: "Benefits Utilization Analyzer", content: <React.Suspense fallback={<LazyFallback />}><BenefitsUtilizationAnalyzer /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-408", title: "Total Rewards Optimizer", content: <React.Suspense fallback={<LazyFallback />}><TotalRewardsOptimizer /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },
  { id: "uc-409", title: "Equity Participant Communicator", content: <React.Suspense fallback={<LazyFallback />}><EquityParticipantCommunicator /></React.Suspense>, level: 4, parent: "domain-4", domain: 4, department: "hr" },

  // Domain 5 - Learning & Development (8 agents)
  { id: "domain-5", title: "L&D Catalog", content: <React.Suspense fallback={<LazyFallback />}><LearningDevelopmentCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 5, department: "hr" },
  { id: "uc-501", title: "Skills Gap Analyzer", content: <React.Suspense fallback={<LazyFallback />}><SkillsGapAnalyzer /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-502", title: "L&D Plan Drafter", content: <React.Suspense fallback={<LazyFallback />}><LDPlanDrafter /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-503", title: "Learning Content Summarizer", content: <React.Suspense fallback={<LazyFallback />}><LearningContentSummarizer /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-504", title: "Learning Path Recommendation", content: <React.Suspense fallback={<LazyFallback />}><LearningPathRecommendation /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-505", title: "Compliance Training Generator", content: <React.Suspense fallback={<LazyFallback />}><ComplianceTrainingGenerator /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-506", title: "Compliance Tracking & Escalation", content: <React.Suspense fallback={<LazyFallback />}><ComplianceTrackingEscalation /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-507", title: "Leadership Program Design", content: <React.Suspense fallback={<LazyFallback />}><LeadershipProgramDesign /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },
  { id: "uc-508", title: "Program Impact Evaluation", content: <React.Suspense fallback={<LazyFallback />}><ProgramImpactEvaluation /></React.Suspense>, level: 4, parent: "domain-5", domain: 5, department: "hr" },

  // Domain 6 - Employee Relations & Compliance (8 agents)
  { id: "domain-6", title: "ER & Compliance Catalog", content: <React.Suspense fallback={<LazyFallback />}><EmployeeRelationsCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 6, department: "hr" },
  { id: "uc-601", title: "ER Case Intelligence", content: <React.Suspense fallback={<LazyFallback />}><ERCaseIntelligence /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-602", title: "ER Case Analytics", content: <React.Suspense fallback={<LazyFallback />}><ERCaseAnalytics /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-603", title: "PIP Documentation", content: <React.Suspense fallback={<LazyFallback />}><PIPDocumentation /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-604", title: "Progressive Discipline Advisor", content: <React.Suspense fallback={<LazyFallback />}><ProgressiveDisciplineAdvisor /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-605", title: "Policy Assistant", content: <React.Suspense fallback={<LazyFallback />}><PolicyAssistant /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-606", title: "Policy Drafting & Review", content: <React.Suspense fallback={<LazyFallback />}><PolicyDraftingReview /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-607", title: "Leave & Accommodation Intake", content: <React.Suspense fallback={<LazyFallback />}><LeaveAccommodationIntake /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },
  { id: "uc-608", title: "Leave Utilization Analyzer", content: <React.Suspense fallback={<LazyFallback />}><LeaveUtilizationAnalyzer /></React.Suspense>, level: 4, parent: "domain-6", domain: 6, department: "hr" },

  // Domain 7 - Employee Engagement & Culture (7 agents)
  { id: "domain-7", title: "Engagement Catalog", content: <React.Suspense fallback={<LazyFallback />}><EmployeeEngagementCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 7, department: "hr" },
  { id: "uc-701", title: "Survey Design & Communication", content: <React.Suspense fallback={<LazyFallback />}><SurveyDesignCommunication /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },
  { id: "uc-702", title: "Engagement Synthesizer", content: <React.Suspense fallback={<LazyFallback />}><EngagementSynthesizer /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },
  { id: "uc-703", title: "Engagement-Outcome Correlation", content: <React.Suspense fallback={<LazyFallback />}><EngagementOutcomeCorrelation /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },
  { id: "uc-704", title: "Recognition Program Analytics", content: <React.Suspense fallback={<LazyFallback />}><RecognitionProgramAnalytics /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },
  { id: "uc-705", title: "Recognition Nudge", content: <React.Suspense fallback={<LazyFallback />}><RecognitionNudge /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },
  { id: "uc-706", title: "Employee Communication Drafter", content: <React.Suspense fallback={<LazyFallback />}><EmployeeCommunicationDrafter /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },
  { id: "uc-707", title: "Communication Sentiment Analyzer", content: <React.Suspense fallback={<LazyFallback />}><CommunicationSentimentAnalyzer /></React.Suspense>, level: 4, parent: "domain-7", domain: 7, department: "hr" },

  // Domain 8 - HR Operations & Shared Services (9 agents)
  { id: "domain-8", title: "HR Operations Catalog", content: <React.Suspense fallback={<LazyFallback />}><HROperationsCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 8, department: "hr" },
  { id: "uc-801", title: "HRIS Data Quality Monitor", content: <React.Suspense fallback={<LazyFallback />}><HRISDataQualityMonitor /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-802", title: "Data Change Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><DataChangeOrchestrator /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-803", title: "Query Resolution", content: <React.Suspense fallback={<LazyFallback />}><QueryResolution /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-804", title: "Service Delivery Analytics", content: <React.Suspense fallback={<LazyFallback />}><ServiceDeliveryAnalytics /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-805", title: "Payroll Validation", content: <React.Suspense fallback={<LazyFallback />}><PayrollValidation /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-806", title: "Payroll Reconciliation", content: <React.Suspense fallback={<LazyFallback />}><PayrollReconciliation /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-807", title: "Offboarding Orchestration", content: <React.Suspense fallback={<LazyFallback />}><OffboardingOrchestration /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-808", title: "Exit Interview Synthesizer", content: <React.Suspense fallback={<LazyFallback />}><ExitInterviewSynthesizer /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },
  { id: "uc-809", title: "Attrition Analytics", content: <React.Suspense fallback={<LazyFallback />}><AttritionAnalytics /></React.Suspense>, level: 4, parent: "domain-8", domain: 8, department: "hr" },

  // Domain 9 - DEI & Belonging (4 agents)
  { id: "domain-9", title: "DEI Catalog", content: <React.Suspense fallback={<LazyFallback />}><DEIBelongingCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 9, department: "hr" },
  { id: "uc-901", title: "DEI Dashboard", content: <React.Suspense fallback={<LazyFallback />}><DEIDashboard /></React.Suspense>, level: 4, parent: "domain-9", domain: 9, department: "hr" },
  { id: "uc-902", title: "Inclusive Hiring Audit", content: <React.Suspense fallback={<LazyFallback />}><InclusiveHiringAudit /></React.Suspense>, level: 4, parent: "domain-9", domain: 9, department: "hr" },
  { id: "uc-903", title: "DEI Communication & Programming", content: <React.Suspense fallback={<LazyFallback />}><DEICommunicationProgramming /></React.Suspense>, level: 4, parent: "domain-9", domain: 9, department: "hr" },
  { id: "uc-904", title: "ERG Impact", content: <React.Suspense fallback={<LazyFallback />}><ERGImpact /></React.Suspense>, level: 4, parent: "domain-9", domain: 9, department: "hr" },

  // Domain 10 - People Analytics & HR Technology (5 agents)
  { id: "domain-10", title: "People Analytics Catalog", content: <React.Suspense fallback={<LazyFallback />}><PeopleAnalyticsCatalog /></React.Suspense>, level: 3, parent: "dept-hr", domain: 10, department: "hr" },
  { id: "uc-1001", title: "HR Data Lake Query", content: <React.Suspense fallback={<LazyFallback />}><HRDataLakeQuery /></React.Suspense>, level: 4, parent: "domain-10", domain: 10, department: "hr" },
  { id: "uc-1002", title: "Attrition Prediction", content: <React.Suspense fallback={<LazyFallback />}><AttritionPrediction /></React.Suspense>, level: 4, parent: "domain-10", domain: 10, department: "hr" },
  { id: "uc-1003", title: "Workforce Cost Modeling", content: <React.Suspense fallback={<LazyFallback />}><WorkforceCostModeling /></React.Suspense>, level: 4, parent: "domain-10", domain: 10, department: "hr" },
  { id: "uc-1004", title: "HR Tech Intelligence", content: <React.Suspense fallback={<LazyFallback />}><HRTechIntelligence /></React.Suspense>, level: 4, parent: "domain-10", domain: 10, department: "hr" },
  { id: "uc-1005", title: "Vendor Evaluation Assistant", content: <React.Suspense fallback={<LazyFallback />}><VendorEvaluationAssistant /></React.Suspense>, level: 4, parent: "domain-10", domain: 10, department: "hr" },

  // ═══════════════════════════════════════════════════════
  // PROCUREMENT — 78 AGENTS ACROSS 9 DOMAINS
  // ═══════════════════════════════════════════════════════

  // Domain 11 - Procurement Strategy & Demand Planning (7 agents)
  { id: "domain-11", title: "Procurement Strategy Catalog", content: <React.Suspense fallback={<LazyFallback />}><ProcurementStrategyCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 11, department: "procurement" },
  { id: "uc-1101", title: "Category Strategy Generator", content: <React.Suspense fallback={<LazyFallback />}><CategoryStrategyGenerator /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },
  { id: "uc-1102", title: "Demand Forecasting & Aggregation", content: <React.Suspense fallback={<LazyFallback />}><DemandForecastingAggregation /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },
  { id: "uc-1103", title: "Make-vs-Buy Analyzer", content: <React.Suspense fallback={<LazyFallback />}><MakeVsBuyAnalyzer /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },
  { id: "uc-1104", title: "Procurement Policy Assistant", content: <React.Suspense fallback={<LazyFallback />}><ProcurementPolicyAssistant /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },
  { id: "uc-1105", title: "Savings Pipeline Tracker", content: <React.Suspense fallback={<LazyFallback />}><SavingsPipelineTracker /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },
  { id: "uc-1106", title: "Procurement Maturity Assessor", content: <React.Suspense fallback={<LazyFallback />}><ProcurementMaturityAssessor /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },
  { id: "uc-1107", title: "Stakeholder Satisfaction Analyzer", content: <React.Suspense fallback={<LazyFallback />}><StakeholderSatisfactionAnalyzer /></React.Suspense>, level: 4, parent: "domain-11", domain: 11, department: "procurement" },

  // Domain 12 - Strategic Sourcing & Category Management (12 agents)
  { id: "domain-12", title: "Strategic Sourcing Catalog", content: <React.Suspense fallback={<LazyFallback />}><StrategicSourcingCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 12, department: "procurement" },
  { id: "uc-1201", title: "Spend Classification & Enrichment", content: <React.Suspense fallback={<LazyFallback />}><SpendClassificationEnrichment /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1202", title: "Market Intelligence Monitor", content: <React.Suspense fallback={<LazyFallback />}><MarketIntelligenceMonitor /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1203", title: "Should-Cost Modeler", content: <React.Suspense fallback={<LazyFallback />}><ShouldCostModeler /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1204", title: "RFx Builder & Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><RFxBuilderOrchestrator /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1205", title: "Bid Evaluation Analyzer", content: <React.Suspense fallback={<LazyFallback />}><BidEvaluationAnalyzer /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1206", title: "Auction Strategy Advisor", content: <React.Suspense fallback={<LazyFallback />}><AuctionStrategyAdvisor /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1207", title: "Negotiation Prep Agent", content: <React.Suspense fallback={<LazyFallback />}><NegotiationPrepAgent /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1208", title: "Category Spend Dashboard", content: <React.Suspense fallback={<LazyFallback />}><CategorySpendDashboard /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1209", title: "Sole Source Justification", content: <React.Suspense fallback={<LazyFallback />}><SoleSourceJustification /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1210", title: "Category Roadmap Planner", content: <React.Suspense fallback={<LazyFallback />}><CategoryRoadmapPlanner /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1211", title: "Spec Standardization Agent", content: <React.Suspense fallback={<LazyFallback />}><SpecStandardizationAgent /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },
  { id: "uc-1212", title: "Sourcing Channel Optimizer", content: <React.Suspense fallback={<LazyFallback />}><SourcingChannelOptimizer /></React.Suspense>, level: 4, parent: "domain-12", domain: 12, department: "procurement" },

  // Domain 13 - Supplier Discovery & Qualification (8 agents)
  { id: "domain-13", title: "Supplier Discovery Catalog", content: <React.Suspense fallback={<LazyFallback />}><SupplierDiscoveryCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 13, department: "procurement" },
  { id: "uc-1301", title: "Supplier Discovery & Matching", content: <React.Suspense fallback={<LazyFallback />}><SupplierDiscoveryMatching /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1302", title: "Supplier Pre-Qualification Screener", content: <React.Suspense fallback={<LazyFallback />}><SupplierPreQualScreener /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1303", title: "Financial Health Assessor", content: <React.Suspense fallback={<LazyFallback />}><FinancialHealthAssessor /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1304", title: "Supplier Diversity Tracker", content: <React.Suspense fallback={<LazyFallback />}><SupplierDiversityTracker /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1305", title: "Supplier Onboarding Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><SupplierOnboardingOrchestrator /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1306", title: "Capability Assessment Agent", content: <React.Suspense fallback={<LazyFallback />}><CapabilityAssessmentAgent /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1307", title: "Supplier Consolidation Analyzer", content: <React.Suspense fallback={<LazyFallback />}><SupplierConsolidationAnalyzer /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },
  { id: "uc-1308", title: "Background & Sanctions Screener", content: <React.Suspense fallback={<LazyFallback />}><BackgroundSanctionsScreener /></React.Suspense>, level: 4, parent: "domain-13", domain: 13, department: "procurement" },

  // Domain 14 - Contract Lifecycle Management (9 agents)
  { id: "domain-14", title: "Contract Lifecycle Catalog", content: <React.Suspense fallback={<LazyFallback />}><ContractLifecycleCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 14, department: "procurement" },
  { id: "uc-1401", title: "Contract Authoring Agent", content: <React.Suspense fallback={<LazyFallback />}><ContractAuthoringAgent /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1402", title: "Clause Risk Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ClauseRiskAnalyzer /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1403", title: "Obligation Mining & Tracking", content: <React.Suspense fallback={<LazyFallback />}><ObligationMiningTracking /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1404", title: "Renewal & Expiry Monitor", content: <React.Suspense fallback={<LazyFallback />}><RenewalExpiryMonitor /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1405", title: "Redline Comparison Agent", content: <React.Suspense fallback={<LazyFallback />}><RedlineComparisonAgent /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1406", title: "Contract Compliance Auditor", content: <React.Suspense fallback={<LazyFallback />}><ContractComplianceAuditor /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1407", title: "Agreement Hierarchy Tracker", content: <React.Suspense fallback={<LazyFallback />}><AgreementHierarchyTracker /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1408", title: "Contract Analytics Dashboard", content: <React.Suspense fallback={<LazyFallback />}><ContractAnalyticsDashboard /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },
  { id: "uc-1409", title: "Force Majeure & Termination Advisor", content: <React.Suspense fallback={<LazyFallback />}><ForceMajeureAdvisor /></React.Suspense>, level: 4, parent: "domain-14", domain: 14, department: "procurement" },

  // Domain 15 - Procure-to-Pay Operations (11 agents)
  { id: "domain-15", title: "Procure-to-Pay Catalog", content: <React.Suspense fallback={<LazyFallback />}><ProcureToPayCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 15, department: "procurement" },
  { id: "uc-1501", title: "Requisition Intake & Smart Routing", content: <React.Suspense fallback={<LazyFallback />}><RequisitionIntakeRouting /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1502", title: "Purchase Order Auto-Generation", content: <React.Suspense fallback={<LazyFallback />}><PurchaseOrderAutoGeneration /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1503", title: "Three-Way Match & Exception Handler", content: <React.Suspense fallback={<LazyFallback />}><ThreeWayMatchExceptionHandler /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1504", title: "Invoice Data Extraction", content: <React.Suspense fallback={<LazyFallback />}><InvoiceDataExtraction /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1505", title: "Duplicate Payment Detector", content: <React.Suspense fallback={<LazyFallback />}><DuplicatePaymentDetector /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1506", title: "Maverick Spend Detector & Nudge", content: <React.Suspense fallback={<LazyFallback />}><MaverickSpendDetectorNudge /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1507", title: "Payment Optimization Agent", content: <React.Suspense fallback={<LazyFallback />}><PaymentOptimizationAgent /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1508", title: "Goods Receipt & Service Entry Validator", content: <React.Suspense fallback={<LazyFallback />}><GoodsReceiptValidator /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1509", title: "P2P Cycle Time Analyzer", content: <React.Suspense fallback={<LazyFallback />}><P2PCycleTimeAnalyzer /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1510", title: "Approval Workflow Optimizer", content: <React.Suspense fallback={<LazyFallback />}><ApprovalWorkflowOptimizer /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },
  { id: "uc-1511", title: "P-Card Reconciliation Agent", content: <React.Suspense fallback={<LazyFallback />}><PCardReconciliationAgent /></React.Suspense>, level: 4, parent: "domain-15", domain: 15, department: "procurement" },

  // Domain 16 - Supplier Risk & Compliance (8 agents)
  { id: "domain-16", title: "Supplier Risk Catalog", content: <React.Suspense fallback={<LazyFallback />}><SupplierRiskCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 16, department: "procurement" },
  { id: "uc-1601", title: "Supplier Risk Scoring Engine", content: <React.Suspense fallback={<LazyFallback />}><SupplierRiskScoringEngine /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1602", title: "Supply Chain Disruption Monitor", content: <React.Suspense fallback={<LazyFallback />}><SupplyChainDisruptionMonitor /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1603", title: "Sanctions & Watchlist Screener", content: <React.Suspense fallback={<LazyFallback />}><SanctionsWatchlistScreener /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1604", title: "Regulatory Compliance Tracker", content: <React.Suspense fallback={<LazyFallback />}><RegulatoryComplianceTracker /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1605", title: "Sub-Tier Visibility Agent", content: <React.Suspense fallback={<LazyFallback />}><SubTierVisibilityAgent /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1606", title: "Audit & Corrective Action Tracker", content: <React.Suspense fallback={<LazyFallback />}><AuditCorrectiveActionTracker /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1607", title: "Concentration Risk Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ConcentrationRiskAnalyzer /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },
  { id: "uc-1608", title: "Insurance & Liability Monitor", content: <React.Suspense fallback={<LazyFallback />}><InsuranceLiabilityMonitor /></React.Suspense>, level: 4, parent: "domain-16", domain: 16, department: "procurement" },

  // Domain 17 - Supplier Performance & Relationship (7 agents)
  { id: "domain-17", title: "Supplier Performance Catalog", content: <React.Suspense fallback={<LazyFallback />}><SupplierPerformanceCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 17, department: "procurement" },
  { id: "uc-1701", title: "Supplier Scorecard Generator", content: <React.Suspense fallback={<LazyFallback />}><SupplierScorecardGenerator /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },
  { id: "uc-1702", title: "Quality Incident Analyzer", content: <React.Suspense fallback={<LazyFallback />}><QualityIncidentAnalyzer /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },
  { id: "uc-1703", title: "Delivery Performance Monitor", content: <React.Suspense fallback={<LazyFallback />}><DeliveryPerformanceMonitor /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },
  { id: "uc-1704", title: "Business Review Prep Agent", content: <React.Suspense fallback={<LazyFallback />}><BusinessReviewPrepAgent /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },
  { id: "uc-1705", title: "Supplier Development Planner", content: <React.Suspense fallback={<LazyFallback />}><SupplierDevelopmentPlanner /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },
  { id: "uc-1706", title: "Relationship Health Analyzer", content: <React.Suspense fallback={<LazyFallback />}><RelationshipHealthAnalyzer /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },
  { id: "uc-1707", title: "Innovation & Value Engineering Tracker", content: <React.Suspense fallback={<LazyFallback />}><InnovationValueEngTracker /></React.Suspense>, level: 4, parent: "domain-17", domain: 17, department: "procurement" },

  // Domain 18 - Indirect & Tail Spend Management (6 agents)
  { id: "domain-18", title: "Indirect & Tail Spend Catalog", content: <React.Suspense fallback={<LazyFallback />}><IndirectTailSpendCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 18, department: "procurement" },
  { id: "uc-1801", title: "Tail Spend Classifier & Opportunity Finder", content: <React.Suspense fallback={<LazyFallback />}><TailSpendClassifier /></React.Suspense>, level: 4, parent: "domain-18", domain: 18, department: "procurement" },
  { id: "uc-1802", title: "Catalog Curation & Recommendation", content: <React.Suspense fallback={<LazyFallback />}><CatalogCurationRecommendation /></React.Suspense>, level: 4, parent: "domain-18", domain: 18, department: "procurement" },
  { id: "uc-1803", title: "Spot Buy Negotiation Agent", content: <React.Suspense fallback={<LazyFallback />}><SpotBuyNegotiationAgent /></React.Suspense>, level: 4, parent: "domain-18", domain: 18, department: "procurement" },
  { id: "uc-1804", title: "MRO & Facilities Optimization", content: <React.Suspense fallback={<LazyFallback />}><MROFacilitiesOptimization /></React.Suspense>, level: 4, parent: "domain-18", domain: 18, department: "procurement" },
  { id: "uc-1805", title: "Travel & Expense Compliance Agent", content: <React.Suspense fallback={<LazyFallback />}><TravelExpenseComplianceAgent /></React.Suspense>, level: 4, parent: "domain-18", domain: 18, department: "procurement" },
  { id: "uc-1806", title: "Services Procurement & SOW Manager", content: <React.Suspense fallback={<LazyFallback />}><ServicesProcurementSOWManager /></React.Suspense>, level: 4, parent: "domain-18", domain: 18, department: "procurement" },

  // Domain 19 - Spend Analytics & Procurement Intelligence (10 agents)
  { id: "domain-19", title: "Spend Analytics Catalog", content: <React.Suspense fallback={<LazyFallback />}><SpendAnalyticsCatalog /></React.Suspense>, level: 3, parent: "dept-procurement", domain: 19, department: "procurement" },
  { id: "uc-1901", title: "Spend Cube Builder & Enrichment", content: <React.Suspense fallback={<LazyFallback />}><SpendCubeBuilderEnrichment /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1902", title: "Savings Realization Tracker", content: <React.Suspense fallback={<LazyFallback />}><SavingsRealizationTracker /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1903", title: "Commodity Price Forecaster", content: <React.Suspense fallback={<LazyFallback />}><CommodityPriceForecaster /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1904", title: "Procurement KPI Dashboard", content: <React.Suspense fallback={<LazyFallback />}><ProcurementKPIDashboard /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1905", title: "Total Cost of Ownership Modeler", content: <React.Suspense fallback={<LazyFallback />}><TotalCostOwnershipModeler /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1906", title: "Procurement Value Reporter", content: <React.Suspense fallback={<LazyFallback />}><ProcurementValueReporter /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1907", title: "Price Variance Analyzer", content: <React.Suspense fallback={<LazyFallback />}><PriceVarianceAnalyzer /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1908", title: "Demand Pattern Analyzer", content: <React.Suspense fallback={<LazyFallback />}><DemandPatternAnalyzer /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1909", title: "Benchmark Intelligence Agent", content: <React.Suspense fallback={<LazyFallback />}><BenchmarkIntelligenceAgent /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },
  { id: "uc-1910", title: "What-If Scenario Simulator", content: <React.Suspense fallback={<LazyFallback />}><WhatIfScenarioSimulator /></React.Suspense>, level: 4, parent: "domain-19", domain: 19, department: "procurement" },

  // ═══════════════════════════════════════════════════════
  // FINANCE — 68 AGENTS ACROSS 9 DOMAINS
  // ═══════════════════════════════════════════════════════

  // Domain 20 - FP&A (9 agents)
  { id: "domain-20", title: "FP&A Catalog", content: <React.Suspense fallback={<LazyFallback />}><FPACatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 20, department: "finance" },
  { id: "uc-2001", title: "Budget Builder & Consolidation", content: <React.Suspense fallback={<LazyFallback />}><BudgetBuilderConsolidation /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2002", title: "Rolling Forecast Engine", content: <React.Suspense fallback={<LazyFallback />}><RollingForecastEngine /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2003", title: "Variance Analysis Agent", content: <React.Suspense fallback={<LazyFallback />}><VarianceAnalysisAgent /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2004", title: "Scenario Modeling & Sensitivity", content: <React.Suspense fallback={<LazyFallback />}><ScenarioModelingSensitivity /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2005", title: "CapEx Analyzer", content: <React.Suspense fallback={<LazyFallback />}><CapExAnalyzer /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2006", title: "Headcount Planning Agent", content: <React.Suspense fallback={<LazyFallback />}><HeadcountPlanningAgent /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2007", title: "Revenue Forecasting Agent", content: <React.Suspense fallback={<LazyFallback />}><RevenueForecastingAgent /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2008", title: "Board Deck Generator", content: <React.Suspense fallback={<LazyFallback />}><BoardDeckGenerator /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },
  { id: "uc-2009", title: "FP&A Query Assistant", content: <React.Suspense fallback={<LazyFallback />}><FPAQueryAssistant /></React.Suspense>, level: 4, parent: "domain-20", domain: 20, department: "finance" },

  // Domain 21 - General Ledger & Close (8 agents)
  { id: "domain-21", title: "General Ledger & Close Catalog", content: <React.Suspense fallback={<LazyFallback />}><GeneralLedgerCloseCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 21, department: "finance" },
  { id: "uc-2101", title: "Journal Entry Auto-Posting", content: <React.Suspense fallback={<LazyFallback />}><JournalEntryAutoPosting /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2102", title: "Intercompany Reconciliation", content: <React.Suspense fallback={<LazyFallback />}><IntercompanyReconciliation /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2103", title: "Account Reconciliation Agent", content: <React.Suspense fallback={<LazyFallback />}><AccountReconciliationAgent /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2104", title: "Close Checklist Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><CloseChecklistOrchestrator /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2105", title: "Accruals & Deferrals Engine", content: <React.Suspense fallback={<LazyFallback />}><AccrualsDeferralsEngine /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2106", title: "Trial Balance Validator", content: <React.Suspense fallback={<LazyFallback />}><TrialBalanceValidator /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2107", title: "Month-End Close Analytics", content: <React.Suspense fallback={<LazyFallback />}><MonthEndCloseAnalytics /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },
  { id: "uc-2108", title: "GL Anomaly Detector", content: <React.Suspense fallback={<LazyFallback />}><GLAnomalyDetector /></React.Suspense>, level: 4, parent: "domain-21", domain: 21, department: "finance" },

  // Domain 22 - Accounts Payable (7 agents)
  { id: "domain-22", title: "Accounts Payable Catalog", content: <React.Suspense fallback={<LazyFallback />}><AccountsPayableCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 22, department: "finance" },
  { id: "uc-2201", title: "Invoice Processing & Matching", content: <React.Suspense fallback={<LazyFallback />}><InvoiceProcessingMatching /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },
  { id: "uc-2202", title: "Vendor Payment Optimizer", content: <React.Suspense fallback={<LazyFallback />}><VendorPaymentOptimizer /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },
  { id: "uc-2203", title: "Duplicate Invoice Detector", content: <React.Suspense fallback={<LazyFallback />}><DuplicateInvoiceDetector /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },
  { id: "uc-2204", title: "AP Aging Analyzer", content: <React.Suspense fallback={<LazyFallback />}><APAgingAnalyzer /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },
  { id: "uc-2205", title: "Vendor Master Data Manager", content: <React.Suspense fallback={<LazyFallback />}><VendorMasterDataManager /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },
  { id: "uc-2206", title: "Early Payment Discount Agent", content: <React.Suspense fallback={<LazyFallback />}><EarlyPaymentDiscountAgent /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },
  { id: "uc-2207", title: "AP Policy Compliance Monitor", content: <React.Suspense fallback={<LazyFallback />}><APPolicyComplianceMonitor /></React.Suspense>, level: 4, parent: "domain-22", domain: 22, department: "finance" },

  // Domain 23 - Accounts Receivable (7 agents)
  { id: "domain-23", title: "Accounts Receivable Catalog", content: <React.Suspense fallback={<LazyFallback />}><AccountsReceivableCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 23, department: "finance" },
  { id: "uc-2301", title: "Cash Application Agent", content: <React.Suspense fallback={<LazyFallback />}><CashApplicationAgent /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },
  { id: "uc-2302", title: "Collections Priority Engine", content: <React.Suspense fallback={<LazyFallback />}><CollectionsPriorityEngine /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },
  { id: "uc-2303", title: "Dunning Communication Drafter", content: <React.Suspense fallback={<LazyFallback />}><DunningCommunicationDrafter /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },
  { id: "uc-2304", title: "Credit Risk Scorer", content: <React.Suspense fallback={<LazyFallback />}><CreditRiskScorer /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },
  { id: "uc-2305", title: "AR Aging & DSO Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ARAgingDSOAnalyzer /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },
  { id: "uc-2306", title: "Dispute Resolution Agent", content: <React.Suspense fallback={<LazyFallback />}><DisputeResolutionAgent /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },
  { id: "uc-2307", title: "Customer Payment Predictor", content: <React.Suspense fallback={<LazyFallback />}><CustomerPaymentPredictor /></React.Suspense>, level: 4, parent: "domain-23", domain: 23, department: "finance" },

  // Domain 24 - Treasury & Cash Management (7 agents)
  { id: "domain-24", title: "Treasury & Cash Management Catalog", content: <React.Suspense fallback={<LazyFallback />}><TreasuryCashCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 24, department: "finance" },
  { id: "uc-2401", title: "Cash Flow Forecaster", content: <React.Suspense fallback={<LazyFallback />}><CashFlowForecaster /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },
  { id: "uc-2402", title: "Bank Reconciliation Agent", content: <React.Suspense fallback={<LazyFallback />}><BankReconciliationAgent /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },
  { id: "uc-2403", title: "FX Exposure Monitor", content: <React.Suspense fallback={<LazyFallback />}><FXExposureMonitor /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },
  { id: "uc-2404", title: "Investment Portfolio Optimizer", content: <React.Suspense fallback={<LazyFallback />}><InvestmentPortfolioOptimizer /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },
  { id: "uc-2405", title: "Debt Covenant Tracker", content: <React.Suspense fallback={<LazyFallback />}><DebtCovenantTracker /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },
  { id: "uc-2406", title: "Intercompany Netting Agent", content: <React.Suspense fallback={<LazyFallback />}><IntercompanyNettingAgent /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },
  { id: "uc-2407", title: "Liquidity Dashboard", content: <React.Suspense fallback={<LazyFallback />}><LiquidityDashboard /></React.Suspense>, level: 4, parent: "domain-24", domain: 24, department: "finance" },

  // Domain 25 - Tax & Compliance (8 agents)
  { id: "domain-25", title: "Tax & Compliance Catalog", content: <React.Suspense fallback={<LazyFallback />}><TaxComplianceCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 25, department: "finance" },
  { id: "uc-2501", title: "Tax Provision Calculator", content: <React.Suspense fallback={<LazyFallback />}><TaxProvisionCalculator /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2502", title: "Transfer Pricing Monitor", content: <React.Suspense fallback={<LazyFallback />}><TransferPricingMonitor /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2503", title: "Sales & Use Tax Automation", content: <React.Suspense fallback={<LazyFallback />}><SalesUseTaxAutomation /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2504", title: "Regulatory Filing Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><RegulatoryFilingOrchestrator /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2505", title: "Tax Research Assistant", content: <React.Suspense fallback={<LazyFallback />}><TaxResearchAssistant /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2506", title: "Withholding Tax Agent", content: <React.Suspense fallback={<LazyFallback />}><WithholdingTaxAgent /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2507", title: "Tax Audit Prep Agent", content: <React.Suspense fallback={<LazyFallback />}><TaxAuditPrepAgent /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },
  { id: "uc-2508", title: "Regulatory Change Monitor", content: <React.Suspense fallback={<LazyFallback />}><RegulatoryChangeMonitor /></React.Suspense>, level: 4, parent: "domain-25", domain: 25, department: "finance" },

  // Domain 26 - Internal Audit & Controls (7 agents)
  { id: "domain-26", title: "Internal Audit & Controls Catalog", content: <React.Suspense fallback={<LazyFallback />}><InternalAuditCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 26, department: "finance" },
  { id: "uc-2601", title: "SOX Control Testing Agent", content: <React.Suspense fallback={<LazyFallback />}><SOXControlTestingAgent /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },
  { id: "uc-2602", title: "Continuous Controls Monitor", content: <React.Suspense fallback={<LazyFallback />}><ContinuousControlsMonitor /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },
  { id: "uc-2603", title: "Audit Finding Tracker", content: <React.Suspense fallback={<LazyFallback />}><AuditFindingTracker /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },
  { id: "uc-2604", title: "Risk Assessment Agent", content: <React.Suspense fallback={<LazyFallback />}><RiskAssessmentAgent /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },
  { id: "uc-2605", title: "Policy Compliance Scanner", content: <React.Suspense fallback={<LazyFallback />}><PolicyComplianceScanner /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },
  { id: "uc-2606", title: "Fraud Detection Engine", content: <React.Suspense fallback={<LazyFallback />}><FraudDetectionEngine /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },
  { id: "uc-2607", title: "Audit Report Generator", content: <React.Suspense fallback={<LazyFallback />}><AuditReportGenerator /></React.Suspense>, level: 4, parent: "domain-26", domain: 26, department: "finance" },

  // Domain 27 - Revenue & Cost Accounting (7 agents)
  { id: "domain-27", title: "Revenue & Cost Accounting Catalog", content: <React.Suspense fallback={<LazyFallback />}><RevenueCostAccountingCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 27, department: "finance" },
  { id: "uc-2701", title: "Revenue Recognition Engine", content: <React.Suspense fallback={<LazyFallback />}><RevenueRecognitionEngine /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },
  { id: "uc-2702", title: "Cost Allocation Agent", content: <React.Suspense fallback={<LazyFallback />}><CostAllocationAgent /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },
  { id: "uc-2703", title: "Product Profitability Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ProductProfitabilityAnalyzer /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },
  { id: "uc-2704", title: "Standard Cost Variance Agent", content: <React.Suspense fallback={<LazyFallback />}><StandardCostVarianceAgent /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },
  { id: "uc-2705", title: "ASC 606 Contract Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ASC606ContractAnalyzer /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },
  { id: "uc-2706", title: "Inventory Valuation Agent", content: <React.Suspense fallback={<LazyFallback />}><InventoryValuationAgent /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },
  { id: "uc-2707", title: "COGS Reconciliation Agent", content: <React.Suspense fallback={<LazyFallback />}><COGSReconciliationAgent /></React.Suspense>, level: 4, parent: "domain-27", domain: 27, department: "finance" },

  // Domain 28 - Finance Analytics & Reporting (8 agents)
  { id: "domain-28", title: "Finance Analytics & Reporting Catalog", content: <React.Suspense fallback={<LazyFallback />}><FinanceAnalyticsCatalog /></React.Suspense>, level: 3, parent: "dept-finance", domain: 28, department: "finance" },
  { id: "uc-2801", title: "Financial Statement Generator", content: <React.Suspense fallback={<LazyFallback />}><FinancialStatementGenerator /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2802", title: "Management Reporting Agent", content: <React.Suspense fallback={<LazyFallback />}><ManagementReportingAgent /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2803", title: "KPI Dashboard Builder", content: <React.Suspense fallback={<LazyFallback />}><KPIDashboardBuilder /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2804", title: "Ad-Hoc Query Agent", content: <React.Suspense fallback={<LazyFallback />}><AdHocQueryAgent /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2805", title: "Peer Benchmarking Agent", content: <React.Suspense fallback={<LazyFallback />}><PeerBenchmarkingAgent /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2806", title: "Consolidation & Elimination Agent", content: <React.Suspense fallback={<LazyFallback />}><ConsolidationEliminationAgent /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2807", title: "ESG & Sustainability Reporter", content: <React.Suspense fallback={<LazyFallback />}><ESGSustainabilityReporter /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },
  { id: "uc-2808", title: "Investor Relations Prep Agent", content: <React.Suspense fallback={<LazyFallback />}><InvestorRelationsPrepAgent /></React.Suspense>, level: 4, parent: "domain-28", domain: 28, department: "finance" },

  // ═══════════════════════════════════════════════════════
  // IT — 70 AGENTS ACROSS 9 DOMAINS (Domains 38-46)
  // ═══════════════════════════════════════════════════════

  // Domain 38 - IT Strategy & Portfolio Management (7 agents)
  { id: "domain-38", title: "IT Strategy & Portfolio Catalog", content: <React.Suspense fallback={<LazyFallback />}><ITStrategyPortfolioCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 38, department: "it" },
  { id: "uc-3801", title: "Portfolio Prioritization Engine", content: <React.Suspense fallback={<LazyFallback />}><PortfolioPrioritizationEngine /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },
  { id: "uc-3802", title: "Technology Radar & Trend Scout", content: <React.Suspense fallback={<LazyFallback />}><TechnologyRadarTrendScout /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },
  { id: "uc-3803", title: "IT Budget Forecast Agent", content: <React.Suspense fallback={<LazyFallback />}><ITBudgetForecastAgent /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },
  { id: "uc-3804", title: "Digital Transformation Tracker", content: <React.Suspense fallback={<LazyFallback />}><DigitalTransformationTracker /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },
  { id: "uc-3805", title: "Vendor Rationalization Agent", content: <React.Suspense fallback={<LazyFallback />}><VendorRationalizationAgent /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },
  { id: "uc-3806", title: "IT OKR & KPI Dashboard", content: <React.Suspense fallback={<LazyFallback />}><ITOKRKPIDashboard /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },
  { id: "uc-3807", title: "Strategic Initiative Q&A", content: <React.Suspense fallback={<LazyFallback />}><StrategicInitiativeQA /></React.Suspense>, level: 4, parent: "domain-38", domain: 38, department: "it" },

  // Domain 39 - Software Engineering & DevOps (9 agents)
  { id: "domain-39", title: "Software Engineering Catalog", content: <React.Suspense fallback={<LazyFallback />}><SoftwareEngineeringCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 39, department: "it" },
  { id: "uc-3901", title: "CI/CD Pipeline Optimizer", content: <React.Suspense fallback={<LazyFallback />}><CICDPipelineOptimizer /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3902", title: "Code Review Assistant", content: <React.Suspense fallback={<LazyFallback />}><CodeReviewAssistant /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3903", title: "Tech Debt Prioritizer", content: <React.Suspense fallback={<LazyFallback />}><TechDebtPrioritizer /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3904", title: "Release Notes Generator", content: <React.Suspense fallback={<LazyFallback />}><ReleaseNotesGenerator /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3905", title: "Incident-to-Code Tracer", content: <React.Suspense fallback={<LazyFallback />}><IncidentToCodeTracer /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3906", title: "Dependency & Vulnerability Scanner", content: <React.Suspense fallback={<LazyFallback />}><DependencyVulnerabilityScanner /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3907", title: "Feature Flag Manager", content: <React.Suspense fallback={<LazyFallback />}><FeatureFlagManager /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3908", title: "Developer Experience Surveyor", content: <React.Suspense fallback={<LazyFallback />}><DeveloperExperienceSurveyor /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },
  { id: "uc-3909", title: "IaC Drift Detector", content: <React.Suspense fallback={<LazyFallback />}><IaCDriftDetector /></React.Suspense>, level: 4, parent: "domain-39", domain: 39, department: "it" },

  // Domain 40 - Infrastructure & Cloud Operations (8 agents)
  { id: "domain-40", title: "Infrastructure & Cloud Ops Catalog", content: <React.Suspense fallback={<LazyFallback />}><InfraCloudOpsCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 40, department: "it" },
  { id: "uc-4001", title: "Cloud Cost Optimizer", content: <React.Suspense fallback={<LazyFallback />}><CloudCostOptimizer /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4002", title: "Capacity Planning Agent", content: <React.Suspense fallback={<LazyFallback />}><CapacityPlanningAgent /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4003", title: "Incident Auto-Remediator", content: <React.Suspense fallback={<LazyFallback />}><IncidentAutoRemediator /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4004", title: "SLO/SLI Monitor & Reporter", content: <React.Suspense fallback={<LazyFallback />}><SLOSLIMonitorReporter /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4005", title: "Kubernetes Cluster Optimizer", content: <React.Suspense fallback={<LazyFallback />}><KubernetesClusterOptimizer /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4006", title: "Database Performance Advisor", content: <React.Suspense fallback={<LazyFallback />}><DatabasePerformanceAdvisor /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4007", title: "Network & DNS Health Monitor", content: <React.Suspense fallback={<LazyFallback />}><NetworkDNSHealthMonitor /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },
  { id: "uc-4008", title: "Backup & DR Compliance Agent", content: <React.Suspense fallback={<LazyFallback />}><BackupDRComplianceAgent /></React.Suspense>, level: 4, parent: "domain-40", domain: 40, department: "it" },

  // Domain 41 - Cybersecurity & Threat Management (9 agents)
  { id: "domain-41", title: "Cybersecurity Catalog", content: <React.Suspense fallback={<LazyFallback />}><CybersecurityCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 41, department: "it" },
  { id: "uc-4101", title: "Threat Intelligence Aggregator", content: <React.Suspense fallback={<LazyFallback />}><ThreatIntelligenceAggregator /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4102", title: "Vulnerability Prioritization Agent", content: <React.Suspense fallback={<LazyFallback />}><VulnerabilityPrioritizationAgent /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4103", title: "SIEM Alert Triage Agent", content: <React.Suspense fallback={<LazyFallback />}><SIEMAlertTriageAgent /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4104", title: "Phishing & Email Threat Analyzer", content: <React.Suspense fallback={<LazyFallback />}><PhishingEmailThreatAnalyzer /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4105", title: "Identity & Access Anomaly Detector", content: <React.Suspense fallback={<LazyFallback />}><IdentityAccessAnomalyDetector /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4106", title: "Compliance Posture Scanner", content: <React.Suspense fallback={<LazyFallback />}><CompliancePostureScanner /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4107", title: "Pen Test Findings Tracker", content: <React.Suspense fallback={<LazyFallback />}><PenTestFindingsTracker /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4108", title: "Security Incident Responder", content: <React.Suspense fallback={<LazyFallback />}><SecurityIncidentResponder /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },
  { id: "uc-4109", title: "Zero Trust Policy Evaluator", content: <React.Suspense fallback={<LazyFallback />}><ZeroTrustPolicyEvaluator /></React.Suspense>, level: 4, parent: "domain-41", domain: 41, department: "it" },

  // Domain 42 - IT Service Management / ITSM (8 agents)
  { id: "domain-42", title: "IT Service Management Catalog", content: <React.Suspense fallback={<LazyFallback />}><ITServiceManagementCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 42, department: "it" },
  { id: "uc-4201", title: "Intelligent Ticket Router", content: <React.Suspense fallback={<LazyFallback />}><IntelligentTicketRouter /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4202", title: "Knowledge Base Auto-Resolver", content: <React.Suspense fallback={<LazyFallback />}><KnowledgeBaseAutoResolver /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4203", title: "SLA Breach Predictor", content: <React.Suspense fallback={<LazyFallback />}><SLABreachPredictor /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4204", title: "Change Risk Assessor", content: <React.Suspense fallback={<LazyFallback />}><ChangeRiskAssessor /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4205", title: "Major Incident Coordinator", content: <React.Suspense fallback={<LazyFallback />}><MajorIncidentCoordinator /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4206", title: "Problem Management Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ProblemManagementAnalyzer /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4207", title: "Service Catalog Recommender", content: <React.Suspense fallback={<LazyFallback />}><ServiceCatalogRecommender /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },
  { id: "uc-4208", title: "ITSM Analytics Dashboard", content: <React.Suspense fallback={<LazyFallback />}><ITSMAnalyticsDashboard /></React.Suspense>, level: 4, parent: "domain-42", domain: 42, department: "it" },

  // Domain 43 - Data & AI Platform (7 agents)
  { id: "domain-43", title: "Data & AI Platform Catalog", content: <React.Suspense fallback={<LazyFallback />}><DataAIPlatformCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 43, department: "it" },
  { id: "uc-4301", title: "Data Pipeline Health Monitor", content: <React.Suspense fallback={<LazyFallback />}><DataPipelineHealthMonitor /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },
  { id: "uc-4302", title: "Data Quality Scorecard", content: <React.Suspense fallback={<LazyFallback />}><DataQualityScorecard /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },
  { id: "uc-4303", title: "ML Model Registry Monitor", content: <React.Suspense fallback={<LazyFallback />}><MLModelRegistryMonitor /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },
  { id: "uc-4304", title: "Feature Store Manager", content: <React.Suspense fallback={<LazyFallback />}><FeatureStoreManager /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },
  { id: "uc-4305", title: "Cost-per-Query Optimizer", content: <React.Suspense fallback={<LazyFallback />}><CostPerQueryOptimizer /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },
  { id: "uc-4306", title: "Data Catalog & Lineage Agent", content: <React.Suspense fallback={<LazyFallback />}><DataCatalogLineageAgent /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },
  { id: "uc-4307", title: "AI Ethics & Bias Monitor", content: <React.Suspense fallback={<LazyFallback />}><AIEthicsBiasMonitor /></React.Suspense>, level: 4, parent: "domain-43", domain: 43, department: "it" },

  // Domain 44 - Enterprise Architecture (7 agents)
  { id: "domain-44", title: "Enterprise Architecture Catalog", content: <React.Suspense fallback={<LazyFallback />}><EnterpriseArchitectureCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 44, department: "it" },
  { id: "uc-4401", title: "ADR Drafter", content: <React.Suspense fallback={<LazyFallback />}><ADRDrafter /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },
  { id: "uc-4402", title: "API Catalog & Governance", content: <React.Suspense fallback={<LazyFallback />}><APICatalogGovernance /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },
  { id: "uc-4403", title: "System Dependency Mapper", content: <React.Suspense fallback={<LazyFallback />}><SystemDependencyMapper /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },
  { id: "uc-4404", title: "Technology Lifecycle Manager", content: <React.Suspense fallback={<LazyFallback />}><TechnologyLifecycleManager /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },
  { id: "uc-4405", title: "Integration Pattern Advisor", content: <React.Suspense fallback={<LazyFallback />}><IntegrationPatternAdvisor /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },
  { id: "uc-4406", title: "Architecture Compliance Scanner", content: <React.Suspense fallback={<LazyFallback />}><ArchitectureComplianceScanner /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },
  { id: "uc-4407", title: "Reference Architecture Generator", content: <React.Suspense fallback={<LazyFallback />}><ReferenceArchitectureGenerator /></React.Suspense>, level: 4, parent: "domain-44", domain: 44, department: "it" },

  // Domain 45 - IT Governance & Compliance (7 agents)
  { id: "domain-45", title: "IT Governance & Compliance Catalog", content: <React.Suspense fallback={<LazyFallback />}><ITGovernanceCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 45, department: "it" },
  { id: "uc-4501", title: "IT Control Testing Agent", content: <React.Suspense fallback={<LazyFallback />}><ITControlTestingAgent /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },
  { id: "uc-4502", title: "Audit Evidence Collector", content: <React.Suspense fallback={<LazyFallback />}><AuditEvidenceCollector /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },
  { id: "uc-4503", title: "Policy Lifecycle Manager", content: <React.Suspense fallback={<LazyFallback />}><PolicyLifecycleManager /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },
  { id: "uc-4504", title: "License Compliance Monitor", content: <React.Suspense fallback={<LazyFallback />}><LicenseComplianceMonitor /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },
  { id: "uc-4505", title: "Risk Register Agent", content: <React.Suspense fallback={<LazyFallback />}><RiskRegisterAgent /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },
  { id: "uc-4506", title: "Regulatory Change Monitor", content: <React.Suspense fallback={<LazyFallback />}><ITRegulatoryChangeMonitor /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },
  { id: "uc-4507", title: "IT GRC Dashboard", content: <React.Suspense fallback={<LazyFallback />}><ITGRCDashboard /></React.Suspense>, level: 4, parent: "domain-45", domain: 45, department: "it" },

  // Domain 46 - End User Computing & Productivity (8 agents)
  { id: "domain-46", title: "End User Computing Catalog", content: <React.Suspense fallback={<LazyFallback />}><EndUserComputingCatalog /></React.Suspense>, level: 3, parent: "dept-it", domain: 46, department: "it" },
  { id: "uc-4601", title: "Device Lifecycle Manager", content: <React.Suspense fallback={<LazyFallback />}><DeviceLifecycleManager /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4602", title: "Access Provisioning Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><AccessProvisioningOrchestrator /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4603", title: "Workspace Analytics Agent", content: <React.Suspense fallback={<LazyFallback />}><WorkspaceAnalyticsAgent /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4604", title: "Self-Service IT Bot", content: <React.Suspense fallback={<LazyFallback />}><SelfServiceITBot /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4605", title: "Endpoint Security Posture", content: <React.Suspense fallback={<LazyFallback />}><EndpointSecurityPosture /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4606", title: "Meeting Room & Resource Optimizer", content: <React.Suspense fallback={<LazyFallback />}><MeetingRoomOptimizer /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4607", title: "Onboarding Tech Setup", content: <React.Suspense fallback={<LazyFallback />}><OnboardingTechSetup /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },
  { id: "uc-4608", title: "Shadow IT Detector", content: <React.Suspense fallback={<LazyFallback />}><ShadowITDetector /></React.Suspense>, level: 4, parent: "domain-46", domain: 46, department: "it" },

  // ═══════════════════════════════════════════════════════
  // MARKETING — 65 AGENTS ACROSS 9 DOMAINS (Domains 29-37)
  // ═══════════════════════════════════════════════════════

  // Domain 29 - Marketing Strategy & Planning (7 agents)
  { id: "domain-29", title: "Marketing Strategy Catalog", content: <React.Suspense fallback={<LazyFallback />}><MarketingStrategyCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 29, department: "marketing" },
  { id: "uc-2901", title: "Marketing Plan Generator", content: <React.Suspense fallback={<LazyFallback />}><MarketingPlanGenerator /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },
  { id: "uc-2902", title: "Budget Allocator & Forecaster", content: <React.Suspense fallback={<LazyFallback />}><BudgetAllocatorForecaster /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },
  { id: "uc-2903", title: "Competitive Intelligence Monitor", content: <React.Suspense fallback={<LazyFallback />}><CompetitiveIntelligenceMonitor /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },
  { id: "uc-2904", title: "GTM Launch Planner", content: <React.Suspense fallback={<LazyFallback />}><GTMLaunchPlanner /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },
  { id: "uc-2905", title: "Audience Segmentation Engine", content: <React.Suspense fallback={<LazyFallback />}><AudienceSegmentationEngine /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },
  { id: "uc-2906", title: "Campaign Calendar Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><CampaignCalendarOrchestrator /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },
  { id: "uc-2907", title: "Marketing OKR Tracker", content: <React.Suspense fallback={<LazyFallback />}><MarketingOKRTracker /></React.Suspense>, level: 4, parent: "domain-29", domain: 29, department: "marketing" },

  // Domain 30 - Content & Creative Operations (8 agents)
  { id: "domain-30", title: "Content & Creative Catalog", content: <React.Suspense fallback={<LazyFallback />}><ContentCreativeCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 30, department: "marketing" },
  { id: "uc-3001", title: "Content Brief Generator", content: <React.Suspense fallback={<LazyFallback />}><ContentBriefGenerator /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3002", title: "Long-Form Content Drafter", content: <React.Suspense fallback={<LazyFallback />}><LongFormContentDrafter /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3003", title: "Creative Asset Generator", content: <React.Suspense fallback={<LazyFallback />}><CreativeAssetGenerator /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3004", title: "Content Performance Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ContentPerformanceAnalyzer /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3005", title: "Email Copy Optimizer", content: <React.Suspense fallback={<LazyFallback />}><EmailCopyOptimizer /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3006", title: "Content Repurposing Agent", content: <React.Suspense fallback={<LazyFallback />}><ContentRepurposingAgent /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3007", title: "Brand Voice Checker", content: <React.Suspense fallback={<LazyFallback />}><BrandVoiceChecker /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },
  { id: "uc-3008", title: "DAM & Content Lifecycle Manager", content: <React.Suspense fallback={<LazyFallback />}><DAMContentLifecycleManager /></React.Suspense>, level: 4, parent: "domain-30", domain: 30, department: "marketing" },

  // Domain 31 - Demand Generation & Campaigns (8 agents)
  { id: "domain-31", title: "Demand Generation Catalog", content: <React.Suspense fallback={<LazyFallback />}><DemandGenerationCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 31, department: "marketing" },
  { id: "uc-3101", title: "Campaign Builder & Orchestrator", content: <React.Suspense fallback={<LazyFallback />}><CampaignBuilderOrchestrator /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3102", title: "Lead Scoring & Qualification Agent", content: <React.Suspense fallback={<LazyFallback />}><LeadScoringQualificationAgent /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3103", title: "ABM Campaign Manager", content: <React.Suspense fallback={<LazyFallback />}><ABMCampaignManager /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3104", title: "Paid Media Optimizer", content: <React.Suspense fallback={<LazyFallback />}><PaidMediaOptimizer /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3105", title: "Webinar & Event Engine", content: <React.Suspense fallback={<LazyFallback />}><WebinarEventEngine /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3106", title: "Lead Nurture Optimizer", content: <React.Suspense fallback={<LazyFallback />}><LeadNurtureOptimizer /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3107", title: "Landing Page Optimizer", content: <React.Suspense fallback={<LazyFallback />}><LandingPageOptimizer /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },
  { id: "uc-3108", title: "Campaign ROI Analyzer", content: <React.Suspense fallback={<LazyFallback />}><CampaignROIAnalyzer /></React.Suspense>, level: 4, parent: "domain-31", domain: 31, department: "marketing" },

  // Domain 32 - Digital Marketing & SEO/SEM (7 agents)
  { id: "domain-32", title: "Digital Marketing Catalog", content: <React.Suspense fallback={<LazyFallback />}><DigitalMarketingCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 32, department: "marketing" },
  { id: "uc-3201", title: "SEO Audit Engine", content: <React.Suspense fallback={<LazyFallback />}><SEOAuditEngine /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },
  { id: "uc-3202", title: "Keyword Strategy Agent", content: <React.Suspense fallback={<LazyFallback />}><KeywordStrategyAgent /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },
  { id: "uc-3203", title: "PPC Bid Management Agent", content: <React.Suspense fallback={<LazyFallback />}><PPCBidManagementAgent /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },
  { id: "uc-3204", title: "Ad Copy Generator", content: <React.Suspense fallback={<LazyFallback />}><AdCopyGenerator /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },
  { id: "uc-3205", title: "Website Personalization Engine", content: <React.Suspense fallback={<LazyFallback />}><WebsitePersonalizationEngine /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },
  { id: "uc-3206", title: "Technical SEO Monitor", content: <React.Suspense fallback={<LazyFallback />}><TechnicalSEOMonitor /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },
  { id: "uc-3207", title: "Conversion Rate Optimizer", content: <React.Suspense fallback={<LazyFallback />}><ConversionRateOptimizer /></React.Suspense>, level: 4, parent: "domain-32", domain: 32, department: "marketing" },

  // Domain 33 - Social Media & Community (6 agents)
  { id: "domain-33", title: "Social Media Catalog", content: <React.Suspense fallback={<LazyFallback />}><SocialMediaCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 33, department: "marketing" },
  { id: "uc-3301", title: "Social Content Calendar Manager", content: <React.Suspense fallback={<LazyFallback />}><SocialContentCalendarManager /></React.Suspense>, level: 4, parent: "domain-33", domain: 33, department: "marketing" },
  { id: "uc-3302", title: "Social Listening Analyzer", content: <React.Suspense fallback={<LazyFallback />}><SocialListeningAnalyzer /></React.Suspense>, level: 4, parent: "domain-33", domain: 33, department: "marketing" },
  { id: "uc-3303", title: "Community Engagement Responder", content: <React.Suspense fallback={<LazyFallback />}><CommunityEngagementResponder /></React.Suspense>, level: 4, parent: "domain-33", domain: 33, department: "marketing" },
  { id: "uc-3304", title: "Influencer Discovery & Tracker", content: <React.Suspense fallback={<LazyFallback />}><InfluencerDiscoveryTracker /></React.Suspense>, level: 4, parent: "domain-33", domain: 33, department: "marketing" },
  { id: "uc-3305", title: "Social Media Analytics Dashboard", content: <React.Suspense fallback={<LazyFallback />}><SocialMediaAnalyticsDashboard /></React.Suspense>, level: 4, parent: "domain-33", domain: 33, department: "marketing" },
  { id: "uc-3306", title: "UGC & Advocacy Manager", content: <React.Suspense fallback={<LazyFallback />}><UGCAdvocacyManager /></React.Suspense>, level: 4, parent: "domain-33", domain: 33, department: "marketing" },

  // Domain 34 - Marketing Analytics & Attribution (8 agents)
  { id: "domain-34", title: "Marketing Analytics Catalog", content: <React.Suspense fallback={<LazyFallback />}><MarketingAnalyticsCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 34, department: "marketing" },
  { id: "uc-3401", title: "Multi-Touch Attribution Engine", content: <React.Suspense fallback={<LazyFallback />}><MultiTouchAttributionEngine /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3402", title: "Marketing Dashboard Generator", content: <React.Suspense fallback={<LazyFallback />}><MarketingDashboardGenerator /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3403", title: "A/B Test Analyzer", content: <React.Suspense fallback={<LazyFallback />}><ABTestAnalyzer /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3404", title: "Customer Journey Mapper", content: <React.Suspense fallback={<LazyFallback />}><CustomerJourneyMapper /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3405", title: "Marketing Mix Modeler", content: <React.Suspense fallback={<LazyFallback />}><MarketingMixModeler /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3406", title: "Funnel Velocity Analyzer", content: <React.Suspense fallback={<LazyFallback />}><FunnelVelocityAnalyzer /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3407", title: "Predictive Pipeline Forecaster", content: <React.Suspense fallback={<LazyFallback />}><PredictivePipelineForecaster /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },
  { id: "uc-3408", title: "Data Quality & Governance Agent", content: <React.Suspense fallback={<LazyFallback />}><DataQualityGovernanceAgent /></React.Suspense>, level: 4, parent: "domain-34", domain: 34, department: "marketing" },

  // Domain 35 - Brand & Communications (7 agents)
  { id: "domain-35", title: "Brand & Communications Catalog", content: <React.Suspense fallback={<LazyFallback />}><BrandCommsCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 35, department: "marketing" },
  { id: "uc-3501", title: "Brand Health Monitor", content: <React.Suspense fallback={<LazyFallback />}><BrandHealthMonitor /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },
  { id: "uc-3502", title: "Press Release & Comms Drafter", content: <React.Suspense fallback={<LazyFallback />}><PressReleaseDrafter /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },
  { id: "uc-3503", title: "Crisis Communications Advisor", content: <React.Suspense fallback={<LazyFallback />}><CrisisCommsAdvisor /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },
  { id: "uc-3504", title: "Executive Thought Leadership Agent", content: <React.Suspense fallback={<LazyFallback />}><ExecThoughtLeadership /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },
  { id: "uc-3505", title: "Brand Guidelines Enforcer", content: <React.Suspense fallback={<LazyFallback />}><BrandGuidelinesEnforcer /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },
  { id: "uc-3506", title: "Internal Communications Drafter", content: <React.Suspense fallback={<LazyFallback />}><InternalCommsDrafter /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },
  { id: "uc-3507", title: "Analyst & Influencer Relations Tracker", content: <React.Suspense fallback={<LazyFallback />}><AnalystRelationsTracker /></React.Suspense>, level: 4, parent: "domain-35", domain: 35, department: "marketing" },

  // Domain 36 - Marketing Operations & MarTech (7 agents)
  { id: "domain-36", title: "Marketing Operations Catalog", content: <React.Suspense fallback={<LazyFallback />}><MarketingOperationsCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 36, department: "marketing" },
  { id: "uc-3601", title: "MarTech Stack Health Monitor", content: <React.Suspense fallback={<LazyFallback />}><MarTechHealthMonitor /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },
  { id: "uc-3602", title: "Lead Routing & Assignment Engine", content: <React.Suspense fallback={<LazyFallback />}><LeadRoutingEngine /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },
  { id: "uc-3603", title: "Campaign Ops Workflow Builder", content: <React.Suspense fallback={<LazyFallback />}><CampaignOpsWorkflowBuilder /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },
  { id: "uc-3604", title: "List Management & Segmentation Agent", content: <React.Suspense fallback={<LazyFallback />}><ListManagementAgent /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },
  { id: "uc-3605", title: "Email Deliverability Manager", content: <React.Suspense fallback={<LazyFallback />}><EmailDeliverabilityManager /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },
  { id: "uc-3606", title: "UTM & Tracking Governance Agent", content: <React.Suspense fallback={<LazyFallback />}><UTMGovernanceAgent /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },
  { id: "uc-3607", title: "Marketing Compliance & Consent Manager", content: <React.Suspense fallback={<LazyFallback />}><MarketingComplianceManager /></React.Suspense>, level: 4, parent: "domain-36", domain: 36, department: "marketing" },

  // Domain 37 - Customer & Market Intelligence (7 agents)
  { id: "domain-37", title: "Customer & Market Intelligence Catalog", content: <React.Suspense fallback={<LazyFallback />}><CustomerIntelCatalog /></React.Suspense>, level: 3, parent: "dept-marketing", domain: 37, department: "marketing" },
  { id: "uc-3701", title: "Market Research Synthesizer", content: <React.Suspense fallback={<LazyFallback />}><MarketResearchSynthesizer /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },
  { id: "uc-3702", title: "Win/Loss Analysis Agent", content: <React.Suspense fallback={<LazyFallback />}><WinLossAnalysisAgent /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },
  { id: "uc-3703", title: "Customer Voice & Review Monitor", content: <React.Suspense fallback={<LazyFallback />}><CustomerVoiceMonitor /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },
  { id: "uc-3704", title: "Persona & ICP Refiner", content: <React.Suspense fallback={<LazyFallback />}><PersonaICPRefiner /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },
  { id: "uc-3705", title: "Competitive Battle Card Generator", content: <React.Suspense fallback={<LazyFallback />}><CompetitiveBattleCards /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },
  { id: "uc-3706", title: "Sales Enablement Content Agent", content: <React.Suspense fallback={<LazyFallback />}><SalesEnablementContentAgent /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },
  { id: "uc-3707", title: "Market Trend & Signal Detector", content: <React.Suspense fallback={<LazyFallback />}><MarketTrendDetector /></React.Suspense>, level: 4, parent: "domain-37", domain: 37, department: "marketing" },

  // ═══════════════════════════════════════════════════════
  // ACT VI — THE PROOF
  // Show the transformation in action
  // ═══════════════════════════════════════════════════════

  { id: "act-6", title: "The Proof", content: <SectionDividerSlide sectionNumber="V" title="The Transformation" subtitle="As-Is to To-Be — step by step, process by process, with measurable impact at every stage." quote="Culture eats strategy for breakfast. But agents eat administrative overhead for lunch." icon={BarChart3} accentColor="#ef4444" />, level: 0 },
  { id: "transformation", title: "Transformation Blueprint", content: <TransformationBlueprintSlide />, level: 0 },
  { id: "impact", title: "Strategic Impact", content: <ImpactSlide />, level: 0 },

  // ═══════════════════════════════════════════════════════
  // ACT VII — THE PATH FORWARD
  // How to start, what to build first, the journey
  // ═══════════════════════════════════════════════════════

  { id: "act-7", title: "The Path", content: <SectionDividerSlide sectionNumber="VI" title="The Path Forward" subtitle="Start small. Think big. Move fast. Three agent archetypes to launch in 90 days." quote="A journey of a thousand miles begins with a single step. In agentic transformation, that step is your first deployed agent." icon={Rocket} accentColor="#005bbf" />, level: 0 },
  { id: "build-talent-scout", title: "Build: Talent Scout", content: <BuildTalentScoutSlide />, level: 0 },
  { id: "build-people-partner", title: "Build: People Partner", content: <BuildPeoplePartnerSlide />, level: 0 },
  { id: "build-ops-architect", title: "Build: Ops Architect", content: <BuildOpsArchitectSlide />, level: 0 },
  { id: "roadmap", title: "Implementation Roadmap", content: <RoadmapSlide />, level: 0 },

  // ═══════════════════════════════════════════════════════
  // THE CLOSE
  // ═══════════════════════════════════════════════════════

  { id: "closing", title: "The Future is Agentic", content: <ClosingCTASlide />, level: 0 },
  { id: "deploy-your-own", title: "Deploy Your Own", content: <DeployYourOwnSlide />, level: 0 },
];
