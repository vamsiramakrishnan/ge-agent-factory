import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Layers, TrendingUp, GitCompare, BookOpen, PiggyBank, Award, SmilePlus } from "lucide-react";

export const ProcurementStrategyCatalog = () => (
  <DomainCatalogSlide
    title="Procurement Strategy & Demand Planning"
    subtitle="Domain 11 • Procurement Strategy"
    description="Elevating procurement from tactical buying to strategic value creation through AI-driven category intelligence, demand sensing, and decision support."
    color="#ea580c"
    useCases={[
      {
        id: "uc-1101",
        title: "Category Strategy Generator",
        icon: Layers,
        description: "RAG-powered category strategy drafting with spend analysis, market context, and savings targets."
      },
      {
        id: "uc-1102",
        title: "Demand Forecasting & Aggregation",
        icon: TrendingUp,
        description: "Time-series demand forecasting with NLP parsing of stakeholder signals."
      },
      {
        id: "uc-1103",
        title: "Make-vs-Buy Analyzer",
        icon: GitCompare,
        description: "Multi-criteria TCO analysis with Monte Carlo simulation for insource/outsource decisions."
      },
      {
        id: "uc-1104",
        title: "Procurement Policy Assistant",
        icon: BookOpen,
        description: "Conversational Q&A over procurement policies with approval matrix and delegation rules."
      },
      {
        id: "uc-1105",
        title: "Savings Pipeline Tracker",
        icon: PiggyBank,
        description: "ML classification of savings types with realization probability scoring and leakage detection."
      },
      {
        id: "uc-1106",
        title: "Procurement Maturity Assessor",
        icon: Award,
        description: "NLP analysis of self-assessments scored against Hackett/CAPS maturity frameworks."
      },
      {
        id: "uc-1107",
        title: "Stakeholder Satisfaction Analyzer",
        icon: SmilePlus,
        description: "Sentiment analysis on internal customer feedback with root cause identification."
      }
    ]}
  />
);
