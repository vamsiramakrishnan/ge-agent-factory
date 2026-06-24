import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { BarChart3, UserSearch, Users, MessageCircle } from "lucide-react";

export const DEIBelongingCatalog = () => (
  <DomainCatalogSlide
    title="DEI & Belonging"
    subtitle="Domain 09 • Equity & Inclusion"
    description="Embedding equity into the organizational fabric through real-time representation monitoring and inclusive hiring audits."
    color="#06b6d4"
    useCases={[
      {
        id: "uc-901",
        title: "DEI Dashboard",
        icon: BarChart3,
        description: "Real-time representation monitoring with automated data suppression."
      },
      {
        id: "uc-902",
        title: "Inclusive Hiring",
        icon: UserSearch,
        description: "Funnel analysis by demographic to identify diversity drop-off points."
      },
      {
        id: "uc-903",
        title: "DEI Programming",
        icon: MessageCircle,
        description: "Data-informed DEI communications and evidence-based program design."
      },
      {
        id: "uc-904",
        title: "ERG Impact",
        icon: Users,
        description: "Quantified impact reports linking ERG activity to retention."
      }
    ]}
  />
);
