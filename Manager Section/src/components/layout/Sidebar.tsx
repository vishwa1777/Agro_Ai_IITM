import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/store';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'visits', label: 'Rep-wise Visit Tracking', icon: Users, path: '/visits' },
  { id: 'products', label: 'Product Demand Tracking', icon: Package, path: '/products' },
  { id: 'reports', label: 'Reports, Documents, Data & History', icon: FileText, path: '/reports' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className="fixed left-0 top-0 h-full bg-[#0B1710] border-r border-[rgba(120,255,120,0.08)] z-50 flex flex-col transition-all duration-300"
      style={{ width: sidebarCollapsed ? 64 : 240 }}
    >
      {/* Header / Logo */}
      <div
        className="h-16 flex items-center px-5 border-b border-[rgba(120,255,120,0.08)]"
        style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
      >
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2C14 2 6 8 6 15C6 19.4183 9.58172 23 14 23C18.4183 23 22 19.4183 22 15C22 8 14 2 14 2Z"
              fill="#55D840"
              fillOpacity="0.2"
              stroke="#55D840"
              strokeWidth="1.5"
            />
            <path
              d="M14 6V17"
              stroke="#55D840"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M11 11C11 11 12.5 9 14 9C15.5 9 17 11 17 11"
              stroke="#55D840"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          {!sidebarCollapsed && (
            <span className="text-[20px] font-bold text-[#55D840] tracking-tight">
              AgroAI
            </span>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-full flex items-center justify-center hover:bg-[#2D6A4F] transition-colors z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight size={12} className="text-[#AAB8AA]" />
        ) : (
          <ChevronLeft size={12} className="text-[#AAB8AA]" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-custom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 h-11 rounded-lg px-3 transition-all duration-200 group ${
                isActive
                  ? 'bg-[rgba(85,216,64,0.12)] border-l-[3px] border-[#55D840]'
                  : 'hover:bg-[rgba(85,216,64,0.08)] border-l-[3px] border-transparent'
              }`}
              style={{
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                margin: '2px 0',
                paddingLeft: sidebarCollapsed ? 0 : 12,
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#55D840]' : 'text-[#AAB8AA] group-hover:text-[#55D840]'
                }`}
              />
              {!sidebarCollapsed && (
                <span
                  className={`text-[14px] font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#55D840]' : 'text-[#AAB8AA] group-hover:text-[#55D840]'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(120,255,120,0.08)]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#7CFF4F]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#7CFF4F] pulse-dot" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="text-[12px] text-[#AAB8AA]">Online - Synced</div>
              <div className="text-[10px] text-[rgba(255,255,255,0.4)]">Last Sync: 2 min ago</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
