import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

export interface SidebarConfig {
  activeTab: 'chat' | 'mask' | 'config';
}

export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  activeTab: 'chat',
};

export const useSidebarStore = create<SidebarConfig>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SIDEBAR_CONFIG,
      setActiveTab(tab: 'chat' | 'mask' | 'config') {
        set({ activeTab: tab });
      },
    }),
    {
      name: StoreKey.Sidebar,
      version: 1,
    },
  ),
); 