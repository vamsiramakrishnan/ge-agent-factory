import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Star, AlertOctagon, Truck, Presentation, Wrench, HeartHandshake, Lightbulb } from "lucide-react";

export const SupplierPerformanceCatalog = () => (
  <DomainCatalogSlide
    title="Supplier Performance & Relationship Management"
    subtitle="Domain 17 • Supplier Performance"
    description="Transforming supplier management from reactive scorekeeping to proactive relationship intelligence — AI-driven scorecards, quality root-cause reasoning, and innovation tracking that elevate SRM from spreadsheets to strategic partnerships."
    color="#db2777"
    useCases={[
      {
        id: "uc-1701",
        title: "Supplier Scorecard Generator",
        icon: Star,
        description: "KPI aggregation with LLM-generated scorecard commentary that explains the story behind the numbers."
      },
      {
        id: "uc-1702",
        title: "Quality Incident Analyzer",
        icon: AlertOctagon,
        description: "Root cause classification (8D) with LLM reasoning over NCR narratives to distinguish worn tooling from spindle wear."
      },
      {
        id: "uc-1703",
        title: "Delivery Performance Monitor",
        icon: Truck,
        description: "OTIF time-series tracking with LLM interpretation of carrier delay notifications and proactive action recommendations."
      },
      {
        id: "uc-1704",
        title: "Business Review Prep Agent",
        icon: Presentation,
        description: "Synthesizes scorecard data, action items, and market context into QBR presentation narratives with talking points."
      },
      {
        id: "uc-1705",
        title: "Supplier Development Planner",
        icon: Wrench,
        description: "Gap analysis with LLM reasoning about which development program fits — SPC training, Kaizen, or resident engineer."
      },
      {
        id: "uc-1706",
        title: "Relationship Health Analyzer",
        icon: HeartHandshake,
        description: "Sentiment scoring with LLM detection of qualitative tone shifts from 'partnership' to 'contractual obligations' language."
      },
      {
        id: "uc-1707",
        title: "Innovation & Value Engineering Tracker",
        icon: Lightbulb,
        description: "Pipeline management with LLM evaluation of technical proposals like Inconel 718 vs titanium substitution feasibility."
      }
    ]}
  />
);
