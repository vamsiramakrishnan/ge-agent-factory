import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Search, Target, DollarSign, PenTool, Users, Shield, ArrowUpRight } from "lucide-react";

export const DigitalMarketingCatalog = () => (
  <DomainCatalogSlide
    title="Digital Marketing & SEO/SEM"
    subtitle="Domain 32 • Digital Marketing"
    description="Transforming digital marketing from manual optimization cycles to AI-driven performance through continuous SEO monitoring, intelligent bid management, and conversion optimization at scale."
    color="#0891b2"
    useCases={[
      {
        id: "uc-3201",
        title: "SEO Audit & Recommendation Engine",
        icon: Search,
        description: "Automated technical audits with LLM-powered intent analysis and prioritized fix backlogs."
      },
      {
        id: "uc-3202",
        title: "Keyword Strategy Agent",
        icon: Target,
        description: "Continuous keyword universe management with search intent classification and topic cluster mapping."
      },
      {
        id: "uc-3203",
        title: "PPC Bid Management Agent",
        icon: DollarSign,
        description: "Daily automated bid optimization with competitive dynamics interpretation and budget pacing."
      },
      {
        id: "uc-3204",
        title: "Ad Copy Generator & Tester",
        icon: PenTool,
        description: "Platform-specific ad copy generation with automatic A/B test setup and winner scaling."
      },
      {
        id: "uc-3205",
        title: "Website Personalization Engine",
        icon: Users,
        description: "Real-time multi-signal personalization combining firmographic, behavioral, and intent data."
      },
      {
        id: "uc-3206",
        title: "Technical SEO Monitor",
        icon: Shield,
        description: "Daily crawl monitoring with complex root cause diagnosis for indexation and performance issues."
      },
      {
        id: "uc-3207",
        title: "Conversion Rate Optimization Agent",
        icon: ArrowUpRight,
        description: "Behavioral funnel analysis with automated hypothesis generation and test backlog management."
      }
    ]}
  />
);
