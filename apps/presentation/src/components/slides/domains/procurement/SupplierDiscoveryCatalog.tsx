import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Search, ClipboardCheck, TrendingDown, Users, UserPlus, Award, GitMerge, ShieldAlert } from "lucide-react";

export const SupplierDiscoveryCatalog = () => (
  <DomainCatalogSlide
    title="Supplier Discovery & Qualification"
    subtitle="Domain 13 • Supplier Discovery"
    description="Transforming supplier identification from Rolodex-driven networking to AI-powered discovery, screening, and qualification — reducing time-to-shortlist from weeks to hours while surfacing risks invisible to manual review."
    color="#7c3aed"
    useCases={[
      {
        id: "uc-1301",
        title: "Supplier Discovery & Matching",
        icon: Search,
        description: "Embedding-based semantic search across multiple supplier databases with LLM taxonomy translation."
      },
      {
        id: "uc-1302",
        title: "Supplier Pre-Qualification Screener",
        icon: ClipboardCheck,
        description: "NLP extraction from questionnaires with LLM evaluation of narrative responses and inconsistency detection."
      },
      {
        id: "uc-1303",
        title: "Financial Health Assessor",
        icon: TrendingDown,
        description: "Altman Z-score augmented with ML plus LLM analysis of 10-K filings for distress signals."
      },
      {
        id: "uc-1304",
        title: "Supplier Diversity Tracker",
        icon: Users,
        description: "Automated spend attribution by diversity classification with narrative report generation for board compliance."
      },
      {
        id: "uc-1305",
        title: "Supplier Onboarding Orchestrator",
        icon: UserPlus,
        description: "End-to-end onboarding workflow from document collection through vendor master creation with entity validation."
      },
      {
        id: "uc-1306",
        title: "Capability Assessment Agent",
        icon: Award,
        description: "Weighted scoring of RFI responses with LLM evaluation of narrative capability claims against performance data."
      },
      {
        id: "uc-1307",
        title: "Supplier Consolidation Analyzer",
        icon: GitMerge,
        description: "Graph analytics on supplier overlap with LLM reasoning about contractual and operational consolidation constraints."
      },
      {
        id: "uc-1308",
        title: "Background & Sanctions Screener",
        icon: ShieldAlert,
        description: "Fuzzy name matching against sanctions lists with LLM adjudication of adverse media and entity relationships."
      }
    ]}
  />
);
