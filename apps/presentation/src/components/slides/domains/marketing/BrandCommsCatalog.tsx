import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Activity, FileText, AlertTriangle, Lightbulb, ShieldCheck, Mail, Users } from "lucide-react";

export const BrandCommsCatalog = () => (
  <DomainCatalogSlide
    title="Brand & Communications"
    subtitle="Domain 35 • Brand & Comms"
    description="Protecting and amplifying brand equity through AI-powered monitoring, communications drafting, crisis response, and stakeholder engagement across all channels."
    color="#6d28d9"
    useCases={[
      {
        id: "uc-3501",
        title: "Brand Health Monitor",
        icon: Activity,
        description: "Multi-signal brand health tracking with sentiment analysis, share of voice, and competitive positioning."
      },
      {
        id: "uc-3502",
        title: "Press Release & Comms Drafter",
        icon: FileText,
        description: "AI-drafted press releases and communications with AP style compliance and media Q&A preparation."
      },
      {
        id: "uc-3503",
        title: "Crisis Communications Advisor",
        icon: AlertTriangle,
        description: "Real-time crisis detection with severity assessment, response strategy, and stakeholder communication drafting."
      },
      {
        id: "uc-3504",
        title: "Executive Thought Leadership Agent",
        icon: Lightbulb,
        description: "Voice-matched executive content generation for LinkedIn and industry publications with engagement optimization."
      },
      {
        id: "uc-3505",
        title: "Brand Guidelines Enforcer",
        icon: ShieldCheck,
        description: "Automated brand compliance scanning across assets with tone, terminology, and visual standards checking."
      },
      {
        id: "uc-3506",
        title: "Internal Communications Drafter",
        icon: Mail,
        description: "Context-aware internal comms drafting with audience-specific messaging and distribution optimization."
      },
      {
        id: "uc-3507",
        title: "Analyst & Influencer Relations Tracker",
        icon: Users,
        description: "Analyst and media contact management with briefing preparation and coverage tracking."
      }
    ]}
  />
);
