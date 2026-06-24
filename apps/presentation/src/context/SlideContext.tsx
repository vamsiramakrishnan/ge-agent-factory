import React, { createContext, useContext } from "react";

export interface BreadcrumbItem {
  id: string;
  title: string;
}

export interface SlideContextType {
  currentSlide: number;
  goToSlide: (id: string) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  zoomOut: () => void;
  goBack: () => void;
  history: string[];
  currentLevel: 0 | 1 | 2 | 3 | 4;
  breadcrumbs: BreadcrumbItem[];
  levelPosition: { current: number; total: number };
}

export const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const useSlideNavigation = () => {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlideNavigation must be used within a SlideProvider");
  }
  return context;
};
