import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { GraduationCap, Compass, FileText, BookOpen, Shield, AlertCircle, Crown, BarChart } from "lucide-react";

export const LearningDevelopmentCatalog = () => (
  <DomainCatalogSlide
    title="Learning & Development"
    subtitle="Domain 05 • Capability & Growth"
    description="Closing the skills gap through dynamic capability mapping and hyper-personalized learning journeys."
    color="#f59e0b"
    useCases={[
      {
        id: "uc-501",
        title: "Skills Gap Analyzer",
        icon: GraduationCap,
        description: "Dynamic skills mapping and organizational capability heat maps."
      },
      {
        id: "uc-502",
        title: "L&D Plan Drafter",
        icon: FileText,
        description: "Auto-generated L&D strategy narratives from skills data and priorities."
      },
      {
        id: "uc-503",
        title: "Content Summarizer",
        icon: BookOpen,
        description: "Auto-summarizes learning content into microlearning with quiz generation."
      },
      {
        id: "uc-504",
        title: "Learning Paths",
        icon: Compass,
        description: "Personalized recommendations aligned to role, skills, and goals."
      },
      {
        id: "uc-505",
        title: "Compliance Content",
        icon: Shield,
        description: "Regulatory-change-triggered compliance training content updates."
      },
      {
        id: "uc-506",
        title: "Compliance Tracking",
        icon: AlertCircle,
        description: "Real-time completion dashboards with intelligent escalation chains."
      },
      {
        id: "uc-507",
        title: "Leadership Programs",
        icon: Crown,
        description: "Data-driven program design based on leadership competency gaps."
      },
      {
        id: "uc-508",
        title: "Program Impact",
        icon: BarChart,
        description: "Multi-level impact evaluation (Kirkpatrick L1-L4) with ROI dashboards."
      }
    ]}
  />
);
