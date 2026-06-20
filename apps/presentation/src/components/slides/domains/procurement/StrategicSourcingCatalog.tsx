import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Tags, Radar, Calculator, FileSpreadsheet, BarChartHorizontal, Gavel, Handshake, PieChart, ShieldAlert, Map, Puzzle, GitBranch } from "lucide-react";

export const StrategicSourcingCatalog = () => (
  <DomainCatalogSlide
    title="Strategic Sourcing & Category Management"
    subtitle="Domain 12 • Strategic Sourcing"
    description="Transforming category management from reactive buying into intelligence-driven sourcing through AI agents that classify spend, model costs, orchestrate RFx events, and generate negotiation-ready insights."
    color="#0d9488"
    useCases={[
      {
        id: "uc-1201",
        title: "Spend Classification & Enrichment",
        icon: Tags,
        description: "ML taxonomy classification with LLM interpretation of ambiguous PO descriptions and supplier entity resolution."
      },
      {
        id: "uc-1202",
        title: "Market Intelligence Monitor",
        icon: Radar,
        description: "Continuous commodity and news monitoring with LLM reasoning on tariff and supplier impact."
      },
      {
        id: "uc-1203",
        title: "Should-Cost Modeler",
        icon: Calculator,
        description: "Parametric cost regression with LLM interpretation of engineering specs for negotiation-ready breakdowns."
      },
      {
        id: "uc-1204",
        title: "RFx Builder & Orchestrator",
        icon: FileSpreadsheet,
        description: "Gen AI drafts contextual RFPs with multi-agent lifecycle management across sourcing events."
      },
      {
        id: "uc-1205",
        title: "Bid Evaluation Analyzer",
        icon: BarChartHorizontal,
        description: "Multi-criteria weighted scoring with LLM synthesis of narrative bid responses into award memos."
      },
      {
        id: "uc-1206",
        title: "Auction Strategy Advisor",
        icon: Gavel,
        description: "Game theory modeling of bidding patterns with LLM reasoning on auction format selection."
      },
      {
        id: "uc-1207",
        title: "Negotiation Prep Agent",
        icon: Handshake,
        description: "RAG over past contracts with BATNA-aware playbook generation and trade-off matrices."
      },
      {
        id: "uc-1208",
        title: "Category Spend Dashboard",
        icon: PieChart,
        description: "Anomaly detection on spend patterns with LLM-generated plain-English commentary per dashboard section."
      },
      {
        id: "uc-1209",
        title: "Sole Source Justification",
        icon: ShieldAlert,
        description: "Gen AI drafts audit-ready justifications while challenging sole-source claims against market data."
      },
      {
        id: "uc-1210",
        title: "Category Roadmap Planner",
        icon: Map,
        description: "AI-synthesized phased roadmaps with sequencing logic and dependency-aware initiative planning."
      },
      {
        id: "uc-1211",
        title: "Spec Standardization Agent",
        icon: Puzzle,
        description: "NLP clustering of equivalent specs across BUs with LLM reasoning on functional equivalence."
      },
      {
        id: "uc-1212",
        title: "Sourcing Channel Optimizer",
        icon: GitBranch,
        description: "ML channel classification with LLM handling edge cases for catalog vs. strategic sourcing decisions."
      }
    ]}
  />
);
