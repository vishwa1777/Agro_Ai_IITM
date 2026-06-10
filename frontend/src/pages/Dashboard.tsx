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
  ChevronLeft,
  Navigation,
} from 'lucide-react';
import CardHeader from '@/components/shared/CardHeader';
import ProgressBar from '@/components/shared/ProgressBar';
import ScoreBadge from '@/components/shared/ScoreBadge';
import Avatar from '@/components/shared/Avatar';
import BiharMap from '@/components/shared/BiharMap';
import { useDataStore } from '@/store';

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const Dashboard: React.FC = () => {
  const { representatives, scheduleEvents, mapPins } = useDataStore();

  const topReps = representatives.slice(0, 5);

  const statusCounts = {
    'on-visit': representatives.filter((r) => r.status === 'on-visit').length,
    idle: representatives.filter((r) => r.status === 'idle').length,
    travelling: representatives.filter((r) => r.status === 'travelling').length,
    offline: representatives.filter((r) => r.status === 'offline').length,
  };

  const scheduleStatusColors = {
    scheduled: 'border-blue-500 text-blue-400 bg-blue-500/10',
    'in-progress': 'border-[#7CFF4F] text-[#7CFF4F] bg-[#7CFF4F]/10',
    upcoming: 'border-amber-500 text-amber-400 bg-amber-500/10',
  };

  const scheduleGlowColors = {
    scheduled: '#3B82F6',
    'in-progress': '#7CFF4F',
    upcoming: '#F59E0B',
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-8"
    >
      {/* Premium Welcome Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F291B] to-[#08130E] border border-[rgba(85,216,64,0.15)] rounded-2xl p-6 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#55D840]/10 filter blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#2D6A4F]/10 filter blur-[60px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="text-[12px] text-[#AAB8AA] font-bold tracking-widest uppercase">Overview System</div>
          <div className="flex items-center gap-3 mt-1 mb-2.5">
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-none">Welcome back, Rajeev Mehta</h1>
            <span className="text-[10px] font-bold text-[#7CFF4F] bg-[#55D840]/12 border border-[#55D840]/25 px-2 py-0.5 rounded uppercase tracking-wide">
              Regional Manager
            </span>
          </div>
          <p className="text-[14px] text-[#CBD5E1] leading-relaxed">
            Your team is active in <strong className="text-white">Bihar Region</strong>. Today's visits are progressing exceptionally well at <strong className="text-[#7CFF4F]">80% completion</strong> across all active territories.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-[#07110B] border border-[rgba(120,255,120,0.08)] rounded-xl px-4 py-2.5">
            <Calendar size={18} className="text-[#55D840]" />
            <div className="text-left">
              <div className="text-[9px] text-[#AAB8AA] uppercase font-bold tracking-wider leading-none">Reporting Period</div>
              <div className="text-[12px] text-white font-semibold mt-1">02 Jun 2026 - 09 Jun 2026</div>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 bg-[#55D840] text-[#07110B] px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#7CFF4F] hover:shadow-[0_0_20px_rgba(85,216,64,0.3)] transition-all duration-300"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Glowing KPI Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-5 gap-4"
      >
        {/* Card 1: Representatives */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:border-[#55D840]/30 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#55D840]/5 rounded-full filter blur-[20px] group-hover:bg-[#55D840]/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold text-[#AAB8AA] uppercase tracking-wider">Total Representatives</span>
            <div className="w-8 h-8 rounded-lg bg-[#55D840]/10 flex items-center justify-center">
              <Users size={16} className="text-[#55D840]" />
            </div>
          </div>
          <div className="text-[30px] font-bold text-white tracking-tight">18</div>
          <div className="text-[11px] text-[#7CFF4F] font-semibold mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF4F] animate-pulse" /> Active: 16 (89%)
          </div>
        </motion.div>

        {/* Card 2: Visits */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:border-[#3B82F6]/30 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6]/5 rounded-full filter blur-[20px] group-hover:bg-[#3B82F6]/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold text-[#AAB8AA] uppercase tracking-wider">Today's Visits</span>
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
              <CalendarCheck size={16} className="text-[#3B82F6]" />
            </div>
          </div>
          <div className="text-[30px] font-bold text-white tracking-tight">68 / 85</div>
          <div className="text-[11px] text-[#7CFF4F] font-semibold mt-2 flex items-center justify-between">
            <span>80% Completed</span>
          </div>
          <div className="h-[4px] bg-white/5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#7CFF4F] rounded-full" style={{ width: '80%' }} />
          </div>
        </motion.div>

        {/* Card 3: Retailers */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:border-[#8B5CF6]/30 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/5 rounded-full filter blur-[20px] group-hover:bg-[#8B5CF6]/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold text-[#AAB8AA] uppercase tracking-wider">Retailers Covered</span>
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
              <Store size={16} className="text-[#8B5CF6]" />
            </div>
          </div>
          <div className="text-[30px] font-bold text-white tracking-tight">432</div>
          <div className="text-[11px] text-[#AAB8AA] mt-2 font-medium">
            This Month
          </div>
        </motion.div>

        {/* Card 4: Revenue */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:border-[#55D840]/30 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#55D840]/5 rounded-full filter blur-[20px] group-hover:bg-[#55D840]/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold text-[#AAB8AA] uppercase tracking-wider">Team Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#55D840]/10 flex items-center justify-center">
              <IndianRupee size={16} className="text-[#55D840]" />
            </div>
          </div>
          <div className="text-[30px] font-bold text-white tracking-tight">₹24.8 Lakh</div>
          <div className="text-[11px] text-[#AAB8AA] mt-2 font-medium">
            This Month
          </div>
        </motion.div>

        {/* Card 5: Tasks */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:border-[#F59E0B]/30 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 rounded-full filter blur-[20px] group-hover:bg-[#F59E0B]/10 transition-all duration-300" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold text-[#AAB8AA] uppercase tracking-wider">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <ClipboardList size={16} className="text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-[30px] font-bold text-white tracking-tight">23</div>
          <div className="text-[11px] text-[#EF4444] font-semibold mt-2 flex items-center gap-1">
            <AlertTriangle size={12} className="animate-bounce" /> Requires Attention
          </div>
        </motion.div>
      </motion.div>

      {/* Three Column Sections */}
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1: Team Performance */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow flex flex-col justify-between hover:border-[rgba(85,216,64,0.15)] transition-all duration-300">
          <div>
            <CardHeader title="Team Performance" actionText="View All" />
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(120,255,120,0.08)]">
                    <th className="text-left text-[11px] font-bold text-[#AAB8AA] pb-3 px-1 uppercase tracking-wider">Representative</th>
                    <th className="text-center text-[11px] font-bold text-[#AAB8AA] pb-3 px-1 uppercase tracking-wider">Visits</th>
                    <th className="text-left text-[11px] font-bold text-[#AAB8AA] pb-3 px-1 uppercase tracking-wider">Completion</th>
                    <th className="text-right text-[11px] font-bold text-[#AAB8AA] pb-3 px-1 uppercase tracking-wider">Revenue</th>
                    <th className="text-center text-[11px] font-bold text-[#AAB8AA] pb-3 px-1 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(120,255,120,0.04)]">
                  {topReps.map((rep) => (
                    <tr key={rep.id} className="hover:bg-[rgba(85,216,64,0.03)] transition-colors group">
                      <td className="py-3.5 px-1">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={rep.initials} color={rep.avatarColor} size={30} />
                          <div>
                            <div className="text-[13px] font-bold text-white group-hover:text-[#55D840] transition-colors">{rep.name}</div>
                            <div className="text-[10px] text-[#AAB8AA]">{rep.territory}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-1 text-[13px] font-semibold text-white text-center">
                        {rep.completedVisits} <span className="text-[#AAB8AA] text-[10px]">/ {rep.plannedVisits}</span>
                      </td>
                      <td className="py-3.5 px-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-white w-8">{rep.completionRate}%</span>
                          <ProgressBar value={rep.completionRate} height={4} className="w-16" />
                        </div>
                      </td>
                      <td className="py-3.5 px-1 text-[13px] font-bold text-white text-right">₹{rep.revenue}</td>
                      <td className="py-3.5 px-1 text-center">
                        <ScoreBadge score={rep.score} size={26} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[12px] font-bold text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Full Team Performance
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Column 2: Today's Schedule */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow flex flex-col justify-between hover:border-[rgba(85,216,64,0.15)] transition-all duration-300">
          <div>
            <CardHeader title="Today's Schedule" actionText="View Calendar" />
            <div className="relative pl-16 pr-1 py-4 space-y-4 mt-2">
              {/* Timeline central bar */}
              <div className="absolute left-[79px] top-6 bottom-6 w-px bg-[rgba(120,255,120,0.08)]" />

              {scheduleEvents.map((event, index) => (
                <div key={event.id} className="relative flex gap-4 group">
                  {/* Left Column: Time */}
                  <span className="absolute -left-16 text-[11px] font-semibold text-[#AAB8AA] w-12 text-right top-1">
                    {event.time}
                  </span>

                  {/* Bullet center dot */}
                  <div className="absolute left-[13px] top-[7px] z-10 flex items-center justify-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 border-[#0F1D14] shadow-sm animate-pulse"
                      style={{
                        background: scheduleGlowColors[event.status],
                        boxShadow: `0 0 8px ${scheduleGlowColors[event.status]}`,
                      }}
                    />
                  </div>

                  {/* Content micro-card */}
                  <div className="flex-1 bg-[rgba(255,255,255,0.01)] border border-[rgba(120,255,120,0.04)] rounded-xl p-3 hover:bg-[rgba(85,216,64,0.02)] hover:border-[rgba(85,216,64,0.1)] transition-all duration-200">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[13px] font-bold text-white group-hover:text-[#55D840] transition-colors">
                          {event.representative}
                        </div>
                        <div className="text-[11px] text-[#AAB8AA] mt-0.5">{event.location}</div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${scheduleStatusColors[event.status]}`}>
                        {event.status === 'in-progress' ? 'Active' : event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[12px] font-bold text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Full Schedule
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Column 3: Team Monitoring */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow flex flex-col justify-between hover:border-[rgba(85,216,64,0.15)] transition-all duration-300">
          <div>
            <CardHeader
              title="Team Monitoring"
              rightElement={
                <div className="flex items-center gap-2 bg-[#55D840]/10 border border-[#55D840]/25 rounded-full px-2.5 py-0.5">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7CFF4F]" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#7CFF4F] pulse-dot" />
                  </div>
                  <span className="text-[10px] font-bold text-[#7CFF4F] uppercase tracking-wider">Live Status</span>
                </div>
              }
            />

            {/* Status Summary Counts */}
            <div className="grid grid-cols-4 gap-2 mt-4 mb-4">
              <div className="text-center p-2 rounded-xl bg-[#55D840]/5 border border-[#55D840]/10">
                <div className="text-[9px] text-[#AAB8AA] uppercase font-bold tracking-wider">On Visit</div>
                <div className="text-[18px] font-bold text-[#7CFF4F] mt-0.5">{statusCounts['on-visit']}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="text-[9px] text-[#AAB8AA] uppercase font-bold tracking-wider">Idle</div>
                <div className="text-[18px] font-bold text-[#F59E0B] mt-0.5">{statusCounts.idle}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="text-[9px] text-[#AAB8AA] uppercase font-bold tracking-wider">Travelling</div>
                <div className="text-[18px] font-bold text-[#3B82F6] mt-0.5">{statusCounts.travelling}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="text-[9px] text-[#AAB8AA] uppercase font-bold tracking-wider">Offline</div>
                <div className="text-[18px] font-bold text-[#EF4444] mt-0.5">{statusCounts.offline}</div>
              </div>
            </div>

            {/* Map Container */}
            <BiharMap pins={mapPins} height={200} />
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[12px] font-bold text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Full Monitoring
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Highlights Row */}
      <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:border-[rgba(85,216,64,0.15)] transition-all duration-300">
        <CardHeader title="Today's Highlights" />
        <div className="grid grid-cols-4 gap-6 mt-4">
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.02)] hover:border-[rgba(85,216,64,0.12)] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-[#7CFF4F]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <CheckCircle size={22} className="text-[#7CFF4F]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white leading-tight">16</div>
              <div className="text-[12px] text-[#AAB8AA] font-semibold mt-0.5">Visits Completed</div>
              <div className="text-[10px] text-[#7CFF4F] font-bold mt-0.5">Good progress!</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.02)] hover:border-[rgba(85,216,64,0.12)] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Store size={22} className="text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white leading-tight">12</div>
              <div className="text-[12px] text-[#AAB8AA] font-semibold mt-0.5">Retailers Added</div>
              <div className="text-[10px] text-[#7CFF4F] font-bold mt-0.5">+8 vs Yesterday</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.02)] hover:border-[rgba(85,216,64,0.12)] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <AlertTriangle size={22} className="text-[#EF4444]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white leading-tight">3</div>
              <div className="text-[12px] text-[#AAB8AA] font-semibold mt-0.5">Tasks Overdue</div>
              <div className="text-[10px] text-[#EF4444] font-bold mt-0.5">Needs Attention</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.02)] hover:border-[rgba(85,216,64,0.12)] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-[#7CFF4F]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <TrendingUp size={22} className="text-[#7CFF4F]" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-white leading-tight">₹5.2 Lakh</div>
              <div className="text-[12px] text-[#AAB8AA] font-semibold mt-0.5">Revenue Today</div>
              <div className="text-[10px] text-[#7CFF4F] font-bold mt-0.5">+12% vs Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
