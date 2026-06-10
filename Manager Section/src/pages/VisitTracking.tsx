import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lock,
  Trophy,
  Download,
  Info,
  Store,
  IndianRupee,
} from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import CardHeader from '@/components/shared/CardHeader';
import ProgressBar from '@/components/shared/ProgressBar';
import Avatar from '@/components/shared/Avatar';
import BiharMap from '@/components/shared/BiharMap';
import { useDataStore } from '@/store';

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const VisitTracking: React.FC = () => {
  const { representatives, mapPins } = useDataStore();

  const statusCounts = {
    'on-visit': representatives.filter((r) => r.status === 'on-visit').length,
    idle: representatives.filter((r) => r.status === 'idle').length,
    travelling: representatives.filter((r) => r.status === 'travelling').length,
    offline: representatives.filter((r) => r.status === 'offline').length,
  };

  const topReps = representatives.slice(0, 5);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] font-semibold text-white tracking-tight">
              Representative Wise Visit Tracking
            </h1>
            <Info size={18} className="text-[#AAB8AA] cursor-help" />
          </div>
          <p className="text-[14px] text-[#AAB8AA] mt-1">
            Track field representatives performance and visit activities in real-time.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] text-[#55D840] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[rgba(85,216,64,0.08)] transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={Users}
          iconColor="#7CFF4F"
          iconBgColor="rgba(124,255,79,0.1)"
          label="Total Representatives"
          value="18"
          subtext="Active: 16 (89%)"
          subtextColor="#7CFF4F"
        />
        <KPICard
          icon={Calendar}
          iconColor="#3B82F6"
          iconBgColor="rgba(59,130,246,0.1)"
          label="Visits Planned"
          value="85"
          subtext="Today"
          subtextColor="#AAB8AA"
        />
        <KPICard
          icon={CheckCircle}
          iconColor="#7CFF4F"
          iconBgColor="rgba(124,255,79,0.1)"
          label="Visits Completed"
          value="68"
          subtext="Today"
          subtextColor="#AAB8AA"
        />
        <KPICard
          icon={TrendingUp}
          iconColor="#7CFF4F"
          iconBgColor="rgba(124,255,79,0.1)"
          label="Completion Rate"
          value="80%"
          subtext="vs Planned"
          subtextColor="#AAB8AA"
        />
        <KPICard
          icon={Clock}
          iconColor="#8B5CF6"
          iconBgColor="rgba(139,92,246,0.1)"
          label="Average Visit Duration"
          value="18m"
          subtext="Today"
          subtextColor="#AAB8AA"
        />
      </div>

      {/* Two Column: Performance Table + Live Status */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-4 mb-6">
        {/* Representative Performance Table */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Representative Performance" actionText="View All" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Representative</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Territory</th>
                  <th className="text-center text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Planned</th>
                  <th className="text-center text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Completed</th>
                  <th className="text-center text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Pending</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Completion %</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Score</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topReps.map((rep) => (
                  <tr key={rep.id} className="border-b border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.03)] transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={rep.initials} color={rep.avatarColor} size={32} />
                        <span className="text-[13px] font-semibold text-white">{rep.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-[#AAB8AA]">{rep.territory}</td>
                    <td className="py-3 px-2 text-[13px] text-white text-center">{rep.plannedVisits}</td>
                    <td className="py-3 px-2 text-[13px] text-white text-center">{rep.completedVisits}</td>
                    <td className="py-3 px-2 text-[13px] text-white text-center">{rep.pendingVisits}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-white w-8">{rep.completionRate}%</span>
                        <ProgressBar value={rep.completionRate} height={4} className="w-16" />
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="text-[13px] font-bold"
                        style={{
                          color: rep.score >= 80 ? '#7CFF4F' : rep.score >= 60 ? '#F59E0B' : '#EF4444',
                        }}
                      >
                        {rep.score}/100
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              rep.status === 'on-visit'
                                ? '#7CFF4F'
                                : rep.status === 'travelling'
                                ? '#3B82F6'
                                : rep.status === 'idle'
                                ? '#F59E0B'
                                : '#EF4444',
                          }}
                        />
                        <span className="text-[12px] text-[#AAB8AA] capitalize">
                          {rep.status.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Team Status */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader
            title="Live Team Status"
            rightElement={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-[#7CFF4F]" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#7CFF4F] pulse-dot" />
                </div>
                <span className="text-[12px] text-[#AAB8AA]">Live</span>
              </div>
            }
          />
          {/* Status Grid */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'On Visit', count: statusCounts['on-visit'], color: '#7CFF4F', glow: 'status-glow-online' },
              { label: 'Travelling', count: statusCounts.travelling, color: '#3B82F6', glow: 'status-glow-travelling' },
              { label: 'Idle', count: statusCounts.idle, color: '#F59E0B', glow: 'status-glow-idle' },
              { label: 'Offline', count: statusCounts.offline, color: '#EF4444', glow: 'status-glow-offline' },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <div className="text-[10px] text-[#AAB8AA] uppercase tracking-wider">{s.label}</div>
                <div className="text-[20px] font-bold mt-1" style={{ color: s.color }}>
                  {s.count}
                </div>
              </div>
            ))}
          </div>
          <BiharMap pins={mapPins} height={220} />
        </div>
      </div>

      {/* Four Column Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Route Progress */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Today's Route Progress" actionText="View Routes" />
          <div className="space-y-3">
            {topReps.map((rep) => (
              <div key={rep.id} className="flex items-center gap-3">
                <Avatar initials={rep.initials} color={rep.avatarColor} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-white truncate">{rep.name}</span>
                    <span className="text-[11px] text-[#AAB8AA]">{rep.completedVisits}/{rep.plannedVisits}</span>
                  </div>
                  <ProgressBar value={rep.completionRate} height={4} className="mt-1" />
                </div>
                <span
                  className="text-[11px] font-bold"
                  style={{
                    color: rep.completionRate >= 70 ? '#7CFF4F' : rep.completionRate >= 40 ? '#F59E0B' : '#EF4444',
                  }}
                >
                  {rep.completionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Visits */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Missed Visits Today" actionText="View All" />
          <div className="space-y-3">
            {[
              { name: 'Raj Kumar', territory: 'Gaya', count: 4 },
              { name: 'Rohit Kumar', territory: 'Darbhanga', count: 6 },
              { name: 'Sanjay Verma', territory: 'Patna South', count: 5 },
              { name: 'Vikash Singh', territory: 'Muzaffarpur', count: 4 },
              { name: 'Amit Sharma', territory: 'Patna North', count: 2 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-[#EF4444] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{item.name}</div>
                  <div className="text-[11px] text-[#AAB8AA]">{item.territory}</div>
                </div>
                <span className="text-[14px] font-bold text-[#EF4444]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Value Retailers Pending */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="High Value Retailers Pending" actionText="View All" />
          <div className="space-y-3">
            {[
              { name: 'Raj Kumar', territory: 'Gaya', count: 4 },
              { name: 'Rohit Kumar', territory: 'Darbhanga', count: 3 },
              { name: 'Sanjay Verma', territory: 'Patna South', count: 2 },
              { name: 'Vikash Singh', territory: 'Muzaffarpur', count: 2 },
              { name: 'Amit Sharma', territory: 'Patna North', count: 1 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Lock size={16} className="text-[#F59E0B] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{item.name}</div>
                  <div className="text-[11px] text-[#AAB8AA]">{item.territory}</div>
                </div>
                <span className="text-[14px] font-bold text-[#F59E0B]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Top Performers" actionText="View All" />
          <div className="space-y-3">
            {[
              { name: 'Amit Sharma', territory: 'Patna North', score: 92 },
              { name: 'Raj Kumar', territory: 'Gaya', score: 78 },
              { name: 'Vikash Singh', territory: 'Muzaffarpur', score: 74 },
              { name: 'Sanjay Verma', territory: 'Patna South', score: 65 },
              { name: 'Rohit Kumar', territory: 'Darbhanga', score: 58 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Trophy size={16} className="text-[#F59E0B] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{item.name}</div>
                  <div className="text-[11px] text-[#AAB8AA]">{item.territory}</div>
                </div>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: item.score >= 80 ? '#7CFF4F' : item.score >= 60 ? '#F59E0B' : '#EF4444' }}
                >
                  {item.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit Quality Overview */}
      <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
        <CardHeader title="Visit Quality Overview (Today)" />
        <div className="grid grid-cols-5 gap-6">
          {[
            { icon: Clock, color: '#8B5CF6', label: 'Average Visit Duration', value: '18m' },
            { icon: Store, color: '#3B82F6', label: 'Retailers Covered', value: '68' },
            { icon: Users, color: '#7CFF4F', label: 'Grower Meetings', value: '24' },
            { icon: ShoppingCartIcon, color: '#7CFF4F', label: 'Orders Generated', value: 'Rs.5.2 Lakh' },
            { icon: IndianRupee, color: '#3B82F6', label: 'Order Value / Visit', value: 'Rs.7,650' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15` }}
              >
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-[10px] text-[#AAB8AA] uppercase tracking-wider">{item.label}</div>
                <div className="text-[20px] font-bold text-white mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Inline icon components for the quality overview
const ShoppingCartIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default VisitTracking;
