import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Workflow, Target, Building2, DollarSign, Video, RefreshCw, Layout, BarChart3 } from "lucide-react";
import { DOMAIN_COLORS } from "../../../../design-tokens";

export const DemandGenerationCatalog = () => (
  <DomainCatalogSlide
    title="Demand Generation & Campaigns"
    subtitle="Domain 31 \u2022 Demand Generation"
    description="Transforming demand generation from batch-and-blast campaigns to intelligent, multi-touch journeys with AI-powered personalization, scoring, and continuous optimization."
    color={DOMAIN_COLORS[31]}
    useCases={[
      {
        id: "uc-3101",
        title: "Campaign Builder & Orchestrator",
        icon: Workflow,
        description: "Multi-channel campaign setup with AI-drafted email sequences, lead scoring configuration, and journey orchestration."
      },
      {
        id: "uc-3102",
        title: "Lead Scoring & Qualification Agent",
        icon: Target,
        description: "Predictive lead scoring with intent signal aggregation, behavioral velocity tracking, and contextual qualification narratives."
      },
      {
        id: "uc-3103",
        title: "ABM Campaign Manager",
        icon: Building2,
        description: "Account-based research and personalized outreach with buying stage prediction and stakeholder engagement mapping."
      },
      {
        id: "uc-3104",
        title: "Paid Media Optimizer",
        icon: DollarSign,
        description: "Cross-platform bid optimization with creative fatigue detection, ROAS prediction, and budget reallocation recommendations."
      },
      {
        id: "uc-3105",
        title: "Webinar & Event Engine",
        icon: Video,
        description: "End-to-end webinar orchestration with promotional copy generation, attendance prediction, and personalized follow-up."
      },
      {
        id: "uc-3106",
        title: "Lead Nurture Optimizer",
        icon: RefreshCw,
        description: "Engagement decay modeling with adaptive nurture content and sequence optimization based on behavioral signals."
      },
      {
        id: "uc-3107",
        title: "Landing Page Optimizer",
        icon: Layout,
        description: "Conversion rate optimization with copy analysis, A/B test management, and form field impact modeling."
      },
      {
        id: "uc-3108",
        title: "Campaign ROI Analyzer",
        icon: BarChart3,
        description: "Multi-touch attribution with CAC calculation, pipeline velocity analysis, and executive-ready performance narratives."
      }
    ]}
  />
);
