import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  Calendar,
  Sun,
  Moon,
  Bell,
  Check,
} from 'lucide-react';
import { useUIStore } from '@/store';

const Topbar: React.FC = () => {
  const { theme, toggleTheme, notifications, unreadCount, markNotificationRead } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setShowRegion(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const regionOptions = ['Bihar Region', 'UP Region', 'MP Region', 'Maharashtra Region'];

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-end px-6 bg-[#07110B]/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Region Selector */}
        <div className="relative" ref={regionRef}>
          <button
            onClick={() => setShowRegion(!showRegion)}
            className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg px-4 py-2 hover:border-[rgba(85,216,64,0.3)] transition-colors"
          >
            <MapPin size={16} className="text-[#55D840]" />
            <span className="text-[14px] text-white">Bihar Region</span>
            <ChevronDown size={16} className="text-[#AAB8AA]" />
          </button>
          {showRegion && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50">
              {regionOptions.map((region) => (
                <button
                  key={region}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[rgba(85,216,64,0.08)] transition-colors text-left"
                >
                  <MapPin size={14} className="text-[#55D840]" />
                  <span className="text-[13px] text-white">{region}</span>
                  {region === 'Bihar Region' && <Check size={14} className="text-[#7CFF4F] ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg px-4 py-2">
          <Calendar size={16} className="text-[#AAB8AA]" />
          <span className="text-[13px] text-white">02 Jun 2026 - 09 Jun 2026</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-[#AAB8AA]" />
          ) : (
            <Moon size={18} className="text-[#AAB8AA]" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors relative"
          >
            <Bell size={18} className="text-[#AAB8AA]" />
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#EF4444] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#EF4444] rounded-full pulse-dot opacity-50" />
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[rgba(120,255,120,0.08)] flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white">Notifications</span>
                <span className="text-[12px] text-[#55D840]">{unreadCount} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-custom">
                {unreadNotifications.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] font-semibold text-[#AAB8AA] uppercase tracking-wider">
                      New
                    </div>
                    {unreadNotifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className="w-full px-4 py-3 hover:bg-[rgba(85,216,64,0.05)] transition-colors text-left border-l-2 border-[#55D840]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-white truncate">{n.title}</div>
                            <div className="text-[11px] text-[#AAB8AA] mt-0.5 line-clamp-2">{n.message}</div>
                          </div>
                          <span className="text-[10px] text-[rgba(255,255,255,0.4)] flex-shrink-0">{n.time}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
                {readNotifications.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] font-semibold text-[#AAB8AA] uppercase tracking-wider">
                      Earlier
                    </div>
                    {readNotifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 text-left opacity-60"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-white truncate">{n.title}</div>
                            <div className="text-[11px] text-[#AAB8AA] mt-0.5 line-clamp-2">{n.message}</div>
                          </div>
                          <span className="text-[10px] text-[rgba(255,255,255,0.4)] flex-shrink-0">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#55D840] to-[#2D6A4F] flex items-center justify-center border-2 border-[rgba(85,216,64,0.3)]">
          <span className="text-[14px] font-semibold text-white">RM</span>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Topbar);
