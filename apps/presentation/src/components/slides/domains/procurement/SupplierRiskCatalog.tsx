import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { ShieldAlert, Radio, ShieldCheck, Scale, Network, ClipboardCheck, PieChart, FileCheck } from "lucide-react";

export const SupplierRiskCatalog = () => (
  <DomainCatalogSlide
    title="Supplier Risk & Compliance"
    subtitle="Domain 16 • Supplier Risk"
    description="Transforming supplier risk from reactive firefighting to predictive intelligence — continuous monitoring across financial, operational, regulatory, and sub-tier dimensions with LLM-powered signal synthesis."
    color="#57534e"
    useCases={[
      {
        id: "uc-1601",
        title: "Supplier Risk Scoring Engine",
        icon: ShieldAlert,
        description: "Multi-factor ML risk model with LLM synthesis of individually minor signals into distress pattern narratives."
      },
      {
        id: "uc-1602",
        title: "Supply Chain Disruption Monitor",
        icon: Radio,
        description: "NLP on global news and maritime data connecting port strikes to your specific tier-2 supplier dependencies."
      },
      {
        id: "uc-1603",
        title: "Sanctions & Watchlist Screener",
        icon: ShieldCheck,
        description: "Fuzzy name matching with LLM resolution of ambiguous matches across 47 'Mohammad Al-Hassan' entries."
      },
      {
        id: "uc-1604",
        title: "Regulatory Compliance Tracker",
        icon: Scale,
        description: "RAG over regulations with LLM interpretation of EU CBAM, UFLPA texts for supply base implications."
      },
      {
        id: "uc-1605",
        title: "Sub-Tier Visibility Agent",
        icon: Network,
        description: "Graph analytics with LLM reasoning over CMRT responses to map supply chain topology from partial data."
      },
      {
        id: "uc-1606",
        title: "Audit & Corrective Action Tracker",
        icon: ClipboardCheck,
        description: "Auto-generated CAPA plans from audit findings with LLM assessment of supplier response adequacy."
      },
      {
        id: "uc-1607",
        title: "Concentration Risk Analyzer",
        icon: PieChart,
        description: "HHI calculation with LLM-generated business risk narratives and revenue impact modeling."
      },
      {
        id: "uc-1608",
        title: "Insurance & Liability Monitor",
        icon: FileCheck,
        description: "OCR/NLP reading COIs in non-standard formats and validating coverage against contractual requirements."
      }
    ]}
  />
);
