import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Calculator, TrendingUp, BarChart3, Shuffle, Building2, Users, DollarSign, Presentation, MessageCircle } from "lucide-react";

export const FPACatalog = () => (
  <DomainCatalogSlide
    title="Financial Planning & Analysis"
    subtitle="Domain 20 • FP&A"
    description="Transforming FP&A from spreadsheet-driven reporting to AI-powered strategic business partnering — budget consolidation, rolling forecasts, variance root-cause analysis, and scenario modeling at machine speed."
    color="#0f766e"
    useCases={[
      {
        id: "uc-2001",
        title: "Budget Builder & Consolidation",
        icon: Calculator,
        description: "Automated budget template distribution, BU submission consolidation, and narrative synthesis into CFO-ready packages."
      },
      {
        id: "uc-2002",
        title: "Rolling Forecast Engine",
        icon: TrendingUp,
        description: "Monthly forecast refresh with time-series models and qualitative signal interpretation from earnings calls and pipeline updates."
      },
      {
        id: "uc-2003",
        title: "Variance Analysis Agent",
        icon: BarChart3,
        description: "Automated budget-vs-actual variance calculation with statistical significance testing and root-cause narratives."
      },
      {
        id: "uc-2004",
        title: "Scenario Modeling & Sensitivity",
        icon: Shuffle,
        description: "Monte Carlo simulation and sensitivity analysis translating natural-language what-if questions into modeled outcomes."
      },
      {
        id: "uc-2005",
        title: "Capital Expenditure Analyzer",
        icon: Building2,
        description: "NPV/IRR/payback analysis on CapEx requests with historical project comparison and strategic alignment assessment."
      },
      {
        id: "uc-2006",
        title: "Headcount Planning Agent",
        icon: Users,
        description: "Fully-loaded cost modeling syncing HRIS data with financial plans, attrition forecasting, and hiring ramp analysis."
      },
      {
        id: "uc-2007",
        title: "Revenue Forecasting Agent",
        icon: DollarSign,
        description: "Pipeline-weighted revenue forecasting with win-rate regression and deal-note quality assessment."
      },
      {
        id: "uc-2008",
        title: "Board Deck Generator",
        icon: Presentation,
        description: "Automated board-ready financial presentation assembly with audience-tailored management discussion narratives."
      },
      {
        id: "uc-2009",
        title: "FP&A Query Assistant",
        icon: MessageCircle,
        description: "Conversational finance Q&A with NL-to-SQL translation and contextual answers over budget, forecast, and actuals data."
      }
    ]}
  />
);
