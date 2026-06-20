import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { FileSpreadsheet, Presentation, LayoutDashboard, MessageSquare, BarChart, Combine, Leaf, Megaphone } from "lucide-react";

export const FinanceAnalyticsCatalog = () => (
  <DomainCatalogSlide
    title="Finance Analytics & Reporting"
    subtitle="Domain 28 • Finance Analytics"
    description="Transforming finance reporting from manual data assembly to intelligent, audience-tailored analytics with automated narrative generation, real-time dashboards, and AI-powered insights."
    color="#1e293b"
    useCases={[
      {
        id: "uc-2801",
        title: "Financial Statement Generator",
        icon: FileSpreadsheet,
        description: "Automated trial-balance-to-statement mapping with MD&A narrative generation and filing-ready output."
      },
      {
        id: "uc-2802",
        title: "Management Reporting Agent",
        icon: Presentation,
        description: "Audience-tailored management reports — CEO strategic summary, COO operational detail, CFO financial package."
      },
      {
        id: "uc-2803",
        title: "KPI Dashboard Builder",
        icon: LayoutDashboard,
        description: "Real-time financial KPI dashboards with automated anomaly detection and AI-generated narrative commentary."
      },
      {
        id: "uc-2804",
        title: "Ad-Hoc Query Agent",
        icon: MessageSquare,
        description: "Natural language to SQL finance query agent with contextual answers and recommended next steps."
      },
      {
        id: "uc-2805",
        title: "Peer Benchmarking Agent",
        icon: BarChart,
        description: "Automated peer comparison across 30+ financial ratios with percentile ranking and contextualized gap analysis."
      },
      {
        id: "uc-2806",
        title: "Consolidation & Elimination Agent",
        icon: Combine,
        description: "Multi-entity consolidation with automated IC elimination, currency translation, and conforming adjustments."
      },
      {
        id: "uc-2807",
        title: "ESG & Sustainability Reporter",
        icon: Leaf,
        description: "Multi-framework ESG reporting (GRI, SASB, TCFD) with automated emissions calculation and disclosure drafting."
      },
      {
        id: "uc-2808",
        title: "Investor Relations Prep Agent",
        icon: Megaphone,
        description: "Earnings preparation with consensus analysis, analyst question anticipation, and talking point generation."
      }
    ]}
  />
);
