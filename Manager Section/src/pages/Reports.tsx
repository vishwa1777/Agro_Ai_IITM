import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Folder,
  Database,
  History,
  ChevronRight,
  Eye,
  Download,
  Info,
} from 'lucide-react';
import CardHeader from '@/components/shared/CardHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useDataStore } from '@/store';

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const reportTabs = ['All', 'Daily', 'Weekly', 'Monthly', 'Territory', 'Custom'];
const documentTabs = ['All', 'Visit Reports', 'Retailer Documents', 'Product PDFs', 'Training Material', 'Others'];
const historyTabs = ['All', 'Visit History', 'Recommendation History', 'Stock History', 'Demand History', 'Others'];

const Reports: React.FC = () => {
  const { reports, documents, dataExports, historyRecords } = useDataStore();
  const [activeReportTab, setActiveReportTab] = useState('All');
  const [activeDocTab, setActiveDocTab] = useState('All');
  const [activeHistoryTab, setActiveHistoryTab] = useState('All');

  const filteredReports = activeReportTab === 'All' ? reports : reports.filter((r) => r.category === activeReportTab);
  const filteredDocs = activeDocTab === 'All' ? documents : documents.filter((d) => d.category === activeDocTab);
  const filteredHistory = activeHistoryTab === 'All' ? historyRecords : historyRecords.filter((h) => h.type === activeHistoryTab || (activeHistoryTab === 'Others' && !['Visit History', 'Recommendation', 'Stock History', 'Demand History'].includes(h.type)));

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] font-semibold text-white tracking-tight">
              Reports, Documents, Data & History
            </h1>
            <Info size={18} className="text-[#AAB8AA] cursor-help" />
          </div>
          <p className="text-[14px] text-[#AAB8AA] mt-1">
            Access, download and analyze all your reports, documents, data and historical records.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] text-[#55D840] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[rgba(85,216,64,0.08)] transition-colors">
          <Download size={16} />
          Export All
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: FileText, color: '#7CFF4F', bg: 'rgba(124,255,79,0.1)', label: 'Reports', value: '132', subtext: 'Total Reports' },
          { icon: Folder, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'Documents', value: '86', subtext: 'Total Documents' },
          { icon: Database, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: 'Data Exports', value: '64', subtext: 'Total Exports' },
          { icon: History, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'History Records', value: '248', subtext: 'Total Records' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow hover:card-glow-hover transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: stat.bg }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <button className="flex items-center gap-1 text-[12px] text-[#55D840] hover:text-[#7CFF4F] transition-colors">
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="text-[28px] font-bold text-white">{stat.value}</div>
            <div className="text-[12px] text-[#AAB8AA] mt-0.5">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Two Column: Reports + Documents */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Reports Table */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Reports" actionText="View All Reports" />
          {/* Filter Tabs */}
          <div className="flex gap-1 p-1 bg-[rgba(255,255,255,0.04)] rounded-lg mb-4">
            {reportTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveReportTab(tab)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  activeReportTab === tab
                    ? 'bg-[#0F1D14] text-white border border-[rgba(120,255,120,0.08)]'
                    : 'text-[#AAB8AA] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Report Name</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Type</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Period</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Generated On</th>
                  <th className="text-center text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => (
                  <tr key={r.id} className="border-b border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.03)] transition-colors">
                    <td className="py-2.5 px-2 text-[12px] font-medium text-white">{r.name}</td>
                    <td className="py-2.5 px-2">
                      <StatusBadge variant={r.type === 'Daily' ? 'scheduled' : r.type === 'Weekly' ? 'good' : 'upcoming'}>{r.type}</StatusBadge>
                    </td>
                    <td className="py-2.5 px-2 text-[12px] text-[#AAB8AA]">{r.period}</td>
                    <td className="py-2.5 px-2 text-[12px] text-[#AAB8AA]">{r.generatedOn}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
                          <Eye size={14} className="text-[#AAB8AA]" />
                        </button>
                        <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
                          <Download size={14} className="text-[#AAB8AA]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Documents" actionText="View All Documents" />
          {/* Filter Tabs */}
          <div className="flex gap-1 p-1 bg-[rgba(255,255,255,0.04)] rounded-lg mb-4 overflow-x-auto scrollbar-custom">
            {documentTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDocTab(tab)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
                  activeDocTab === tab
                    ? 'bg-[#0F1D14] text-white border border-[rgba(120,255,120,0.08)]'
                    : 'text-[#AAB8AA] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Document Name</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Category</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Uploaded On</th>
                  <th className="text-center text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((d) => (
                  <tr key={d.id} className="border-b border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.03)] transition-colors">
                    <td className="py-2.5 px-2 text-[12px] font-medium text-white">{d.name}</td>
                    <td className="py-2.5 px-2">
                      <StatusBadge variant="good">{d.category}</StatusBadge>
                    </td>
                    <td className="py-2.5 px-2 text-[12px] text-[#AAB8AA]">{d.uploadedOn}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
                          <Eye size={14} className="text-[#AAB8AA]" />
                        </button>
                        <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors">
                          <Download size={14} className="text-[#AAB8AA]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two Column: Data Exports + History */}
      <div className="grid grid-cols-2 gap-4">
        {/* Data Exports Table */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Data Exports" actionText="View All Exports" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Export Name</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Data Type</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Period</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Generated On</th>
                  <th className="text-center text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataExports.map((e) => (
                  <tr key={e.id} className="border-b border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.03)] transition-colors">
                    <td className="py-2.5 px-2 text-[12px] font-medium text-white">{e.name}</td>
                    <td className="py-2.5 px-2">
                      <StatusBadge variant="scheduled">{e.dataType}</StatusBadge>
                    </td>
                    <td className="py-2.5 px-2 text-[12px] text-[#AAB8AA]">{e.period}</td>
                    <td className="py-2.5 px-2 text-[12px] text-[#AAB8AA]">{e.generatedOn}</td>
                    <td className="py-2.5 px-2">
                      <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors mx-auto">
                        <Download size={14} className="text-[#AAB8AA]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Records Table */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="History Records" actionText="View All History" />
          {/* Filter Tabs */}
          <div className="flex gap-1 p-1 bg-[rgba(255,255,255,0.04)] rounded-lg mb-4 overflow-x-auto scrollbar-custom">
            {historyTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveHistoryTab(tab)}
                className={`px-2 py-1.5 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
                  activeHistoryTab === tab
                    ? 'bg-[#0F1D14] text-white border border-[rgba(120,255,120,0.08)]'
                    : 'text-[#AAB8AA] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Record</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Type</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Date & Time</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Details</th>
                  <th className="text-center text-[11px] font-semibold text-[#AAB8AA] pb-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((h) => (
                  <tr key={h.id} className="border-b border-[rgba(120,255,120,0.04)] hover:bg-[rgba(85,216,64,0.03)] transition-colors">
                    <td className="py-2.5 px-2 text-[12px] font-medium text-white">{h.record}</td>
                    <td className="py-2.5 px-2">
                      <StatusBadge
                        variant={
                          h.type === 'Visit History'
                            ? 'scheduled'
                            : h.type === 'Recommendation'
                            ? 'upcoming'
                            : h.type === 'Stock History'
                            ? 'good'
                            : h.type === 'Demand History'
                            ? 'medium'
                            : 'idle'
                        }
                      >
                        {h.type}
                      </StatusBadge>
                    </td>
                    <td className="py-2.5 px-2 text-[12px] text-[#AAB8AA]">{h.dateTime}</td>
                    <td className="py-2.5 px-2">
                      {h.priority ? (
                        <span className="text-[11px] text-[#EF4444]">{h.details}</span>
                      ) : (
                        <span className="text-[12px] text-[#AAB8AA]">{h.details}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2">
                      <button className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.04)] flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors mx-auto">
                        <Eye size={14} className="text-[#AAB8AA]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
