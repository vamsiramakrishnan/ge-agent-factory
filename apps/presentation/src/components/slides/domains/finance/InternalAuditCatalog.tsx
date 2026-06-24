import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Shield, Activity, ClipboardList, Target, FileSearch, ShieldAlert, FileText } from "lucide-react";

export const InternalAuditCatalog = () => (
  <DomainCatalogSlide
    title="Internal Audit & Controls"
    subtitle="Domain 26 • Internal Audit"
    description="Transforming internal audit from periodic, sample-based testing to continuous, intelligent assurance through AI-driven control monitoring, risk assessment, and fraud detection."
    color="#475569"
    useCases={[
      {
        id: "uc-2601",
        title: "SOX Control Testing Agent",
        icon: Shield,
        description: "Automated evidence collection and control testing with risk-based sampling and deficiency classification."
      },
      {
        id: "uc-2602",
        title: "Continuous Controls Monitor",
        icon: Activity,
        description: "Real-time transaction monitoring for SoD violations, authorization breaches, and access anomalies with contextual interpretation."
      },
      {
        id: "uc-2603",
        title: "Audit Finding Tracker",
        icon: ClipboardList,
        description: "Automated finding lifecycle management with remediation tracking, escalation, and root cause adequacy assessment."
      },
      {
        id: "uc-2604",
        title: "Risk Assessment Agent",
        icon: Target,
        description: "Multi-signal enterprise risk assessment synthesizing financial, operational, and compliance indicators into audit plan priorities."
      },
      {
        id: "uc-2605",
        title: "Policy Compliance Scanner",
        icon: FileSearch,
        description: "Full-population transaction scanning against corporate policies with contextual exception classification."
      },
      {
        id: "uc-2606",
        title: "Fraud Detection Engine",
        icon: ShieldAlert,
        description: "Continuous fraud monitoring using Benford's Law, behavioral analytics, and network analysis with investigation brief generation."
      },
      {
        id: "uc-2607",
        title: "Audit Report Generator",
        icon: FileText,
        description: "AI-drafted audit reports with executive summary, root cause analysis, and audience-tailored narratives."
      }
    ]}
  />
);
