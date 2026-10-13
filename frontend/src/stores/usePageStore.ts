import { create } from "zustand";

export interface IBreadcrumb {
  label: string;
  href?: string;
}

export interface PageState {
  title: string;
  breadcrumbs: IBreadcrumb[];
  permissions: string[];
  setTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: IBreadcrumb[]) => void;
  setPermissions: (permissions: string[]) => void;
}

export const usePageStore = create<PageState>((set) => ({
  title: "",
  breadcrumbs: [],
  permissions: [],
  setTitle: (title) => set({ title }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setPermissions: (permissions) => set({ permissions }),
}));
