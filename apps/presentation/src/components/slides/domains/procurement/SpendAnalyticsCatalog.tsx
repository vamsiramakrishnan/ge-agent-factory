import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Database, TrendingDown, LineChart, BarChart3, Calculator, Presentation, Scale, TrendingUp, Award, FlaskConical } from "lucide-react";

export const SpendAnalyticsCatalog = () => (
  <DomainCatalogSlide
    title="Spend Analytics & Procurement Intelligence"
    subtitle="Domain 19 • Spend Analytics"
    description="Transforming procurement data into strategic intelligence through AI-driven spend classification, commodity forecasting, savings tracking, and scenario simulation."
    color="#0891b2"
    useCases={[
      {
        id: "uc-1901",
        title: "Spend Cube Builder & Enrichment",
        icon: Database,
        description: "ML taxonomy + LLM enrichment for ambiguous PO descriptions with supplier entity resolution."
      },
      {
        id: "uc-1902",
        title: "Savings Realization Tracker",
        icon: TrendingDown,
        description: "Savings classification with LLM-driven leakage root cause analysis across capacity vs. compliance gaps."
      },
      {
        id: "uc-1903",
        title: "Commodity Price Forecaster",
        icon: LineChart,
        description: "Time-series forecasting on 40+ indices with LLM interpretation of market-moving events."
      },
      {
        id: "uc-1904",
        title: "Procurement KPI Dashboard",
        icon: BarChart3,
        description: "Automated KPI calculation with AI-generated narrative digests explaining root causes of changes."
      },
      {
        id: "uc-1905",
        title: "Total Cost of Ownership Modeler",
        icon: Calculator,
        description: "Multi-factor TCO modeling that quantifies hidden costs invisible in structured systems."
      },
      {
        id: "uc-1906",
        title: "Procurement Value Reporter",
        icon: Presentation,
        description: "LLM-driven board-ready narrative linking savings to EBITDA impact, tailored by audience."
      },
      {
        id: "uc-1907",
        title: "Price Variance Analyzer",
        icon: Scale,
        description: "SPC on price trends with LLM correlation to ECNs, spec changes, and contractual index formulas."
      },
      {
        id: "uc-1908",
        title: "Demand Pattern Analyzer",
        icon: TrendingUp,
        description: "Time-series decomposition with LLM contextualization of anomalies against business events."
      },
      {
        id: "uc-1909",
        title: "Benchmark Intelligence Agent",
        icon: Award,
        description: "RAG over Hackett/CAPS/Gartner benchmarks with industry-contextualized peer comparisons."
      },
      {
        id: "uc-1910",
        title: "What-If Scenario Simulator",
        icon: FlaskConical,
        description: "Monte Carlo simulation driven by natural-language what-if questions with strategic recommendations."
      }
    ]}
  />
);
