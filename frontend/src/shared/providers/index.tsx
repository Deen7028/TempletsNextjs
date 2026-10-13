"use client";

import React from "react";
import { ThemeRegistry } from "@/layout";

export interface IAppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
  return <ThemeRegistry>{children}</ThemeRegistry>;
};
