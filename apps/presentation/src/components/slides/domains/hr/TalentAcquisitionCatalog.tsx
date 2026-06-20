import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { ClipboardCheck, Search, Calendar, UserPlus, ListOrdered, PieChart, ClipboardList, FileCheck, DollarSign, CheckSquare, HelpCircle, TrendingUp, Users } from "lucide-react";

export const TalentAcquisitionCatalog = () => (
  <DomainCatalogSlide
    title="Talent Acquisition & Onboarding"
    subtitle="Domain 02 • Growth & Integration"
    description="Streamlining the journey from requisition to day one through autonomous orchestration and intelligent screening."
    color="#10b981"
    useCases={[
      {
        id: "uc-201",
        title: "Requisition Intake",
        icon: ClipboardCheck,
        description: "Conversational intake with real-time budget and comp validation."
      },
      {
        id: "uc-202",
        title: "Req Prioritization",
        icon: ListOrdered,
        description: "AI-driven priority scoring based on business criticality and revenue impact."
      },
      {
        id: "uc-203",
        title: "Candidate Sourcing",
        icon: Search,
        description: "Multi-channel intelligent sourcing with passive candidate nurture."
      },
      {
        id: "uc-204",
        title: "Resume Screening",
        icon: Users,
        description: "Deep reasoning over candidate profiles with bias detection."
      },
      {
        id: "uc-205",
        title: "Channel Analytics",
        icon: PieChart,
        description: "Real-time channel performance with cost-per-quality-hire metrics."
      },
      {
        id: "uc-206",
        title: "Scorecard Builder",
        icon: ClipboardList,
        description: "Auto-generates role-specific structured interview guides and scorecards."
      },
      {
        id: "uc-207",
        title: "Interview Scheduling",
        icon: Calendar,
        description: "Autonomous multi-panel coordination and self-healing loops."
      },
      {
        id: "uc-208",
        title: "Debrief Summarizer",
        icon: FileCheck,
        description: "Structured debrief docs with consensus analysis and selection rationale."
      },
      {
        id: "uc-209",
        title: "Offer Modeler",
        icon: DollarSign,
        description: "Market-calibrated offer modeling with scenario comparison."
      },
      {
        id: "uc-210",
        title: "Pre-boarding",
        icon: CheckSquare,
        description: "Cross-functional pre-boarding orchestration with proactive escalation."
      },
      {
        id: "uc-211",
        title: "Onboarding",
        icon: UserPlus,
        description: "Multi-system task automation for seamless day-one readiness."
      },
      {
        id: "uc-212",
        title: "New Hire Q&A",
        icon: HelpCircle,
        description: "AI-powered conversational assistant for new hire questions."
      },
      {
        id: "uc-213",
        title: "Onboarding Analytics",
        icon: TrendingUp,
        description: "Multi-signal onboarding effectiveness scoring with attrition flags."
      }
    ]}
  />
);
