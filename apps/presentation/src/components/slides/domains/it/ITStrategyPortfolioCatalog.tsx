import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { LayoutGrid, Radar, DollarSign, TrendingUp, Scissors, Target, MessageCircle } from "lucide-react";

export const ITStrategyPortfolioCatalog = () => (
  <DomainCatalogSlide
    title="IT Strategy & Portfolio Management"
    subtitle="Domain 38 • IT Strategy"
    description="Elevating IT from cost center to strategic partner through AI-driven portfolio optimization, technology intelligence, and data-validated investment decisions."
    color="#1d4ed8"
    useCases={[
      {
        id: "uc-3801",
        title: "Portfolio Prioritization Engine",
        icon: LayoutGrid,
        description: "Multi-criteria scoring of IT projects with Monte Carlo simulation on delivery timelines and resource optimization."
      },
      {
        id: "uc-3802",
        title: "Technology Radar & Trend Scout",
        icon: Radar,
        description: "Continuous scan of technology adoption trends, open-source health, and internal engineering signals for radar updates."
      },
      {
        id: "uc-3803",
        title: "IT Budget Forecast Agent",
        icon: DollarSign,
        description: "Consolidated IT budget forecasting with cloud spend decomposition and CapEx/OpEx variance analysis."
      },
      {
        id: "uc-3804",
        title: "Digital Transformation Tracker",
        icon: TrendingUp,
        description: "Multi-pillar transformation status with milestone slip prediction and benefit realization tracking."
      },
      {
        id: "uc-3805",
        title: "Vendor Rationalization Agent",
        icon: Scissors,
        description: "SaaS portfolio analysis with usage telemetry, overlap detection, and consolidation recommendations."
      },
      {
        id: "uc-3806",
        title: "IT OKR & KPI Dashboard",
        icon: Target,
        description: "Unified IT performance narrative aggregating KPIs from DevOps, ITSM, security, and cloud platforms."
      },
      {
        id: "uc-3807",
        title: "Strategic Initiative Q&A",
        icon: MessageCircle,
        description: "Conversational Q&A over strategic initiatives with real-time status from Confluence and Jira."
      }
    ]}
  />
);
