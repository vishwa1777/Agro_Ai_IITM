import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarCheck,
  Store,
  IndianRupee,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Download,
  Calendar,
} from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import CardHeader from '@/components/shared/CardHeader';
import TimelineItem from '@/components/shared/TimelineItem';
import ProgressBar from '@/components/shared/ProgressBar';
import ScoreBadge from '@/components/shared/ScoreBadge';
import Avatar from '@/components/shared/Avatar';
import BiharMap from '@/components/shared/BiharMap';
import { useDataStore } from '@/store';

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const Dashboard: React.FC = () => {
  const { representatives, scheduleEvents, mapPins } = useDataStore();

  const topReps = representatives.slice(0, 5);

  // Count statuses
  const statusCounts = {
    'on-visit': representatives.filter((r) => r.status === 'on-visit').length,
    idle: representatives.filter((r) => r.status === 'idle').length,
    travelling: representatives.filter((r) => r.status === 'travelling').length,
    offline: representatives.filter((r) => r.status === 'offline').length,
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[18px] text-[#AAB8AA]">Welcome back,</div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Rajeev Mehta</h1>
            <span className="text-[12px] font-medium text-[#55D840] bg-[rgba(85,216,64,0.15)] px-2.5 py-1 rounded-md">
              Regional Manager
            </span>
          </div>
          <p className="text-[14px] text-[#AAB8AA] mt-1">
            Overview of the team, schedules and field activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg px-4 py-2">
            <Calendar size={16} className="text-[#AAB8AA]" />
            <span className="text-[13px] text-white">02 Jun 2026 - 09 Jun 2026</span>
          </div>
          <button className="flex items-center gap-2 bg-[#55D840] text-[#07110B] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#7CFF4F] transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
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
          icon={CalendarCheck}
          iconColor="#3B82F6"
          iconBgColor="rgba(59,130,246,0.1)"
          label="Today's Visits"
          value="68 / 85"
          subtext="80% Completed"
          subtextColor="#7CFF4F"
          progress={80}
          showProgress
        />
        <KPICard
          icon={Store}
          iconColor="#8B5CF6"
          iconBgColor="rgba(139,92,246,0.1)"
          label="Retailers Covered"
          value="432"
          subtext="This Month"
          subtextColor="#AAB8AA"
        />
        <KPICard
          icon={IndianRupee}
          iconColor="#7CFF4F"
          iconBgColor="rgba(124,255,79,0.1)"
          label="Team Revenue"
          value="Rs.24.8 Lakh"
          subtext="This Month"
          subtextColor="#AAB8AA"
        />
        <KPICard
          icon={ClipboardList}
          iconColor="#F59E0B"
          iconBgColor="rgba(245,158,11,0.1)"
          label="Pending Tasks"
          value="23"
          subtext="Requires Attention"
          subtextColor="#F59E0B"
        />
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Team Performance */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:card-glow-hover transition-all">
          <CardHeader title="Team Performance" actionText="View All" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Representative</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Visits</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Completion</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Revenue</th>
                  <th className="text-left text-[12px] font-semibold text-[#AAB8AA] pb-3 px-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {topReps.map((rep) => (
                  <tr key={rep.id} className="border-b border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.03)] transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={rep.initials} color={rep.avatarColor} size={32} />
                        <div>
                          <div className="text-[13px] font-semibold text-white">{rep.name}</div>
                          <div className="text-[11px] text-[#AAB8AA]">{rep.territory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-white">
                      {rep.completedVisits} / {rep.plannedVisits}
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-[12px] text-white mb-1">{rep.completionRate}%</div>
                      <ProgressBar value={rep.completionRate} height={4} className="w-20" />
                    </td>
                    <td className="py-3 px-2 text-[13px] text-white">Rs.{rep.revenue}</td>
                    <td className="py-3 px-2">
                      <ScoreBadge score={rep.score} size={28} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[13px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Full Team Performance
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:card-glow-hover transition-all">
          <CardHeader title="Today's Schedule" actionText="View Calendar" />
          <div className="relative">
            {scheduleEvents.map((event, index) => (
              <TimelineItem
                key={event.id}
                time={event.time}
                representative={event.representative}
                location={event.location}
                status={event.status}
                isLast={index === scheduleEvents.length - 1}
              />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[13px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Full Schedule
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Team Monitoring */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:card-glow-hover transition-all">
          <CardHeader
            title="Team Monitoring"
            rightElement={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-[#7CFF4F]" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#7CFF4F] pulse-dot" />
                </div>
                <span className="text-[12px] text-[#AAB8AA]">Live Status</span>
              </div>
            }
          />
          {/* Status Summary */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="text-[10px] text-[#AAB8AA] uppercase tracking-wider">On Visit</div>
              <div className="text-[18px] font-bold text-[#7CFF4F] mt-1">
                {statusCounts['on-visit']}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[#AAB8AA] uppercase tracking-wider">Idle</div>
              <div className="text-[18px] font-bold text-[#F59E0B]">{statusCounts.idle}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[#AAB8AA] uppercase tracking-wider">Travelling</div>
              <div className="text-[18px] font-bold text-[#3B82F6]">{statusCounts.travelling}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[#AAB8AA] uppercase tracking-wider">Offline</div>
              <div className="text-[18px] font-bold text-[#EF4444]">{statusCounts.offline}</div>
            </div>
          </div>
          {/* Map */}
          <BiharMap pins={mapPins} height={200} />
          <div className="mt-4 pt-3 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[13px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Full Monitoring
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Highlights */}
      <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
        <CardHeader title="Today's Highlights" />
        <div className="grid grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[rgba(124,255,79,0.1)] flex items-center justify-center flex-shrink-0">
              <CheckCircle size={22} className="text-[#7CFF4F]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white">16</div>
              <div className="text-[12px] text-[#AAB8AA]">Visits Completed</div>
              <div className="text-[12px] text-[#7CFF4F]">Good progress!</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center flex-shrink-0">
              <Store size={22} className="text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white">12</div>
              <div className="text-[12px] text-[#AAB8AA]">Retailers Added</div>
              <div className="text-[12px] text-[#7CFF4F]">+8 vs Yesterday</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} className="text-[#EF4444]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white">3</div>
              <div className="text-[12px] text-[#AAB8AA]">Tasks Overdue</div>
              <div className="text-[12px] text-[#EF4444]">Needs Attention</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[rgba(124,255,79,0.1)] flex items-center justify-center flex-shrink-0">
              <TrendingUp size={22} className="text-[#7CFF4F]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white">Rs.5.2 Lakh</div>
              <div className="text-[12px] text-[#AAB8AA]">Revenue Generated Today</div>
              <div className="text-[12px] text-[#7CFF4F]">+12% vs Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
