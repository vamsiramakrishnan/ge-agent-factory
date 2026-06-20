import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Database, MessageSquare, ClipboardCheck, Rocket, Activity, CheckCircle, LogOut, UserMinus } from "lucide-react";

export const HROperationsCatalog = () => (
  <DomainCatalogSlide
    title="HR Operations & Shared Services"
    subtitle="Domain 08 • Efficiency & Scale"
    description="Driving operational excellence through automated data orchestration and intelligent query resolution."
    color="#6366f1"
    useCases={[
      {
        id: "uc-801",
        title: "Data Quality Monitor",
        icon: Database,
        description: "Continuous HRIS data quality monitoring with anomaly detection."
      },
      {
        id: "uc-802",
        title: "Data Orchestrator",
        icon: Database,
        description: "Automated lifecycle transactions with real-time API validation."
      },
      {
        id: "uc-803",
        title: "Query Resolution",
        icon: MessageSquare,
        description: "Instant conversational support with real-time HRIS data retrieval."
      },
      {
        id: "uc-804",
        title: "Service Analytics",
        icon: Activity,
        description: "Real-time service delivery analytics with predictive bottleneck identification."
      },
      {
        id: "uc-805",
        title: "Payroll Validation",
        icon: ClipboardCheck,
        description: "Automated pre-run cross-referencing to eliminate payroll errors."
      },
      {
        id: "uc-806",
        title: "Payroll Reconciliation",
        icon: CheckCircle,
        description: "Automated reconciliation with multi-jurisdiction compliance validation."
      },
      {
        id: "uc-807",
        title: "Offboarding",
        icon: Rocket,
        description: "Autonomous deprovisioning and asset recovery orchestration."
      },
      {
        id: "uc-808",
        title: "Exit Insights",
        icon: LogOut,
        description: "NLP analysis of exit interviews with actionable theme extraction."
      },
      {
        id: "uc-809",
        title: "Attrition Analytics",
        icon: UserMinus,
        description: "Predictive turnover risk scoring with targeted intervention recommendations."
      }
    ]}
  />
);
