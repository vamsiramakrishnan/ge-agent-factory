import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Calendar, Ear, MessageCircle, Star, BarChart3, Heart } from "lucide-react";

export const SocialMediaCatalog = () => (
  <DomainCatalogSlide
    title="Social Media & Community"
    subtitle="Domain 33 • Social Media"
    description="Elevating social media from reactive posting to strategic community engagement through AI-powered content adaptation, real-time sentiment interpretation, and systematic advocacy management."
    color="#7c3aed"
    useCases={[
      {
        id: "uc-3301",
        title: "Social Content Calendar Manager",
        icon: Calendar,
        description: "Platform-adapted weekly content generation with optimal posting time analysis and approval workflows."
      },
      {
        id: "uc-3302",
        title: "Social Listening & Sentiment Analyzer",
        icon: Ear,
        description: "Real-time sentiment monitoring with nuanced interpretation of sarcasm, cultural context, and manufactured controversy."
      },
      {
        id: "uc-3303",
        title: "Community Engagement Responder",
        icon: MessageCircle,
        description: "Intent-classified social response drafting with brand voice consistency and escalation routing."
      },
      {
        id: "uc-3304",
        title: "Influencer Discovery & Tracking",
        icon: Star,
        description: "Content quality-aware influencer discovery with fake follower detection and partnership ROI tracking."
      },
      {
        id: "uc-3305",
        title: "Social Media Analytics Dashboard",
        icon: BarChart3,
        description: "Cross-platform performance narratives explaining the strategic implications behind engagement metrics."
      },
      {
        id: "uc-3306",
        title: "UGC & Advocacy Manager",
        icon: Heart,
        description: "Automated UGC detection and quality assessment with amplification strategy and permission outreach."
      }
    ]}
  />
);
