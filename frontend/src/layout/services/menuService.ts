import { apiClient } from "@/shared/services/apiClient";
import { IMenuItem } from "@/stores/useMenuStore";

export const menuService = {
  async getMenu(): Promise<IMenuItem[]> {
    try {
      const res = await apiClient.get<{ data: IMenuItem[] }>("/api/menus");
      return res?.data ?? [];
    } catch {
      return [];
    }
  },
};
