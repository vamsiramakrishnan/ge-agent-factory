import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { MessageSquare, Trophy, ClipboardList, GitMerge, Award, Pen, Radio } from "lucide-react";

export const EmployeeEngagementCatalog = () => (
  <DomainCatalogSlide
    title="Employee Engagement & Culture"
    subtitle="Domain 07 • Connection & Belonging"
    description="Fostering a high-performance culture through real-time engagement insights and proactive recognition."
    color="#ec4899"
    useCases={[
      {
        id: "uc-701",
        title: "Survey Design",
        icon: ClipboardList,
        description: "Context-aware survey design with response rate optimization."
      },
      {
        id: "uc-702",
        title: "Insight Synthesizer",
        icon: MessageSquare,
        description: "Instant driver analysis and automated team action planning guides."
      },
      {
        id: "uc-703",
        title: "Outcome Correlation",
        icon: GitMerge,
        description: "Statistical correlation of engagement to attrition, productivity, and revenue."
      },
      {
        id: "uc-704",
        title: "Recognition Analytics",
        icon: Award,
        description: "Recognition pattern analytics with equity gap detection and ROI reporting."
      },
      {
        id: "uc-705",
        title: "Recognition Nudge",
        icon: Trophy,
        description: "Proactive manager nudges and automated milestone celebrations."
      },
      {
        id: "uc-706",
        title: "Comms Drafter",
        icon: Pen,
        description: "Brand-voice-consistent communication with audience-segmented personalization."
      },
      {
        id: "uc-707",
        title: "Comms Sentiment",
        icon: Radio,
        description: "Multi-channel reach analytics with NLP sentiment analysis."
      }
    ]}
  />
);
