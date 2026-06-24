import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Coffee, MessageSquare, Briefcase, Target, Activity, TrendingUp, BarChart2, RotateCcw, GitBranch, Star, Rocket } from "lucide-react";

export const PerformanceManagementCatalog = () => (
  <DomainCatalogSlide
    title="Performance & Talent Management"
    subtitle="Domain 03 • Excellence & Potential"
    description="Elevating the employee experience through continuous feedback, objective assessments, and proactive succession planning."
    color="#8b5cf6"
    useCases={[
      {
        id: "uc-301",
        title: "Goal Drafting",
        icon: Target,
        description: "SMART goal generation with auto-cascading from company OKRs."
      },
      {
        id: "uc-302",
        title: "OKR Tracker",
        icon: Activity,
        description: "Continuous OKR monitoring with automated nudges for stalled goals."
      },
      {
        id: "uc-303",
        title: "1:1 Meeting Prep",
        icon: Coffee,
        description: "Auto-generated agendas with real-time performance and goal signals."
      },
      {
        id: "uc-304",
        title: "Feedback Trends",
        icon: TrendingUp,
        description: "NLP-powered feedback theme extraction and sentiment trend analysis."
      },
      {
        id: "uc-305",
        title: "Narrative Assistant",
        icon: MessageSquare,
        description: "High-quality, bias-free performance review drafting from bullets."
      },
      {
        id: "uc-306",
        title: "Calibration Analytics",
        icon: BarChart2,
        description: "Pre-calibration analytics surfacing distribution anomalies and bias."
      },
      {
        id: "uc-307",
        title: "Review Orchestration",
        icon: RotateCcw,
        description: "Automated cycle launch with real-time completion dashboards."
      },
      {
        id: "uc-308",
        title: "Successor Readiness",
        icon: Briefcase,
        description: "Data-driven potential assessment and automated 9-box mapping."
      },
      {
        id: "uc-309",
        title: "Succession Pipeline",
        icon: GitBranch,
        description: "Real-time pipeline visibility with critical role risk scoring."
      },
      {
        id: "uc-310",
        title: "HiPo Identification",
        icon: Star,
        description: "Multi-signal HiPo scoring with bias-adjusted nominations."
      },
      {
        id: "uc-311",
        title: "HiPo Journey",
        icon: Rocket,
        description: "Personalized development journeys with milestone-based readiness tracking."
      }
    ]}
  />
);
