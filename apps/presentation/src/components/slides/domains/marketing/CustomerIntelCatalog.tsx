import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { BookOpen, Scale, MessageSquare, Target, Swords, Briefcase, TrendingUp } from "lucide-react";

export const CustomerIntelCatalog = () => (
  <DomainCatalogSlide
    title="Customer & Market Intelligence"
    subtitle="Domain 37 • Customer & Market Intel"
    description="Transforming market research, competitive intelligence, and customer feedback into actionable insights that drive positioning, enablement, and strategic decision-making."
    color="#0e7490"
    useCases={[
      {
        id: "uc-3701",
        title: "Market Research Synthesizer",
        icon: BookOpen,
        description: "Multi-source analyst report and market data synthesis into concise intelligence briefs with strategic implications."
      },
      {
        id: "uc-3702",
        title: "Win/Loss Analysis Agent",
        icon: Scale,
        description: "Gong transcript analysis combined with CRM data to surface real competitive loss reasons beyond dropdown selections."
      },
      {
        id: "uc-3703",
        title: "Customer Voice & Review Monitor",
        icon: MessageSquare,
        description: "Cross-platform review monitoring with product intelligence extraction and response recommendation."
      },
      {
        id: "uc-3704",
        title: "Persona & ICP Refiner",
        icon: Target,
        description: "Data-driven ICP and persona refinement using closed-won patterns, firmographics, and behavioral signals."
      },
      {
        id: "uc-3705",
        title: "Competitive Battle Card Generator",
        icon: Swords,
        description: "Contextual battle cards from CRM, Gong transcripts, and competitive intel with win/loss pattern analysis."
      },
      {
        id: "uc-3706",
        title: "Sales Enablement Content Agent",
        icon: Briefcase,
        description: "Deal-stage-aware content recommendations from Highspot with personalized context and usage tracking."
      },
      {
        id: "uc-3707",
        title: "Market Trend & Signal Detector",
        icon: TrendingUp,
        description: "Search trend, news, and adoption signal monitoring to distinguish market shifts from noise."
      }
    ]}
  />
);
