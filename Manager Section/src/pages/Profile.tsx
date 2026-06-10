import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Pencil,
  Mail,
  Phone,
  MapPin,
  Check,
  Sun,
  Moon,
  Globe,
  Bell,
  MessageSquare,
  FileText,
  Lock,
  Shield,
  Monitor,
  KeyRound,
  Users,
  MapPinned,
  Store,
  Package,
  Download,
  Upload,
  LogOut,
  ChevronRight,
  Camera,
} from 'lucide-react';
import CardHeader from '@/components/shared/CardHeader';
import ProgressBar from '@/components/shared/ProgressBar';

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const accentColors = [
  { color: '#55D840', active: true },
  { color: '#3B82F6', active: false },
  { color: '#8B5CF6', active: false },
  { color: '#F59E0B', active: false },
  { color: '#EF4444', active: false },
];

const Profile: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [compactView, setCompactView] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    inApp: true,
    reports: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">Profile</h1>
          <p className="text-[14px] text-[#AAB8AA] mt-1">
            Manage your personal information, preferences and account settings.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] text-[#55D840] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[rgba(85,216,64,0.08)] transition-colors">
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* Profile Info Row */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-4 mb-6">
        {/* Profile Card */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-6 card-glow">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#55D840] to-[#2D6A4F] flex items-center justify-center">
                <span className="text-[28px] font-bold text-white">RM</span>
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] rounded-full flex items-center justify-center hover:bg-[rgba(85,216,64,0.1)] transition-colors">
                <Camera size={14} className="text-[#55D840]" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[22px] font-bold text-white">Rajeev Mehta</h2>
                <span className="text-[12px] font-medium text-[#55D840] bg-[rgba(85,216,64,0.15)] px-2.5 py-1 rounded-md">
                  Regional Manager
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#55D840]" />
                  <span className="text-[14px] text-[#AAB8AA]">rajeev.mehta@agroai.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#55D840]" />
                  <span className="text-[14px] text-[#AAB8AA]">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#55D840]" />
                  <span className="text-[14px] text-[#AAB8AA]">Bihar Region</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-6 card-glow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-semibold text-white">Profile Completion</h3>
            <span className="text-[14px] font-medium text-[#7CFF4F]">85% Complete</span>
          </div>
          <ProgressBar value={85} height={6} className="mb-4" />
          <div className="space-y-2.5">
            {[
              { label: 'Personal Information', completed: true },
              { label: 'Region & Team', completed: true },
              { label: 'Preferences', completed: true },
              { label: 'Security Setup', completed: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-[#7CFF4F]' : 'bg-[rgba(245,158,11,0.2)]'
                  }`}
                >
                  {item.completed ? (
                    <Check size={12} className="text-[#07110B]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  )}
                </div>
                <span className={`text-[13px] ${item.completed ? 'text-[#AAB8AA]' : 'text-[#F59E0B]'}`}>
                  {item.label}
                </span>
                <span className={`text-[11px] ml-auto ${item.completed ? 'text-[#7CFF4F]' : 'text-[#F59E0B]'}`}>
                  {item.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three Column Info Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Personal Information */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#55D840]" />
              <h3 className="text-[16px] font-semibold text-white">Personal Information</h3>
            </div>
            <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
              <Pencil size={14} className="text-[#55D840]" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: 'Rajeev Mehta' },
              { label: 'Email Address', value: 'rajeev.mehta@agroai.com' },
              { label: 'Phone Number', value: '+91 98765 43210' },
              { label: 'Designation', value: 'Regional Manager' },
              { label: 'Region', value: 'Bihar Region' },
              { label: 'Date Joined', value: '15 Jan 2024' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-[11px] text-[#AAB8AA] uppercase tracking-wider">{item.label}</div>
                <div className="text-[14px] text-white mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Region Assignment */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPinned size={18} className="text-[#55D840]" />
              <h3 className="text-[16px] font-semibold text-white">Region Assignment</h3>
            </div>
            <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
              <Pencil size={14} className="text-[#55D840]" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Primary Region', value: 'Bihar Region' },
              { label: 'Region Code', value: 'BR-01' },
              { label: 'Total Territories', value: '124' },
              { label: 'Total Representatives', value: '18' },
              { label: 'Total Retailers', value: '2,850+' },
              { label: 'Total Products', value: '28' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-[11px] text-[#AAB8AA] uppercase tracking-wider">{item.label}</div>
                <div className="text-[14px] text-white mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Overview */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Team Overview" actionText="View All" />
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, color: '#55D840', value: '18', label: 'Representatives', sub: 'Active: 16' },
              { icon: MapPinned, color: '#3B82F6', value: '124', label: 'Territories', sub: 'Active: 118' },
              { icon: Store, color: '#8B5CF6', value: '2,850+', label: 'Retailers', sub: 'Active: 2,450+' },
              { icon: Package, color: '#F59E0B', value: '28', label: 'Products Tracked', sub: 'Active: 26' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15` }}>
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                </div>
                <div className="text-[20px] font-bold text-white">{item.value}</div>
                <div className="text-[11px] text-[#AAB8AA]">{item.label}</div>
                <div className="text-[10px] text-[#7CFF4F]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three Column Settings */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Appearance & Theme */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={18} className="text-[#55D840]" />
            <h3 className="text-[16px] font-semibold text-white">Appearance & Theme</h3>
          </div>
          <div className="space-y-4">
            {/* Theme Mode */}
            <div>
              <div className="text-[13px] font-medium text-white mb-1">Theme Mode</div>
              <div className="text-[11px] text-[#AAB8AA] mb-2">Choose your preferred theme</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    themeMode === 'dark'
                      ? 'bg-[#55D840] text-[#07110B]'
                      : 'bg-[rgba(255,255,255,0.04)] text-[#AAB8AA] hover:bg-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  <Moon size={14} />
                  Dark
                </button>
                <button
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    themeMode === 'light'
                      ? 'bg-[#55D840] text-[#07110B]'
                      : 'bg-[rgba(255,255,255,0.04)] text-[#AAB8AA] hover:bg-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  <Sun size={14} />
                  Light
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <div className="text-[13px] font-medium text-white mb-1">Accent Color</div>
              <div className="text-[11px] text-[#AAB8AA] mb-2">Choose your app accent color</div>
              <div className="flex gap-2">
                {accentColors.map((c, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      c.active ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0F1D14]' : ''
                    }`}
                    style={{ background: c.color }}
                  >
                    {c.active && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <div className="text-[13px] font-medium text-white mb-1">Language</div>
              <div className="text-[11px] text-[#AAB8AA] mb-2">Select your preferred language</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.04)] rounded-lg border border-[rgba(120,255,120,0.08)]">
                <Globe size={14} className="text-[#AAB8AA]" />
                <span className="text-[13px] text-white flex-1">English</span>
                <ChevronRight size={14} className="text-[#AAB8AA]" />
              </div>
            </div>

            {/* Font Size */}
            <div>
              <div className="text-[13px] font-medium text-white mb-1">Font Size</div>
              <div className="text-[11px] text-[#AAB8AA] mb-2">Adjust the app font size</div>
              <div className="flex gap-1 p-1 bg-[rgba(255,255,255,0.04)] rounded-lg">
                {(['Small', 'Medium', 'Large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                      fontSize === size
                        ? 'bg-[#0F1D14] text-white border border-[rgba(120,255,120,0.08)]'
                        : 'text-[#AAB8AA] hover:bg-[rgba(255,255,255,0.04)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact View */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-white">Compact View</div>
                <div className="text-[11px] text-[#AAB8AA]">Show more content in less space</div>
              </div>
              <button
                onClick={() => setCompactView(!compactView)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  compactView ? 'bg-[#55D840]' : 'bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                    compactView ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#55D840]" />
              <h3 className="text-[16px] font-semibold text-white">Notification Preferences</h3>
            </div>
            <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
              <Pencil size={14} className="text-[#55D840]" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { key: 'email' as const, icon: Mail, label: 'Email Notifications', desc: 'Receive important updates on your email' },
              { key: 'sms' as const, icon: MessageSquare, label: 'SMS Alerts', desc: 'Receive critical alerts on your mobile' },
              { key: 'inApp' as const, icon: Bell, label: 'In-App Notifications', desc: 'Receive notifications in the application' },
              { key: 'reports' as const, icon: FileText, label: 'Report & Summary Alerts', desc: 'Receive daily/weekly summary reports' },
            ].map((item) => (
              <div key={item.key} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(85,216,64,0.08)] flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-[#55D840]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{item.label}</div>
                  <div className="text-[11px] text-[#AAB8AA]">{item.desc}</div>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 mt-0.5 ${
                    notifications[item.key] ? 'bg-[#55D840]' : 'bg-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                      notifications[item.key] ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#55D840]" />
              <h3 className="text-[16px] font-semibold text-white">Security</h3>
            </div>
            <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
              <Pencil size={14} className="text-[#55D840]" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Password', value: '***********', action: 'Change', icon: Lock },
              { label: 'Last Login', value: '09 Jun 2026 10:30 AM', action: null, icon: Monitor },
              { label: 'Login Device', value: 'Chrome on Windows', action: null, icon: Monitor },
              { label: 'Two-Factor Authentication', value: 'Disabled', action: 'Enable', icon: KeyRound, valueColor: '#F59E0B' },
              { label: 'Active Sessions', value: '2', action: 'Manage', icon: Shield },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(85,216,64,0.08)] flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-[#55D840]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#AAB8AA]">{item.label}</div>
                  <div className="text-[13px] font-medium mt-0.5" style={{ color: (item as { valueColor?: string }).valueColor || '#FFFFFF' }}>
                    {item.value}
                  </div>
                </div>
                {item.action && (
                  <button className="px-3 py-1 bg-[rgba(85,216,64,0.1)] text-[#55D840] text-[11px] font-semibold rounded-md hover:bg-[rgba(85,216,64,0.2)] transition-colors flex-shrink-0">
                    {item.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
        <h3 className="text-[16px] font-semibold text-white mb-4">Account Actions</h3>
        <div className="flex gap-4">
          <button className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.05)] hover:border-[rgba(85,216,64,0.15)] transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
              <Download size={20} className="text-[#3B82F6]" />
            </div>
            <div className="text-left">
              <div className="text-[14px] font-medium text-white group-hover:text-[#55D840] transition-colors">Download My Data</div>
              <div className="text-[11px] text-[#AAB8AA]">Download your account data</div>
            </div>
          </button>
          <button className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.05)] hover:border-[rgba(85,216,64,0.15)] transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
              <Upload size={20} className="text-[#8B5CF6]" />
            </div>
            <div className="text-left">
              <div className="text-[14px] font-medium text-white group-hover:text-[#55D840] transition-colors">Export Account Activity</div>
              <div className="text-[11px] text-[#AAB8AA]">Export your activity logs</div>
            </div>
          </button>
          <button className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.1)] transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
              <LogOut size={20} className="text-[#EF4444]" />
            </div>
            <div className="text-left">
              <div className="text-[14px] font-medium text-[#EF4444]">Logout</div>
              <div className="text-[11px] text-[#AAB8AA]">Sign out from your account</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
