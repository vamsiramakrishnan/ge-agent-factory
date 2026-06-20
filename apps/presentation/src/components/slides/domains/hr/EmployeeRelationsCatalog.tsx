import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Gavel, HelpCircle, BarChart2, FileWarning, Scale, Edit3, Calendar, Clock } from "lucide-react";

export const EmployeeRelationsCatalog = () => (
  <DomainCatalogSlide
    title="Employee Relations & Compliance"
    subtitle="Domain 06 • Trust & Integrity"
    description="Ensuring consistency and compliance through intelligent case management and instant policy accessibility."
    color="#4b5563"
    useCases={[
      {
        id: "uc-601",
        title: "ER Case Intelligence",
        icon: Gavel,
        description: "Pattern detection and precedent-based investigation summaries."
      },
      {
        id: "uc-602",
        title: "Case Analytics",
        icon: BarChart2,
        description: "Real-time ER case pattern analysis with predictive risk scoring."
      },
      {
        id: "uc-603",
        title: "PIP Documentation",
        icon: FileWarning,
        description: "Legally-reviewed PIP templates with SMART milestones and tracking."
      },
      {
        id: "uc-604",
        title: "Discipline Advisor",
        icon: Scale,
        description: "Precedent-aware discipline recommendations ensuring consistency."
      },
      {
        id: "uc-605",
        title: "Policy Assistant",
        icon: HelpCircle,
        description: "24/7 cited answers to natural-language policy questions."
      },
      {
        id: "uc-606",
        title: "Policy Drafting",
        icon: Edit3,
        description: "Regulation-aware policy drafting with automated compliance gap analysis."
      },
      {
        id: "uc-607",
        title: "Leave Intake",
        icon: Calendar,
        description: "Conversational leave/accommodation intake with eligibility pre-screening."
      },
      {
        id: "uc-608",
        title: "Leave Analytics",
        icon: Clock,
        description: "Unified leave utilization analytics with burnout risk detection."
      }
    ]}
  />
);
