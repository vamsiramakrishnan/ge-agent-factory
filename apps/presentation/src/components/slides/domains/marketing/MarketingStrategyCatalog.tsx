import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { FileText, DollarSign, Eye, Rocket, Users, Calendar, Target } from "lucide-react";
import { DOMAIN_COLORS } from "../../../../design-tokens";

export const MarketingStrategyCatalog = () => (
  <DomainCatalogSlide
    title="Marketing Strategy & Planning"
    subtitle="Domain 29 \u2022 Marketing Strategy"
    description="Elevating marketing from gut-driven planning to data-powered strategy through AI-synthesized market intelligence, budget optimization, and campaign orchestration."
    color={DOMAIN_COLORS[29]}
    useCases={[
      {
        id: "uc-2901",
        title: "Marketing Plan Generator",
        icon: FileText,
        description: "RAG-powered quarterly marketing plan drafting with pipeline data, campaign performance, and revenue target synthesis."
      },
      {
        id: "uc-2902",
        title: "Budget Allocator & Forecaster",
        icon: DollarSign,
        description: "Marketing mix modeling with Monte Carlo simulation for channel-level budget optimization and spend pacing."
      },
      {
        id: "uc-2903",
        title: "Competitive Intelligence Monitor",
        icon: Eye,
        description: "Multi-source competitive signal aggregation with LLM-interpreted positioning impact analysis."
      },
      {
        id: "uc-2904",
        title: "GTM Launch Planner",
        icon: Rocket,
        description: "AI-generated launch checklists and messaging frameworks tailored to launch tier and channel mix."
      },
      {
        id: "uc-2905",
        title: "Audience Segmentation Engine",
        icon: Users,
        description: "K-means clustering with intent data enrichment and qualitative signal interpretation for segment narratives."
      },
      {
        id: "uc-2906",
        title: "Campaign Calendar Orchestrator",
        icon: Calendar,
        description: "Cross-campaign scheduling with audience overlap detection and optimal send-time prediction."
      },
      {
        id: "uc-2907",
        title: "Marketing OKR Tracker",
        icon: Target,
        description: "Trajectory forecasting with multi-source KPI correlation and natural language progress narratives."
      }
    ]}
  />
);
