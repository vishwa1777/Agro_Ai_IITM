import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  IndianRupee,
  BarChart3,
  ChevronRight,
  Info,
  Download,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import KPICard from '@/components/shared/KPICard';
import CardHeader from '@/components/shared/CardHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useDataStore } from '@/store';
import { stockHealthData, demandVsAvailabilityData, sparklineData } from '@/data/mockData';

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const ProductDemand: React.FC = () => {
  const { products, territories, insights } = useDataStore();

  const topProducts = products.slice(0, 6);
  const highDemandProducts = products.slice(0, 5);
  const priorityProducts = products.filter((p) => p.priorityScore >= 68).slice(0, 4);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] font-semibold text-white tracking-tight">
              Product Demand Tracking
            </h1>
            <Info size={18} className="text-[#AAB8AA] cursor-help" />
          </div>
          <p className="text-[14px] text-[#AAB8AA] mt-1">
            Track product demand, stock availability and AI-powered restocking priorities.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0F1D14] border border-[rgba(120,255,120,0.15)] text-[#55D840] px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[rgba(85,216,64,0.08)] transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <KPICard icon={Package} iconColor="#7CFF4F" iconBgColor="rgba(124,255,79,0.1)" label="Total Products" value="28" subtext="Active Products" subtextColor="#AAB8AA" />
        <KPICard icon={TrendingUp} iconColor="#7CFF4F" iconBgColor="rgba(124,255,79,0.1)" label="High Demand Products" value="6" subtext="This Week" subtextColor="#AAB8AA" />
        <KPICard icon={AlertTriangle} iconColor="#F59E0B" iconBgColor="rgba(245,158,11,0.1)" label="Low Stock Products" value="4" subtext="Need Attention" subtextColor="#F59E0B" />
        <KPICard icon={XCircle} iconColor="#EF4444" iconBgColor="rgba(239,68,68,0.1)" label="Out of Stock Products" value="2" subtext="Urgent Restock" subtextColor="#EF4444" />
        <KPICard icon={IndianRupee} iconColor="#7CFF4F" iconBgColor="rgba(124,255,79,0.1)" label="Potential Revenue" value="Rs.3.8 Lakh" subtext="From High Demand" subtextColor="#AAB8AA" />
        <KPICard icon={BarChart3} iconColor="#3B82F6" iconBgColor="rgba(59,130,246,0.1)" label="Avg. Demand Score" value="78" subtext="Overall" subtextColor="#AAB8AA" />
      </div>

      {/* Three Column: Demand Overview + Territory Stock + Stock Health */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Demand vs Availability Overview */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader
            title="Demand vs Availability Overview"
            rightElement={
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3B82F6]" /><span className="text-[10px] text-[#AAB8AA]">Demand</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#7CFF4F]" /><span className="text-[10px] text-[#AAB8AA]">Available</span></div>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Product</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Demand</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Available</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Gap</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Gap %</th>
                  <th className="text-center text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id} className="border-b border-[rgba(120,255,120,0.04)]">
                    <td className="py-2 px-1 text-[12px] font-medium text-white">{p.name}</td>
                    <td className="py-2 px-1 text-[12px] text-[#3B82F6] text-right">{p.demand.toLocaleString()}</td>
                    <td className="py-2 px-1 text-[12px] text-[#7CFF4F] text-right">{p.available.toLocaleString()}</td>
                    <td className="py-2 px-1 text-[12px] text-right" style={{ color: p.gap < 0 ? '#EF4444' : '#7CFF4F' }}>
                      {p.gap > 0 ? '+' : ''}{p.gap}
                    </td>
                    <td className="py-2 px-1 text-[12px] text-right" style={{ color: p.gapPercent < 0 ? '#EF4444' : '#7CFF4F' }}>
                      {p.gapPercent}%
                    </td>
                    <td className="py-2 px-1 text-center">
                      <StatusBadge variant={p.status}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[12px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View All Products <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Territory-wise Stock Gap */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Territory-wise Stock Gap" actionText="View Map" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(120,255,120,0.08)]">
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Territory</th>
                  <th className="text-left text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Top Product</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Demand</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Available</th>
                  <th className="text-right text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Gap</th>
                  <th className="text-center text-[11px] font-semibold text-[#AAB8AA] pb-2 px-1">Risk</th>
                </tr>
              </thead>
              <tbody>
                {territories.map((t, i) => (
                  <tr key={i} className="border-b border-[rgba(120,255,120,0.04)]">
                    <td className="py-2 px-1 text-[12px] font-medium text-white">{t.name}</td>
                    <td className="py-2 px-1 text-[12px] text-[#AAB8AA]">{t.topProduct}</td>
                    <td className="py-2 px-1 text-[12px] text-[#3B82F6] text-right">{t.demand.toLocaleString()}</td>
                    <td className="py-2 px-1 text-[12px] text-[#7CFF4F] text-right">{t.available.toLocaleString()}</td>
                    <td className="py-2 px-1 text-[12px] text-right" style={{ color: t.gap < 0 ? '#EF4444' : '#7CFF4F' }}>
                      {t.gap > 0 ? '+' : ''}{t.gap}
                    </td>
                    <td className="py-2 px-1 text-center">
                      <StatusBadge variant={t.risk}>{t.risk.charAt(0).toUpperCase() + t.risk.slice(1)}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[12px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View All Territories <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Stock Health Overview */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Stock Health Overview" />
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                    stroke="none"
                  >
                    {stockHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0F1D14',
                      border: '1px solid rgba(120,255,120,0.12)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-[16px] font-bold text-white">24,500</div>
                  <div className="text-[9px] text-[#AAB8AA]">Total Units</div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {stockHealthData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[12px] text-[#AAB8AA]">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-white">{item.value}%</div>
                    <div className="text-[10px] text-[#AAB8AA]">{item.units.toLocaleString()} Units</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(120,255,120,0.08)]">
            <button className="flex items-center gap-1 text-[12px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors">
              View Stock Details <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Three Column: High Demand + AI Restocking + Matrix */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* High Demand Products */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="High Demand Products (This Week)" actionText="View All" />
          <div className="space-y-3">
            {highDemandProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(85,216,64,0.1)] flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-[#55D840]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{p.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#AAB8AA]">Score: {p.demandScore}</span>
                    <span className="text-[11px] text-[#7CFF4F]">+{p.trend}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#7CFF4F"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[11px] font-medium text-[#7CFF4F] w-16 text-right">Rs.{p.potentialRevenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Restocking Priority */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="AI Restocking Priority" actionText="View All" />
          <p className="text-[11px] text-[#AAB8AA] mb-3">AI analyzes demand, stock gap & opportunity to give priority.</p>
          <div className="space-y-3">
            {priorityProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{
                    background: i === 0 ? '#EF4444' : i === 1 ? '#F59E0B' : i === 2 ? '#F59E0B' : '#7CFF4F',
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{p.name}</div>
                  <div className="text-[11px] text-[#AAB8AA]">
                    Gap: {Math.abs(p.gap)} Units | Potential Revenue: Rs.{p.potentialRevenue}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded"
                    style={{
                      background: p.priorityScore >= 80 ? 'rgba(239,68,68,0.15)' : p.priorityScore >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(124,255,79,0.15)',
                      color: p.priorityScore >= 80 ? '#EF4444' : p.priorityScore >= 60 ? '#F59E0B' : '#7CFF4F',
                    }}
                  >
                    {p.priorityScore}
                  </span>
                  {i < 2 && (
                    <button className="px-2.5 py-1 bg-[#55D840] text-[#07110B] text-[10px] font-semibold rounded-md hover:bg-[#7CFF4F] transition-colors">
                      Restock Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand vs Availability Matrix */}
        <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
          <CardHeader title="Demand vs Availability Matrix" rightElement={<Info size={14} className="text-[#AAB8AA]" />} />
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,255,120,0.06)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Demand"
                  domain={[0, 100]}
                  tick={{ fill: '#AAB8AA', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(120,255,120,0.1)' }}
                  label={{ value: 'Demand', position: 'bottom', fill: '#AAB8AA', fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Availability"
                  domain={[0, 100]}
                  tick={{ fill: '#AAB8AA', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(120,255,120,0.1)' }}
                  label={{ value: 'Availability', angle: -90, position: 'insideLeft', fill: '#AAB8AA', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0F1D14',
                    border: '1px solid rgba(120,255,120,0.12)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Scatter data={demandVsAvailabilityData} fill="#55D840">
                  {demandVsAvailabilityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.x > 70 && entry.y < 50 ? '#EF4444' : entry.x > 70 && entry.y > 70 ? '#7CFF4F' : entry.x < 50 && entry.y > 70 ? '#3B82F6' : '#F59E0B'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-[8px] text-[#3B82F6] bg-[rgba(59,130,246,0.1)] px-1.5 py-0.5 rounded">
              Overstock
            </div>
            <div className="absolute top-2 right-2 text-[8px] text-[#7CFF4F] bg-[rgba(124,255,79,0.1)] px-1.5 py-0.5 rounded">
              Opportunity
            </div>
            <div className="absolute bottom-8 left-2 text-[8px] text-[#F59E0B] bg-[rgba(245,158,11,0.1)] px-1.5 py-0.5 rounded">
              Low Priority
            </div>
            <div className="absolute bottom-8 right-2 text-[8px] text-[#EF4444] bg-[rgba(239,68,68,0.1)] px-1.5 py-0.5 rounded">
              Critical
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights & Recommendations */}
      <div className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 card-glow">
        <CardHeader title="AI Insights & Recommendations" />
        <div className="grid grid-cols-4 gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(120,255,120,0.04)]">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${insight.color}15` }}
              >
                {insight.icon === 'alert' && <AlertTriangle size={20} style={{ color: insight.color }} />}
                {insight.icon === 'trend' && <TrendingUp size={20} style={{ color: insight.color }} />}
                {insight.icon === 'package' && <Package size={20} style={{ color: insight.color }} />}
                {insight.icon === 'critical' && <XCircle size={20} style={{ color: insight.color }} />}
              </div>
              <p className="text-[12px] text-[#AAB8AA] leading-relaxed mb-3">{insight.title}</p>
              {insight.hasRevenue && (
                <div className="text-[11px] text-[#55D840] mb-2">Potential Revenue: Rs.{insight.revenue}</div>
              )}
              <button className="px-3 py-1.5 bg-[rgba(85,216,64,0.1)] text-[#55D840] text-[11px] font-semibold rounded-lg hover:bg-[rgba(85,216,64,0.2)] transition-colors">
                {insight.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDemand;
