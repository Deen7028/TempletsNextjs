import React from "react";

export interface INavMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: string[]; // Allowed roles e.g. ["Admin", "Manager"]. If omitted, all authenticated users can see it.
  badgeCount?: number;
  children?: INavMenuItem[]; // Dropdown submenu items
}

export interface IAppNavigationConfig {
  brandTitle: string;
  brandSubtitle?: string;
  brandHref?: string;
  logoIcon?: React.ReactNode;
  menuItems: INavMenuItem[];
}

export const APP_NAVIGATION: IAppNavigationConfig = {
  brandTitle: "Starter Template",
  brandSubtitle: "Clean Architecture Boilerplate",
  brandHref: "/showcase",
  menuItems: [
    {
      id: "showcase",
      label: "🎨 Template Showcase",
      href: "/showcase",
    },
  ],
};
