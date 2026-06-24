import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { GitBranch, LayoutDashboard, FlaskConical, Route, PieChart, Gauge, TrendingUp, ShieldCheck } from "lucide-react";

export const MarketingAnalyticsCatalog = () => (
  <DomainCatalogSlide
    title="Marketing Analytics & Attribution"
    subtitle="Domain 34 • Marketing Analytics"
    description="Transforming marketing measurement from backward-looking reporting to predictive intelligence through multi-touch attribution, marketing mix modeling, and AI-powered funnel diagnostics."
    color="#059669"
    useCases={[
      {
        id: "uc-3401",
        title: "Multi-Touch Attribution Engine",
        icon: GitBranch,
        description: "Data-driven attribution with Shapley value and Markov chain models plus business context interpretation."
      },
      {
        id: "uc-3402",
        title: "Marketing Dashboard Generator",
        icon: LayoutDashboard,
        description: "Auto-refreshing dashboards with natural language Q&A and narrative KPI explanations."
      },
      {
        id: "uc-3403",
        title: "A/B Test Analyzer",
        icon: FlaskConical,
        description: "Automated significance testing with segment-level analysis and strategic result interpretation."
      },
      {
        id: "uc-3404",
        title: "Customer Journey Mapper",
        icon: Route,
        description: "Cross-channel journey stitching with sequential pattern mining and multi-stakeholder engagement detection."
      },
      {
        id: "uc-3405",
        title: "Marketing Mix Modeler",
        icon: PieChart,
        description: "In-house Bayesian MMM with response curves, saturation detection, and actionable budget recommendations."
      },
      {
        id: "uc-3406",
        title: "Funnel Velocity Analyzer",
        icon: Gauge,
        description: "Stage-by-stage conversion analysis with contextual bottleneck diagnosis and capacity-aware root causes."
      },
      {
        id: "uc-3407",
        title: "Predictive Pipeline Forecaster",
        icon: TrendingUp,
        description: "Intent-enriched pipeline forecasting with deal-level risk scoring and scenario modeling."
      },
      {
        id: "uc-3408",
        title: "Data Quality & Governance Agent",
        icon: ShieldCheck,
        description: "Context-aware deduplication with fuzzy matching, merge reasoning, and business-impact-prioritized health reports."
      }
    ]}
  />
);
