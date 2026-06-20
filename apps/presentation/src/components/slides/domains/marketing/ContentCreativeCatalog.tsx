import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { FileText, BookOpen, Palette, BarChart3, Mail, Repeat, ShieldCheck, Archive } from "lucide-react";
import { DOMAIN_COLORS } from "../../../../design-tokens";

export const ContentCreativeCatalog = () => (
  <DomainCatalogSlide
    title="Content & Creative Operations"
    subtitle="Domain 30 \u2022 Content & Creative"
    description="Transforming content production from bottlenecked artisan workflows to scalable creative operations with AI-assisted drafting, performance optimization, and brand governance."
    color={DOMAIN_COLORS[30]}
    useCases={[
      {
        id: "uc-3001",
        title: "Content Brief Generator",
        icon: FileText,
        description: "SEO-driven content briefs with competitive gap analysis, search intent alignment, and differentiation strategy."
      },
      {
        id: "uc-3002",
        title: "Long-Form Content Drafter",
        icon: BookOpen,
        description: "Domain-expert-quality draft generation with brand voice adaptation, readability scoring, and internal linking."
      },
      {
        id: "uc-3003",
        title: "Creative Asset Generator",
        icon: Palette,
        description: "Campaign-aligned ad copy, social graphics text, and display ad variations with brand guideline compliance."
      },
      {
        id: "uc-3004",
        title: "Content Performance Analyzer",
        icon: BarChart3,
        description: "Content decay detection with conversion attribution, topic cluster analysis, and optimization recommendations."
      },
      {
        id: "uc-3005",
        title: "Email Copy Optimizer",
        icon: Mail,
        description: "Subject line variation generation with psychological trigger testing, segment adaptation, and open rate prediction."
      },
      {
        id: "uc-3006",
        title: "Content Repurposing Agent",
        icon: Repeat,
        description: "Intelligent cross-platform content adaptation from long-form to social posts, email snippets, and video scripts."
      },
      {
        id: "uc-3007",
        title: "Brand Voice Checker",
        icon: ShieldCheck,
        description: "Tonal consistency assessment with context-aware style checking and suggested rewrites for brand alignment."
      },
      {
        id: "uc-3008",
        title: "DAM & Content Lifecycle Manager",
        icon: Archive,
        description: "Asset expiration monitoring with usage rights tracking, duplicate detection, and deprecation recommendations."
      }
    ]}
  />
);
