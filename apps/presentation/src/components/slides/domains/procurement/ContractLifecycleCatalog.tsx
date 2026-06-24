import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { FileText, Shield, ListChecks, Clock, GitCompare, ClipboardCheck, Network, BarChart3, AlertTriangle } from "lucide-react";

export const ContractLifecycleCatalog = () => (
  <DomainCatalogSlide
    title="Contract Lifecycle Management"
    subtitle="Domain 14 • Contract Lifecycle"
    description="Transforming contract management from document storage to intelligent lifecycle orchestration — AI-driven drafting, risk analysis, obligation mining, and compliance monitoring across the full agreement lifecycle."
    color="#dc2626"
    useCases={[
      {
        id: "uc-1401",
        title: "Contract Authoring Agent",
        icon: FileText,
        description: "Gen AI drafts from clause libraries with LLM adaptation to jurisdiction-specific requirements and deal structures."
      },
      {
        id: "uc-1402",
        title: "Clause Risk Analyzer",
        icon: Shield,
        description: "NLP clause extraction with LLM cross-reference risk analysis — liability and indemnification interaction detection."
      },
      {
        id: "uc-1403",
        title: "Obligation Mining & Tracking",
        icon: ListChecks,
        description: "NLP extracts obligations from prose — buried sentences, conditional obligations, and recurring commitments."
      },
      {
        id: "uc-1404",
        title: "Renewal & Expiry Monitor",
        icon: Clock,
        description: "Time-based alerts with LLM-generated renewal briefs including renegotiation recommendations and auto-renewal trap detection."
      },
      {
        id: "uc-1405",
        title: "Redline Comparison Agent",
        icon: GitCompare,
        description: "Semantic diff that understands meaning-level changes — not just word-level — with business impact prioritization."
      },
      {
        id: "uc-1406",
        title: "Contract Compliance Auditor",
        icon: ClipboardCheck,
        description: "Cross-references contract terms vs. actuals — pricing compliance, volume commitments, and rebate threshold monitoring."
      },
      {
        id: "uc-1407",
        title: "Agreement Hierarchy Tracker",
        icon: Network,
        description: "Knowledge graph (MSA→SOW→amendments→POs) with LLM resolution of inheritance ambiguity across agreement layers."
      },
      {
        id: "uc-1408",
        title: "Contract Analytics Dashboard",
        icon: BarChart3,
        description: "Trend analysis on cycle times and deviation rates with LLM narrative commentary explaining why metrics changed."
      },
      {
        id: "uc-1409",
        title: "Force Majeure Advisor",
        icon: AlertTriangle,
        description: "RAG over contract clauses with LLM reasoning on whether specific events qualify under force majeure provisions."
      }
    ]}
  />
);
