import { create } from 'zustand';
import type { UIState, DataState } from '@/types';
import {
  representatives,
  products,
  scheduleEvents,
  reports,
  documents,
  dataExports,
  historyRecords,
  territories,
  mapPins,
  insights,
  notifications,
} from '@/data/mockData';

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  notifications: notifications,
  unreadCount: notifications.filter((n) => !n.read).length,
  markNotificationRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),
}));

export const useDataStore = create<DataState>((set) => ({
  representatives,
  products,
  scheduleEvents,
  reports,
  documents,
  dataExports,
  historyRecords,
  territories,
  mapPins,
  insights,
  selectedDateRange: '02 Jun 2026 - 09 Jun 2026',
  selectedRegion: 'Bihar Region',
  selectedTerritory: 'All',
  selectedRepresentative: 'All',
  filters: {
    dateRange: 'This Week',
    territory: 'All',
    representative: 'All',
    status: 'All',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}));
