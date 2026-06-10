export type RepStatus = 'on-visit' | 'travelling' | 'idle' | 'offline';
export type ProductStatus = 'critical' | 'high' | 'medium' | 'good';
export type ScheduleStatus = 'scheduled' | 'in-progress' | 'upcoming';
export type RiskLevel = 'high' | 'medium' | 'low';

export interface Representative {
  id: string;
  name: string;
  initials: string;
  territory: string;
  avatarColor: string;
  plannedVisits: number;
  completedVisits: number;
  pendingVisits: number;
  completionRate: number;
  revenue: string;
  score: number;
  status: RepStatus;
  statusLocation: string;
  averageVisitDuration: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  demand: number;
  available: number;
  gap: number;
  gapPercent: number;
  status: ProductStatus;
  demandScore: number;
  trend: number;
  potentialRevenue: string;
  priorityScore: number;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  representative: string;
  location: string;
  status: ScheduleStatus;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  generatedOn: string;
  category: string;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  uploadedOn: string;
}

export interface DataExport {
  id: string;
  name: string;
  dataType: string;
  period: string;
  generatedOn: string;
}

export interface HistoryRecord {
  id: string;
  record: string;
  type: string;
  dateTime: string;
  details: string;
  priority?: string;
}

export interface Territory {
  name: string;
  topProduct: string;
  demand: number;
  available: number;
  gap: number;
  risk: RiskLevel;
}

export interface MapPin {
  id: string;
  name: string;
  initials: string;
  x: number;
  y: number;
  status: RepStatus;
  avatarColor: string;
}

export interface Insight {
  id: string;
  icon: string;
  color: string;
  title: string;
  actionText: string;
  hasRevenue?: boolean;
  revenue?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  role: 'representative' | 'manager';
  setRole: (role: 'representative' | 'manager') => void;
  isAuthenticated: boolean;
  login: (role: 'representative' | 'manager') => void;
  logout: () => void;
}

export interface DataState {
  representatives: Representative[];
  products: Product[];
  scheduleEvents: ScheduleEvent[];
  reports: Report[];
  documents: Document[];
  dataExports: DataExport[];
  historyRecords: HistoryRecord[];
  territories: Territory[];
  mapPins: MapPin[];
  insights: Insight[];
  selectedDateRange: string;
  selectedRegion: string;
  selectedTerritory: string;
  selectedRepresentative: string;
  filters: {
    dateRange: string;
    territory: string;
    representative: string;
    status: string;
  };
  setFilter: (key: string, value: string) => void;
}
