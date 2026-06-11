import { useState, useRef, useEffect, useMemo } from "react";
import { Home, Calendar, Lightbulb, Search, Store, Users, BarChart2, Settings, IndianRupee, Bell, Wheat, CloudRain, Info, Check, Sun, AlertTriangle, Navigation, TrendingUp, ShieldAlert, User, Phone, MessageSquare, ExternalLink, Activity, Clipboard, MapPin, Target, CheckCircle, Construction, CheckSquare, CornerDownRight, Clock, Play, RefreshCw, Map, Banknote, Leaf, LogOut } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Area, AreaChart, PieChart, Pie, LineChart, Line } from "recharts";

// ─── API LAYER ────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("agroai_token");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
};

// ─── DATA HOOKS ───────────────────────────────────────────────────────────────
const useFetch = (path, defaultValue = null, deps = []) => {
  const [data, setData]       = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const refetch = () => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiFetch(path)
      .then(d  => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  };
  useEffect(refetch, [path, ...deps]); // eslint-disable-line
  return { data, loading, error, refetch };
};

// Normalise /analytics/visits → [{week, visits}]
const useVisitChartData = () => {
  const { data, loading } = useFetch("/analytics/visits", []);
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || !data.length) return [];
    return data.map(d => ({ week: d._id ?? d.status ?? "—", visits: d.count ?? 0 }));
  }, [data]);
  return { chartData, loading };
};

// Normalise /analytics/revenue → [{month, revenue (in lakhs)}]
const useRevenueChartData = () => {
  const { data, loading } = useFetch("/analytics/revenue", []);
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || !data.length) return [];
    return data.map(d => ({
      month: d.month ?? String(d.year ?? d._id ?? ""),
      revenue: d.amount != null ? +(d.amount / 100000).toFixed(2) : +(d.revenue ?? 0),
    }));
  }, [data]);
  return { chartData, loading };
};

// Normalise /analytics/crop-risk → [{crop, risk, level}]
const useCropRiskData = () => {
  const { data, loading } = useFetch("/analytics/crop-risk", []);
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || !data.length) return [];
    return data.map(d => ({
      crop:  d._id ?? d.crop ?? "Unknown",
      risk:  d.count ?? d.risk ?? 0,
      level: d._id === "High" || d.riskLevel === "High" ? "High"
           : d._id === "Medium" || d.riskLevel === "Medium" ? "Medium"
           : "Low",
    }));
  }, [data]);
  return { chartData, loading };
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const LEVEL_COLOR = { Critical:"#EF4444", Low:"#F97316", Medium:"#EAB308", Healthy:"#4ADE80", High:"#EF4444" };
const LEVEL_BG    = { Critical:"rgba(239,68,68,0.12)", Low:"rgba(249,115,22,0.12)", Medium:"rgba(234,179,8,0.12)", Healthy:"rgba(74,222,128,0.12)" };
const CROP_COLOR  = l => ({ High:"#EF4444", Medium:"#F97316", Low:"#84CC16" }[l] ?? "#84CC16");
const TYPE_COLOR  = { Visit:"#4ADE80", Stock:"#A855F7", Revenue:"#EAB308", Task:"#38BDF8" };

const ALERT_ACTION = {
  Critical: { text:"Restock within 2 days",  icon:<Store size={13}/> },
  Low:      { text:"Restock within 5 days",  icon:<Store size={13}/> },
  Medium:   { text:"Monitor stock",           icon:<Search size={13}/> },
  Healthy:  { text:"No action needed",        icon:<Check size={13}/> },
};

const NAV = [
  { key:"dashboard",        icon:<Home size={18}/>,       label:"Dashboard" },
  { key:"visitPlanner",     icon:<Calendar size={18}/>,   label:"Visit Planner",       sub:"AI-powered visit planning to maximize your impact" },
  { key:"aiRecommendations",icon:<Lightbulb size={18}/>,  label:"AI Recommendations",  sub:"Smart recommendations to help you take the right action." },
  { key:"riskAnalyzer",     icon:<Search size={18}/>,     label:"Risk Analyzer",       sub:"Monitor and mitigate agricultural risks" },
  { key:"retailerInsights", icon:<Store size={18}/>,      label:"Retailer Insights",   sub:"Detailed performance and insights of retail locations" },
  { key:"growerInsights",   icon:<Users size={18}/>,      label:"Grower Insights",     sub:"Track grower engagement and feedback" },
  { key:"analytics",        icon:<BarChart2 size={18}/>,  label:"Analytics",           sub:"Visualized analytics and data trends" },
  { key:"settings",         icon:<Settings size={18}/>,   label:"Settings",            sub:"Configure your app and region preferences" },
  { key:"visit",   icon:<Clipboard size={18}/>,   label:"Visit Performance", sub:"Track actual field visits against the target per day", hideInSidebar:true },
  { key:"revenue", icon:<IndianRupee size={18}/>, label:"Monthly Revenue",   sub:"Track revenue generated across months",               hideInSidebar:true },
  { key:"stock",   icon:<Bell size={18}/>,        label:"Stock Alerts",      sub:"Real-time stock status across top products",          hideInSidebar:true },
  { key:"crop",    icon:<Wheat size={18}/>,       label:"Crop Risk",         sub:"Risk Percentage by Crop",                            hideInSidebar:true },
  { key:"weather", icon:<CloudRain size={18}/>,   label:"Weather Alert",     sub:"Stay prepared for changing weather",                  hideInSidebar:true },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label, suffix="" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}>
      <div style={{ color:"#94A3B8", marginBottom:2 }}>{label}</div>
      <div style={{ color:"#4ADE80", fontWeight:700 }}>{payload[0].value}{suffix}</div>
    </div>
  );
};

const InfoBar = ({ text }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 16px", background:"rgba(74,222,128,0.05)", borderRadius:10, border:"1px solid rgba(74,222,128,0.1)" }}>
    <Info size={16}/><span style={{ fontSize:12, color:"#64748B", lineHeight:1.6 }}>{text}</span>
  </div>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"22px 24px", ...style }}>{children}</div>
);

const Spinner = ({ height=120 }) => (
  <div style={{ height, display:"flex", alignItems:"center", justifyContent:"center", color:"#475569", fontSize:12 }}>Loading…</div>
);

const ErrMsg = ({ msg }) => (
  <div style={{ padding:12, color:"#EF4444", fontSize:12, background:"rgba(239,68,68,0.06)", borderRadius:8, border:"1px solid rgba(239,68,68,0.15)" }}>
    ⚠ {msg}
  </div>
);

const FilterDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.06)", border:`1px solid ${open?"rgba(74,222,128,0.4)":"rgba(255,255,255,0.1)"}`, borderRadius:8, padding:"6px 12px", fontSize:12, color:"#CBD5E1", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
        <Calendar size={14}/> {value} <span style={{ fontSize:10, color:"#64748B" }}>▾</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:200, background:"#0F1F14", border:"1px solid rgba(74,222,128,0.2)", borderRadius:10, padding:6, minWidth:170, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
          {options.map(o => (
            <div key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ padding:"9px 14px", fontSize:12, borderRadius:7, cursor:"pointer", color:value===o?"#4ADE80":"#CBD5E1", background:value===o?"rgba(74,222,128,0.1)":"transparent", fontWeight:value===o?700:400 }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const PageHeader = ({ filterOptions, filter, onFilter }) => {
  if (!filterOptions) return null;
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
      <FilterDropdown options={filterOptions} value={filter} onChange={onFilter}/>
    </div>
  );
};

const KpiCard = ({ icon, iconBg, label, value, valueColor, sub, onClick }) => (
  <div onClick={onClick} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"18px 20px", cursor:onClick?"pointer":"default", transition:"border-color 0.2s, background 0.2s" }}
    onMouseEnter={e => { if(onClick){ e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; }}}
    onMouseLeave={e => { if(onClick){ e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}}
  >
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <div style={{ width:40, height:40, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
      <span style={{ fontSize:12, color:"#94A3B8" }}>{label}</span>
    </div>
    <div style={{ fontSize:28, fontWeight:800, color:valueColor, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:11, color:"#64748B", marginTop:5 }}>{sub}</div>
    {onClick && <div style={{ fontSize:10, color:"#4ADE80", marginTop:6 }}>View details →</div>}
  </div>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, onNav, criticalCount, user, onLogout }) => {
  const initials = (user?.name ?? "?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
  return (
    <aside style={{ width:240, flexShrink:0, background:"rgba(8,18,12,0.97)", borderRight:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", padding:"28px 16px", gap:4, height:"100vh", position:"sticky", top:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 8px 28px" }}>
        <div style={{ width:38, height:38, borderRadius:10, background:"rgba(74,222,128,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}><Leaf size={24}/></div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#4ADE80", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>AgroAI</div>
          <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>Field Intelligence</div>
        </div>
      </div>
      <div style={{ fontSize:9, color:"#334155", fontWeight:700, letterSpacing:2, padding:"0 10px 8px", textTransform:"uppercase" }}>Navigation</div>
      {NAV.filter(n => !n.hideInSidebar).map(n => (
        <button key={n.key} onClick={() => onNav(n.key)} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, border:"none", cursor:"pointer", background:active===n.key?"rgba(74,222,128,0.12)":"transparent", borderLeft:active===n.key?"3px solid #4ADE80":"3px solid transparent", color:active===n.key?"#4ADE80":"#64748B", fontSize:13, fontWeight:active===n.key?700:400, fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s", textAlign:"left" }}>
          <span style={{ fontSize:16, width:22, textAlign:"center" }}>{n.icon}</span>
          {n.label}
          {n.key==="stock" && criticalCount > 0 && <span style={{ marginLeft:"auto", fontSize:10, background:"rgba(239,68,68,0.2)", color:"#EF4444", borderRadius:5, padding:"2px 6px", fontWeight:700 }}>{criticalCount}</span>}
        </button>
      ))}
      <div style={{ marginTop:"auto", padding:"16px 10px 0", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(74,222,128,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#4ADE80" }}>{initials}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#CBD5E1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name ?? "User"}</div>
            <div style={{ fontSize:10, color:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.role ?? "Field Representative"}</div>
          </div>
          <button onClick={onLogout} title="Sign out" style={{ width:28, height:28, borderRadius:6, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", color:"#EF4444", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <LogOut size={13}/>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const TopBar = ({ page, dashboard, onLogout }) => {
  const { user } = useAuth();
  const item = NAV.find(n=>n.key===page)||NAV[0];
  const criticalStocks = dashboard?.criticalStocks ?? 0;
  const hasWeather = !!dashboard?.weather;
  return (
    <div style={{ height:72, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(8,18,12,0.85)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:"rgba(74,222,128,0.12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#4ADE80" }}>{item.icon}</div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1.2 }}>{item.label}</div>
          {item.sub && <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{item.sub}</div>}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {criticalStocks > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#F8FAFC" }}>
            <AlertTriangle size={14}/> {criticalStocks} Critical Stock{criticalStocks!==1?"s":""}
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#F8FAFC" }}>
          <Navigation size={14}/> {user?.region ?? "Jhansi Region"}
        </div>
        {hasWeather && (
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#4ADE80" }}>
            <CloudRain size={14}/> {dashboard.weather.description ?? "Weather Active"}
          </div>
        )}
        <button onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#EF4444", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          <LogOut size={13}/> Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── OVERVIEW PAGE ────────────────────────────────────────────────────────────
const Overview = ({ tasks, onToggleTask, onNav }) => {
  const { user } = useAuth();
  const firstName = (user?.name ?? "there").split(" ")[0];
  const today = new Date().toLocaleDateString("en-IN",{ weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const { data: dashboard, loading: dashLoading }    = useFetch("/dashboard", {});
  const { chartData: visitChartData, loading: vL }   = useVisitChartData();
  const { chartData: revenueChartData, loading: rL } = useRevenueChartData();
  const { chartData: cropChartData, loading: cL }    = useCropRiskData();

  const latestRev = revenueChartData.length ? revenueChartData[revenueChartData.length-1] : null;

  // Compute total visits and compare to target=2/day
  const totalVisits = visitChartData.reduce((s,d)=>s+d.visits, 0);
  const avgVisits   = visitChartData.length ? (totalVisits / visitChartData.length).toFixed(1) : "—";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Welcome */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif" }}>
            <span style={{ color:"#F8FAFC" }}>Good Morning, </span><span style={{ color:"#4ADE80" }}>{firstName}</span>
          </div>
          <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>{today}</div>
        </div>
        {dashboard?.weather && (
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:8 }}>
              <Sun size={14}/><span style={{ fontSize:13, fontWeight:600, color:"#F8FAFC" }}>{dashboard.weather.description ?? "Weather data"}</span>
            </div>
          </div>
        )}
      </div>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        <KpiCard icon={<Calendar size={22}/>}      iconBg="rgba(74,222,128,0.2)"  label="Avg. Visits/Day"  value={vL?"…":avgVisits}                              valueColor="#4ADE80" sub="vs Target: 2.0"   onClick={()=>onNav("visit")}/>
        <KpiCard icon={<IndianRupee size={22}/>}   iconBg="rgba(234,179,8,0.2)"   label="Latest Revenue"   value={rL?"…":latestRev?`₹${latestRev.revenue}L`:"—"} valueColor="#EAB308" sub={latestRev?.month ?? "Loading"} onClick={()=>onNav("revenue")}/>
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)"   label="Critical Stocks"  value={dashLoading?"…":String(dashboard?.criticalStocks??0)} valueColor="#EF4444" sub="Need restocking" onClick={()=>onNav("stock")}/>
        <KpiCard icon={<Wheat size={22}/>}         iconBg="rgba(249,115,22,0.2)"  label="High-Risk Crops"  value={dashLoading?"…":String(dashboard?.highRisk??0)} valueColor="#F97316" sub="High risk level" onClick={()=>onNav("crop")}/>
        <KpiCard icon={<CloudRain size={22}/>}     iconBg="rgba(56,189,248,0.2)"  label="Weather Alert"    value={dashLoading?"…":dashboard?.weather?"Active":"—"}  valueColor="#38BDF8" sub="Latest alert"    onClick={()=>onNav("weather")}/>
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Visit Status Breakdown</div>
            <button onClick={()=>onNav("visit")} style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>View All →</button>
          </div>
          {vL ? <Spinner height={190}/> : visitChartData.length === 0 ? <ErrMsg msg="No visit data available"/> : (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={visitChartData} barSize={50} margin={{ top:16, right:10, left:-18, bottom:0 }}>
                <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#16A34A"/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill:"#64748B", fontSize:9 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false}/>
                <Tooltip content={<ChartTip suffix=" visits"/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
                <Bar dataKey="visits" radius={[6,6,0,0]} fill="url(#gB)"/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Monthly Revenue</div>
            <button onClick={()=>onNav("revenue")} style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>View All →</button>
          </div>
          {rL ? <Spinner height={190}/> : revenueChartData.length === 0 ? <ErrMsg msg="No revenue data available"/> : (
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={revenueChartData} margin={{ top:16, right:16, left:-10, bottom:0 }}>
                <defs><linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#84CC16" stopOpacity={0.3}/><stop offset="90%" stopColor="#84CC16" stopOpacity={0.02}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v}L`}/>
                <Tooltip content={({ active,payload,label }) => { if(!active||!payload?.length) return null; return <div style={{ background:"#0F1F14", border:"1px solid rgba(132,204,22,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}><div style={{ color:"#94A3B8" }}>{label}</div><div style={{ color:"#84CC16", fontWeight:700 }}>₹{payload[0].value}L</div></div>; }}/>
                <Area type="monotone" dataKey="revenue" stroke="#84CC16" strokeWidth={2.5} fill="url(#rG)" dot={{ r:4, fill:"#84CC16" }} activeDot={{ r:6, fill:"#84CC16", stroke:"#0D1F12", strokeWidth:2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Tasks + Crop row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 0.7fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>
            <Clipboard size={14} style={{marginRight:8, verticalAlign:"middle"}}/>
            Today's Tasks <span style={{ fontSize:11, color:"#64748B", fontWeight:400 }}>({tasks.filter(t=>!t.done).length} remaining)</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {tasks.length === 0 ? (
              <div style={{ color:"#475569", fontSize:12, padding:"12px 0" }}>No tasks for today.</div>
            ) : tasks.map(task => {
              const typeColor = TYPE_COLOR[task.type] ?? "#4ADE80";
              return (
                <div key={task._id ?? task.id} onClick={()=>onToggleTask(task._id ?? task.id)} style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer", background:task.done?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.04)", border:`1px solid ${task.done?"rgba(255,255,255,0.05)":typeColor+"30"}`, borderRadius:10, padding:"10px 14px", opacity:task.done?0.5:1, transition:"opacity 0.2s" }}>
                  <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${typeColor}`, background:task.done?typeColor:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#0D1F12" }}>{task.done?<Check size={13}/>:null}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:task.done?"#64748B":"#CBD5E1", textDecoration:task.done?"line-through":"none", fontWeight:500 }}>{task.title ?? task.text}</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) : task.time ?? ""}
                    </div>
                  </div>
                  <span style={{ fontSize:10, background:`${typeColor}15`, color:typeColor, borderRadius:4, padding:"3px 8px", fontWeight:700 }}>{task.type ?? "Task"}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}><Wheat size={14} style={{marginRight:8, verticalAlign:"middle"}}/>Crop Risk</div>
            <button onClick={()=>onNav("crop")} style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>View All →</button>
          </div>
          {cL ? <Spinner height={80}/> : cropChartData.length === 0 ? <ErrMsg msg="No crop data"/> : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {cropChartData.map(d=>(
                <div key={d.crop} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:60, fontSize:11, color:"#CBD5E1", fontWeight:500, flexShrink:0 }}>{d.crop}</span>
                  <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.07)", borderRadius:3 }}>
                    <div style={{ width:`${Math.min(d.risk,100)}%`, height:"100%", background:CROP_COLOR(d.level), borderRadius:3, transition:"width 0.4s" }}/>
                  </div>
                  <span style={{ width:38, fontSize:12, fontWeight:700, color:CROP_COLOR(d.level), textAlign:"right" }}>{d.risk}</span>
                </div>
              ))}
              <div style={{ display:"flex", gap:14, marginTop:6, flexWrap:"wrap" }}>
                {[["#EF4444","High"],["#F97316","Medium"],["#84CC16","Low"]].map(([c,l])=>(
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#94A3B8" }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:c }}/>{l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── VISIT PAGE ───────────────────────────────────────────────────────────────
const VisitPage = () => {
  const [filter, setFilter] = useState("Last 4 Weeks");
  const { chartData, loading, error } = useVisitChartData();

  const total = chartData.reduce((s,d)=>s+d.visits,0);
  const avg   = chartData.length ? (total/chartData.length).toFixed(1) : 0;
  const TARGET = 2;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader filterOptions={["Last 4 Weeks","Last 8 Weeks","This Month","Last Month"]} filter={filter} onFilter={setFilter}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<Calendar size={22}/>}  iconBg="rgba(74,222,128,0.2)" label="Avg. Actual Visits"  value={loading?"…":avg}          valueColor="#4ADE80" sub="Visits/Day"/>
        <KpiCard icon={<Target size={22}/>}    iconBg="rgba(56,189,248,0.2)" label="Target Visits/Day"   value={TARGET}                   valueColor="#38BDF8" sub="Visits/Day"/>
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(249,115,22,0.2)" label="Avg. Achievement"   value={loading?"…":`${Math.round((avg/TARGET)*100)}%`} valueColor="#F97316" sub="of Target"/>
        <KpiCard icon={<BarChart2 size={22}/>} iconBg="rgba(168,85,247,0.2)" label="Total Actual Visits" value={loading?"…":total}        valueColor="#A855F7" sub="This Period"/>
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Visits by Status</div>
          <div style={{ display:"flex", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94A3B8" }}><div style={{ width:14, height:14, borderRadius:3, background:"linear-gradient(#4ADE80,#16A34A)" }}/> Count by Status</div>
          </div>
        </div>
        {loading ? <Spinner height={300}/> : error ? <ErrMsg msg={error}/> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barSize={80} margin={{ top:20, right:20, left:-10, bottom:0 }}>
              <defs><linearGradient id="gB2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#16A34A"/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="week" tick={{ fill:"#94A3B8", fontSize:12 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false}/>
              <Tooltip content={<ChartTip suffix=" visits"/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
              <ReferenceLine y={TARGET} stroke="#CBD5E1" strokeDasharray="6 3" strokeWidth={1.5} label={{ value:`Target: ${TARGET}`, position:"right", fill:"#F8FAFC", fontSize:11, dx:8 }}/>
              <Bar dataKey="visits" radius={[8,8,0,0]}>{chartData.map((d,i)=><Cell key={i} fill={d.visits>=TARGET?"url(#gB2)":"#EF4444"}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
      <InfoBar text="Visit counts grouped by status from the database. Green bars meet or exceed the daily target."/>
    </div>
  );
};

// ─── REVENUE PAGE ─────────────────────────────────────────────────────────────
const RevenuePage = () => {
  const [filter, setFilter] = useState("Last 6 Months");
  const { chartData, loading, error } = useRevenueChartData();

  const total   = chartData.reduce((s,d)=>s+d.revenue,0).toFixed(2);
  const avg     = chartData.length ? (total/chartData.length).toFixed(2) : 0;
  const highest = chartData.length ? chartData.reduce((m,d)=>d.revenue>m.revenue?d:m,chartData[0]) : null;
  const growth  = chartData.length > 1
    ? (((chartData[chartData.length-1].revenue - chartData[chartData.length-2].revenue) / chartData[chartData.length-2].revenue)*100).toFixed(1)
    : null;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader filterOptions={["Last 6 Months","Last 3 Months","This Year","Last Year"]} filter={filter} onFilter={setFilter}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<IndianRupee size={22}/>} iconBg="rgba(74,222,128,0.2)"  label="Total Revenue"     value={loading?"…":`₹${total}L`}                          valueColor="#4ADE80" sub="Loaded period"/>
        <KpiCard icon={<TrendingUp size={22}/>}  iconBg="rgba(56,189,248,0.2)"  label="Average / Month"   value={loading?"…":`₹${avg}L`}                             valueColor="#38BDF8" sub="Per Month"/>
        <KpiCard icon={<Activity size={22}/>}    iconBg="rgba(249,115,22,0.2)"  label="Highest Month"     value={loading?"…":highest?`₹${highest.revenue}L`:"—"}     valueColor="#F97316" sub={highest?.month ?? ""}/>
        <KpiCard icon={<BarChart2 size={22}/>}   iconBg="rgba(168,85,247,0.2)"  label="Latest Growth"     value={growth!=null?`${growth>0?"+":""}${growth}%`:"—"}    valueColor="#A855F7" sub="vs prev month"/>
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Revenue Trend (₹ Lakhs)</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#94A3B8" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#84CC16" }}/> Revenue (₹)
          </div>
        </div>
        {loading ? <Spinner height={300}/> : error ? <ErrMsg msg={error}/> : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top:20, right:20, left:-5, bottom:0 }}>
              <defs><linearGradient id="rG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#84CC16" stopOpacity={0.3}/><stop offset="90%" stopColor="#84CC16" stopOpacity={0.02}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:"#94A3B8", fontSize:12 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v}L`}/>
              <Tooltip content={({ active,payload,label }) => { if(!active||!payload?.length) return null; return <div style={{ background:"#0F1F14", border:"1px solid rgba(132,204,22,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}><div style={{ color:"#94A3B8" }}>{label}</div><div style={{ color:"#84CC16", fontWeight:700 }}>₹{payload[0].value}L</div></div>; }}/>
              <Area type="monotone" dataKey="revenue" stroke="#84CC16" strokeWidth={3} fill="url(#rG2)"
                dot={({ cx,cy,payload }) => <g key={payload.month}><circle cx={cx} cy={cy} r={5} fill="#84CC16"/><text x={cx} y={cy-12} textAnchor="middle" fill="#84CC16" fontSize={11} fontWeight={700}>₹{payload.revenue}L</text></g>}
                activeDot={{ r:7, fill:"#84CC16", stroke:"#0D1F12", strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div style={{ textAlign:"center", fontSize:10, color:"#64748B", marginTop:6 }}>Month</div>
      </Card>
      <InfoBar text="Revenue data is loaded directly from the database and reflects all approved product orders and services."/>
    </div>
  );
};

// ─── STOCK PAGE ───────────────────────────────────────────────────────────────
const StockPage = () => {
  const [filter, setFilter]       = useState("All Warehouses");
  const [levelFilter, setLevelFilter] = useState("All");
  const { data: rawProducts, loading, error } = useFetch("/products", []);

  const products = useMemo(() => {
    if (!Array.isArray(rawProducts)) return [];
    return rawProducts.map(p => {
      const stock    = p.stock ?? p.quantity ?? 0;
      const capacity = p.capacity ?? p.maxStock ?? 100;
      const pct      = Math.round((stock / capacity) * 100);
      const level    = pct <= 20 ? "Critical" : pct <= 40 ? "Low" : pct <= 70 ? "Medium" : "Healthy";
      return {
        ...p,
        _pct:   pct,
        _level: p.alertLevel ?? level,
        _stock: `${stock} ${p.unit ?? "units"}`,
        _pack:  p.packSize ?? p.pack ?? p.unit ?? "",
      };
    });
  }, [rawProducts]);

  const counts = useMemo(() => {
    const c = { Critical:0, Low:0, Medium:0, Healthy:0 };
    products.forEach(p => { if (c[p._level] !== undefined) c[p._level]++; });
    return c;
  }, [products]);

  const filtered = levelFilter==="All" ? products : products.filter(p=>p._level===levelFilter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader filterOptions={["All Warehouses","Jhansi Depot","Agra Depot","Kanpur Depot"]} filter={filter} onFilter={setFilter}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { label:"Critical (≤ 20%)", color:"#EF4444", bg:"rgba(239,68,68,0.1)",  icon:"⚠️", key:"Critical" },
          { label:"Low (21%–40%)",    color:"#F97316", bg:"rgba(249,115,22,0.1)", icon:"📉", key:"Low" },
          { label:"Medium (41%–70%)", color:"#EAB308", bg:"rgba(234,179,8,0.1)",  icon:"➖", key:"Medium" },
          { label:"Healthy (> 70%)",  color:"#4ADE80", bg:"rgba(74,222,128,0.1)", icon:"✅", key:"Healthy" },
        ].map(sc => (
          <div key={sc.key} onClick={()=>setLevelFilter(l=>l===sc.key?"All":sc.key)} style={{ background:levelFilter===sc.key?sc.bg:"rgba(255,255,255,0.03)", border:`1px solid ${levelFilter===sc.key?sc.color+"60":sc.color+"30"}`, borderRadius:14, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:`${sc.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{sc.icon}</div>
            <div>
              <div style={{ fontSize:11, color:sc.color, fontWeight:700, marginBottom:4 }}>{sc.label}</div>
              <div style={{ fontSize:26, fontWeight:800, color:"#F8FAFC", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{loading?"…":counts[sc.key]} <span style={{ fontSize:13, color:"#94A3B8", fontWeight:400 }}>Products</span></div>
              {levelFilter===sc.key && <div style={{ fontSize:10, color:sc.color, marginTop:4 }}>● Filtered</div>}
            </div>
          </div>
        ))}
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Product Stock Status {levelFilter!=="All" && <span style={{ fontSize:11, color:LEVEL_COLOR[levelFilter], background:LEVEL_BG[levelFilter], borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{levelFilter}</span>}</div>
          {levelFilter!=="All" && <button onClick={()=>setLevelFilter("All")} style={{ fontSize:11, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Clear Filter ✕</button>}
        </div>
        {loading ? <Spinner height={200}/> : error ? <ErrMsg msg={error}/> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.04)" }}>
                {["Product","Current Stock","Stock Level (%)","Alert Level","AI Recommendation"].map(h=>(
                  <th key={h} style={{ padding:"10px 16px", fontSize:10, color:"#64748B", fontWeight:700, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:"24px 16px", textAlign:"center", color:"#64748B", fontSize:13 }}>No products found.</td></tr>
              ) : filtered.map((p,i) => {
                const action = ALERT_ACTION[p._level] ?? ALERT_ACTION.Healthy;
                return (
                  <tr key={p._id ?? i} style={{ background:i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:LEVEL_COLOR[p._level] }}>{p.name}</div>
                      <div style={{ fontSize:10, color:"#475569" }}>{p._pack}</div>
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{p._stock}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:LEVEL_COLOR[p._level], marginBottom:5 }}>{p._pct}%</div>
                      <div style={{ height:5, width:100, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
                        <div style={{ width:`${p._pct}%`, height:"100%", background:LEVEL_COLOR[p._level], borderRadius:3 }}/>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:11, background:LEVEL_BG[p._level], color:LEVEL_COLOR[p._level], border:`1px solid ${LEVEL_COLOR[p._level]}40`, borderRadius:6, padding:"4px 10px", fontWeight:700, whiteSpace:"nowrap" }}>{p._level}</span>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:LEVEL_COLOR[p._level], fontWeight:600 }}>{action.icon} {action.text}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      <InfoBar text="Stock levels and alert status are loaded live from the database. Alert thresholds: Critical ≤20%, Low 21–40%, Medium 41–70%."/>
    </div>
  );
};

// ─── CROP PAGE ────────────────────────────────────────────────────────────────
const CropPage = () => {
  const [filter, setFilter] = useState("This Season");
  const { chartData, loading, error } = useCropRiskData();

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader filterOptions={["This Season","Last Season","Kharif 2024","Rabi 2024"]} filter={filter} onFilter={setFilter}/>
      <Card>
        <div style={{ fontSize:13, color:"#94A3B8", marginBottom:16 }}>Risk Count by Level</div>
        {loading ? <Spinner height={300}/> : error ? <ErrMsg msg={error}/> : chartData.length === 0 ? <ErrMsg msg="No crop risk data available"/> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barSize={70} margin={{ top:20, right:20, left:-18, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="crop" tick={{ fill:"#94A3B8", fontSize:13 }} tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }}/>
              <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false}/>
              <Tooltip content={<ChartTip suffix=" records"/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
              <Bar dataKey="risk" radius={[6,6,0,0]}>{chartData.map((d,i)=><Cell key={i} fill={CROP_COLOR(d.level)}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:14 }}>
          {[["#EF4444","High Risk"],["#F97316","Medium Risk"],["#84CC16","Low Risk"]].map(([c,l])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#94A3B8" }}>
              <div style={{ width:12, height:12, borderRadius:3, background:c }}/>{l}
            </div>
          ))}
        </div>
      </Card>
      <InfoBar text="Crop risk data is aggregated from the CropRisk collection, grouped by risk level."/>
    </div>
  );
};

// ─── WEATHER PAGE ─────────────────────────────────────────────────────────────
const WeatherPage = () => {
  const { data: dashboard, loading } = useFetch("/dashboard", {});
  const weather = dashboard?.weather;

  // Build a simple hourly forecast chart from the open-meteo data if available
  const forecastData = useMemo(() => {
    if (!weather?.hourly) return [];
    const times = weather.hourly.time ?? [];
    const pcp   = weather.hourly.precipitation_probability ?? [];
    return times.slice(0,9).map((t,i) => ({
      time: new Date(t).toLocaleTimeString("en-IN",{hour:"2-digit",hour12:true}),
      pct:  pcp[i] ?? 0,
    }));
  }, [weather]);

  const current = weather?.current_weather ?? {};

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {loading ? <Spinner height={300}/> : !weather ? (
        <ErrMsg msg="Weather data unavailable — no weather alert in database."/>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
          <Card style={{ background:"rgba(56,189,248,0.05)", border:"1px solid rgba(56,189,248,0.15)" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:10 }}>
              <CloudRain size={64}/>
              <div style={{ fontSize:54, fontWeight:800, color:"#4ADE80", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{current.temperature != null ? `${current.temperature}°C` : "—"}</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#F8FAFC" }}>{weather.description ?? "Weather Alert"}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#CBD5E1" }}><MapPin size={14}/> {weather.location ?? "Your Region"}</div>
              {weather.precipitation_probability != null && (
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
                  <CloudRain size={14}/><span style={{ color:"#CBD5E1" }}>Rain Probability:</span>
                  <span style={{ color:"#38BDF8", fontWeight:700, fontSize:16 }}>{weather.precipitation_probability}%</span>
                </div>
              )}
            </div>
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Card>
              <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Rain Forecast (Next 9 Hours)</div>
              {forecastData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={forecastData} margin={{ top:16, right:16, left:-16, bottom:0 }}>
                    <defs><linearGradient id="rnG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35}/><stop offset="90%" stopColor="#3B82F6" stopOpacity={0.02}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                    <XAxis dataKey="time" tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false}/>
                    <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"} domain={[0,100]}/>
                    <Tooltip content={<ChartTip suffix="% rain"/>}/>
                    <Area type="monotone" dataKey="pct" stroke="#3B82F6" strokeWidth={2.5} fill="url(#rnG)" activeDot={{ r:6, fill:"#3B82F6", stroke:"#0D1F12", strokeWidth:2 }}/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ color:"#475569", fontSize:12, padding:"20px 0" }}>No hourly forecast data available from weather API.</div>
              )}
            </Card>
            <div style={{ display:"flex", alignItems:"center", gap:16, background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:14, padding:"16px 20px" }}>
              <div style={{ width:46, height:46, background:"rgba(74,222,128,0.12)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>⚠️</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#4ADE80", marginBottom:4 }}>Suggested Action</div>
                <div style={{ fontSize:13, color:"#CBD5E1" }}>{weather.suggestion ?? "Check local forecast before scheduling field visits."}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── RETAILER INSIGHTS PAGE ───────────────────────────────────────────────────
const RetailerInsightsPage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { data: rawRetailers, loading, error } = useFetch("/retailers", []);

  const retailers = useMemo(() => {
    if (!Array.isArray(rawRetailers)) return [];
    return rawRetailers;
  }, [rawRetailers]);

  const stats = useMemo(() => {
    const lowStock    = retailers.filter(r=>["Critical","Low Stock"].includes(r.stockLevel ?? r.alertLevel)).length;
    const outstanding = retailers.reduce((s,r)=>s+(r.outstanding ?? r.outstandingBalance ?? 0),0);
    const totalSales  = retailers.reduce((s,r)=>s+(r.totalSales ?? r.sales ?? 0),0);
    return { count:retailers.length, lowStock, outstanding, totalSales };
  }, [retailers]);

  const filtered = useMemo(() => retailers.filter(r => {
    const name  = r.name?.toLowerCase() ?? "";
    const owner = (r.owner ?? r.ownerName ?? "").toLowerCase();
    const q     = search.toLowerCase();
    const matchesSearch = name.includes(q) || owner.includes(q);
    if (!matchesSearch) return false;
    if (filter==="Low Stock") return ["Critical","Low Stock"].includes(r.stockLevel ?? r.alertLevel);
    if (filter==="Outstanding") return (r.outstanding ?? r.outstandingBalance ?? 0) > 0;
    if (filter==="Active") return (r.status ?? "Active")==="Active";
    return true;
  }), [retailers, filter, search]);

  const getStockLevel = r => r.stockLevel ?? r.alertLevel ?? "Healthy";
  const getOutstanding = r => r.outstanding ?? r.outstandingBalance ?? 0;
  const getTotalSales  = r => r.totalSales ?? r.sales ?? 0;
  const getLastVisit   = r => r.lastVisit ?? r.lastVisitDate ?? "—";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<Store size={22}/>}        iconBg="rgba(74,222,128,0.2)" label="Total Retailers"    value={loading?"…":stats.count}                            valueColor="#4ADE80" sub="In database"/>
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)" label="Low Stock Alerts"   value={loading?"…":stats.lowStock}                         valueColor="#EF4444" sub="Need replenishment"/>
        <KpiCard icon={<IndianRupee size={22}/>}  iconBg="rgba(234,179,8,0.2)" label="Total Outstanding"   value={loading?"…":`₹${stats.outstanding.toLocaleString()}`} valueColor="#EAB308" sub="Pending payments"/>
        <KpiCard icon={<TrendingUp size={22}/>}   iconBg="rgba(56,189,248,0.2)" label="Sales Generated"    value={loading?"…":`₹${(stats.totalSales/100000).toFixed(1)}L`} valueColor="#38BDF8" sub="All retailers"/>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:10 }}>
          {["All","Low Stock","Outstanding","Active"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?"#16A34A":"rgba(255,255,255,0.05)", color:filter===f?"#FFF":"#CBD5E1", border:`1px solid ${filter===f?"#16A34A":"rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"6px 16px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>{f}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"6px 12px", width:260 }}>
          <Search size={16} color="#64748B"/>
          <input type="text" placeholder="Search retailer or owner…" value={search} onChange={e=>setSearch(e.target.value)} style={{ background:"transparent", border:"none", color:"#F8FAFC", fontSize:13, outline:"none", width:"100%", fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        {loading ? <Spinner height={200}/> : error ? <ErrMsg msg={error}/> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.04)" }}>
                {["Retailer","Location","Last Visit","Stock Level","Outstanding","Total Sales","Actions"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", fontSize:11, color:"#64748B", fontWeight:700, textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} style={{ padding:"30px 16px", textAlign:"center", color:"#64748B", fontSize:13 }}>No retailers found.</td></tr>
              ) : filtered.map((r,i) => {
                const sl  = getStockLevel(r);
                const out = getOutstanding(r);
                const slColor = sl==="Critical"?"#EF4444":sl==="Low Stock"?"#F97316":"#4ADE80";
                const slBg    = sl==="Critical"?"rgba(239,68,68,0.12)":sl==="Low Stock"?"rgba(249,115,22,0.12)":"rgba(74,222,128,0.12)";
                return (
                  <tr key={r._id ?? i} style={{ background:i%2===0?"rgba(255,255,255,0.01)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>{r.name}</div>
                      <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>Prop: {r.owner ?? r.ownerName ?? "—"}</div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:"#CBD5E1" }}>{r.location ?? r.address ?? "—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:"#CBD5E1" }}>{getLastVisit(r)}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:6, background:slBg, color:slColor, border:`1px solid ${slColor}30` }}>{sl}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:700, color:out>0?"#EAB308":"#4ADE80" }}>
                      {out>0 ? `₹${out.toLocaleString()}` : "Clear"}
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:700, color:"#F8FAFC" }}>₹{getTotalSales(r).toLocaleString()}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button title="Call" style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#CBD5E1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Phone size={13}/></button>
                        <button title="Message" style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#CBD5E1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><MessageSquare size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      <InfoBar text="Retailer data is loaded live from the database. Stock levels and outstanding balances reflect current records."/>
    </div>
  );
};

// ─── GROWER INSIGHTS PAGE ─────────────────────────────────────────────────────
const GrowerInsightsPage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { data: rawGrowers, loading, error } = useFetch("/growers", []);

  const growers = useMemo(() => Array.isArray(rawGrowers) ? rawGrowers : [], [rawGrowers]);

  const crops = useMemo(() => [...new Set(growers.map(g=>g.crop).filter(Boolean))], [growers]);

  const stats = useMemo(() => {
    const totalLand  = growers.reduce((s,g)=>s+parseFloat(g.land ?? g.landArea ?? 0),0);
    const highRisk   = growers.filter(g=>(g.risk ?? g.riskLevel ?? "").toLowerCase().includes("high")).length;
    const avgRisk    = growers.length ? Math.round(growers.reduce((s,g)=>s+(g.riskScore ?? 0),0)/growers.length) : 0;
    return { count:growers.length, totalLand, highRisk, avgRisk };
  }, [growers]);

  const filtered = useMemo(() => growers.filter(g => {
    const q = search.toLowerCase();
    const matchesSearch = (g.name ?? "").toLowerCase().includes(q) || (g.location ?? g.village ?? "").toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filter!=="All") return g.crop===filter;
    return true;
  }), [growers, filter, search]);

  const getRisk       = g => g.risk ?? g.riskLevel ?? "Low Risk";
  const getLastContact= g => g.lastContact ?? (g.lastVisit ? new Date(g.lastVisit).toLocaleDateString("en-IN") : "—");
  const getAdvisory   = g => g.advisory ?? g.activeAdvisory ?? "No active advisory.";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<Users size={22}/>}        iconBg="rgba(74,222,128,0.2)" label="Total Growers"       value={loading?"…":stats.count}                         valueColor="#4ADE80" sub="In database"/>
        <KpiCard icon={<Wheat size={22}/>}         iconBg="rgba(249,115,22,0.2)" label="Land Monitored"     value={loading?"…":`${stats.totalLand} Ac`}             valueColor="#F97316" sub="Total acreage"/>
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)" label="High Risk Crops"     value={loading?"…":stats.highRisk}                      valueColor="#EF4444" sub="Need advisories"/>
        <KpiCard icon={<Activity size={22}/>}     iconBg="rgba(56,189,248,0.2)" label="Avg Risk Score"     value={loading?"…":`${stats.avgRisk}%`}                  valueColor="#38BDF8" sub="Overall index"/>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {["All",...crops].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?"#16A34A":"rgba(255,255,255,0.05)", color:filter===f?"#FFF":"#CBD5E1", border:`1px solid ${filter===f?"#16A34A":"rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"6px 16px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>{f}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"6px 12px", width:260 }}>
          <Search size={16} color="#64748B"/>
          <input type="text" placeholder="Search grower or village…" value={search} onChange={e=>setSearch(e.target.value)} style={{ background:"transparent", border:"none", color:"#F8FAFC", fontSize:13, outline:"none", width:"100%", fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
      </div>

      {loading ? <Spinner height={200}/> : error ? <ErrMsg msg={error}/> : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {filtered.length===0 ? (
            <div style={{ gridColumn:"span 2", padding:"40px", textAlign:"center", color:"#64748B", fontSize:13 }}>No growers found.</div>
          ) : filtered.map(g => {
            const risk = getRisk(g);
            const riskColor = risk.toLowerCase().includes("high")?"#EF4444":risk.toLowerCase().includes("medium")?"#F97316":"#4ADE80";
            const riskBg    = risk.toLowerCase().includes("high")?"rgba(239,68,68,0.12)":risk.toLowerCase().includes("medium")?"rgba(249,115,22,0.12)":"rgba(74,222,128,0.12)";
            return (
              <Card key={g._id} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#F8FAFC" }}>{g.name}</div>
                    <div style={{ fontSize:12, color:"#64748B", marginTop:3, display:"flex", alignItems:"center", gap:4 }}><MapPin size={12}/> {g.location ?? g.village ?? "—"} | Land: {g.land ?? g.landArea ?? "—"}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:4, background:riskBg, color:riskColor, border:`1px solid ${riskColor}30` }}>{risk}</span>
                </div>
                <div style={{ display:"flex", gap:20, background:"rgba(255,255,255,0.02)", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ fontSize:10, color:"#64748B" }}>Crop</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#4ADE80", marginTop:3, display:"flex", alignItems:"center", gap:4 }}><Wheat size={14}/> {g.crop ?? "—"}</div>
                  </div>
                  <div style={{ borderLeft:"1px solid rgba(255,255,255,0.08)", paddingLeft:16 }}>
                    <div style={{ fontSize:10, color:"#64748B" }}>Stage</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#F8FAFC", marginTop:3 }}>{g.stage ?? g.cropStage ?? "—"}</div>
                  </div>
                  <div style={{ borderLeft:"1px solid rgba(255,255,255,0.08)", paddingLeft:16 }}>
                    <div style={{ fontSize:10, color:"#64748B" }}>Last Contact</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#CBD5E1", marginTop:3 }}>{getLastContact(g)}</div>
                  </div>
                </div>
                <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, color:"#4ADE80", fontWeight:700 }}>⚡ AI Active Advisory</div>
                  <div style={{ fontSize:12, color:"#CBD5E1", marginTop:4, lineHeight:1.5 }}>{getAdvisory(g)}</div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:10 }}>
                  <div style={{ fontSize:11, color:"#475569" }}>Contact: {g.phone ?? g.contact ?? "—"}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#CBD5E1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Phone size={13}/></button>
                    <button style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#CBD5E1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><MessageSquare size={13}/></button>
                    <button style={{ background:"rgba(74,222,128,0.1)", color:"#4ADE80", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"0 12px", fontSize:11, fontWeight:600, cursor:"pointer" }}>Details</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <InfoBar text="Grower list is loaded live from the database. Advisory states reflect the latest field recommendations."/>
    </div>
  );
};

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const [region, setRegion] = useState("All Regions");
  const { chartData: revenueData, loading: rL } = useRevenueChartData();
  const { chartData: visitData, loading: vL }   = useVisitChartData();
  const { data: rawProducts, loading: pL }      = useFetch("/products", []);
  const { data: rawRetailers }                  = useFetch("/retailers", []);

  const TARGET_MONTHLY = 200000;

  // Compute summary stats
  const totalRevenue = revenueData.reduce((s,d)=>s+(d.revenue*100000),0);
  const targetAch    = totalRevenue && revenueData.length
    ? ((totalRevenue / (TARGET_MONTHLY * revenueData.length))*100).toFixed(1) : "—";
  const totalVisits  = visitData.reduce((s,d)=>s+d.visits, 0);

  // Product sales distribution — use stock as proxy if no sales data
  const COLORS = ["#4ADE80","#A855F7","#EF4444","#EAB308","#64748B","#38BDF8","#F97316"];
  const productDist = useMemo(() => {
    if (!Array.isArray(rawProducts) || !rawProducts.length) return [];
    return rawProducts.slice(0,6).map((p,i) => ({
      name:  p.name,
      value: p.totalSales ?? p.sales ?? p.stock ?? p.quantity ?? 0,
      color: COLORS[i % COLORS.length],
    }));
  }, [rawProducts]);

  // Revenue vs target for each month
  const revVsTarget = useMemo(() => revenueData.map(d => ({
    month:  d.month,
    actual: Math.round(d.revenue * 100000),
    target: TARGET_MONTHLY,
  })), [revenueData]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:6 }}>
        <FilterDropdown options={["All Regions","Jhansi Territory","Patna Territory"]} value={region} onChange={setRegion}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<IndianRupee size={22}/>} iconBg="rgba(74,222,128,0.2)"  label="Total Revenue"       value={rL?"…":`₹${(totalRevenue/100000).toFixed(2)}L`} valueColor="#4ADE80" sub="All months loaded"/>
        <KpiCard icon={<TrendingUp size={22}/>}  iconBg="rgba(56,189,248,0.2)"  label="Target Achievement"  value={rL?"…":`${targetAch}%`}                          valueColor="#38BDF8" sub="vs monthly target"/>
        <KpiCard icon={<Users size={22}/>}       iconBg="rgba(168,85,247,0.2)"  label="Total Visits"        value={vL?"…":totalVisits}                               valueColor="#A855F7" sub="By status from DB"/>
        <KpiCard icon={<CheckCircle size={22}/>} iconBg="rgba(234,179,8,0.2)"   label="Total Retailers"     value={Array.isArray(rawRetailers)?rawRetailers.length:"…"} valueColor="#EAB308" sub="Active in DB"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 0.7fr", gap:16 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Revenue vs Target</div>
            <div style={{ display:"flex", gap:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#94A3B8" }}><div style={{ width:10, height:10, borderRadius:2, background:"#4ADE80" }}/> Actual</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#94A3B8" }}><div style={{ width:10, height:10, borderRadius:2, background:"rgba(255,255,255,0.2)" }}/> Target</div>
            </div>
          </div>
          {rL ? <Spinner height={260}/> : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revVsTarget} margin={{ top:10, right:10, left:-10, bottom:0 }}>
                <defs><linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/><stop offset="95%" stopColor="#4ADE80" stopOpacity={0.01}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false}/>
                <YAxis tickFormatter={v=>`₹${v/1000}k`} tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false}/>
                <Tooltip formatter={v=>`₹${v.toLocaleString()}`} contentStyle={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, fontSize:12 }}/>
                <Area type="monotone" dataKey="actual" stroke="#4ADE80" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)"/>
                <Area type="monotone" dataKey="target" stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" fill="none"/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Product Sales Share</div>
          {pL ? <Spinner height={140}/> : productDist.length===0 ? <ErrMsg msg="No product data"/> : (
            <>
              <div style={{ display:"flex", justifyContent:"center", position:"relative", height:140 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={productDist} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                      {productDist.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={v=>v.toLocaleString()}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#64748B" }}>Products</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>{productDist.length}</div>
                </div>
              </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
                  {productDist.map((item, index) => (
                    <div key={`${item._id ?? item.name ?? 'prod'}-${index}`} style={{ display:"flex", alignItems:"center", gap:10, fontSize:11 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:item.color }}/>
                      <span style={{ color:"#CBD5E1", flex:1 }}>{item.name}</span>
                      <span style={{ color:"#94A3B8", fontWeight:700 }}>{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
            </>
          )}
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Visit Status Distribution</div>
          {vL ? <Spinner height={180}/> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={visitData} barGap={4} margin={{ top:5, right:5, left:-25, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"#0F1F14", border:"1px solid rgba(56,189,248,0.3)", borderRadius:8, fontSize:11 }}/>
                <Bar dataKey="visits" fill="#38BDF8" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>⚡ Data Summary</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Revenue records in DB",  value: rL?"Loading…":`${revenueData.length} months`, color:"#4ADE80" },
              { label:"Visit statuses tracked",  value: vL?"Loading…":`${visitData.length} categories`, color:"#38BDF8" },
              { label:"Products monitored",       value: pL?"Loading…":Array.isArray(rawProducts)?`${rawProducts.length} items`:"—", color:"#A855F7" },
              { label:"Retailers registered",     value: Array.isArray(rawRetailers)?`${rawRetailers.length} retailers`:"Loading…", color:"#EAB308" },
            ].map((ins,idx)=>(
              <div key={idx} style={{ display:"flex", gap:10, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:8, padding:"10px 14px", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:"#CBD5E1" }}>{ins.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:ins.color }}>{ins.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── VISIT PLANNER PAGE ───────────────────────────────────────────────────────
const VisitPlannerPage = () => {
  const { data: rawRetailers, loading, error } = useFetch("/retailers", []);
  const retailers = useMemo(() => Array.isArray(rawRetailers) ? rawRetailers : [], [rawRetailers]);

  // Simple AI score: prioritise by lastVisit days ago and outstanding balance
  const scored = useMemo(() => retailers.map((r,i) => {
    const outstanding = r.outstanding ?? r.outstandingBalance ?? 0;
    const score = Math.max(40, Math.min(99, 60 + (outstanding / 500) + (i===0?10:0)));
    const sl = r.stockLevel ?? r.alertLevel ?? "Healthy";
    const stockRisk = sl==="Critical"?"Critical Stock":sl==="Low Stock"?"High Stock Risk":sl==="Low"?"Low Risk":"Low Risk";
    return { ...r, _score: +score.toFixed(1), _stockRisk: stockRisk };
  }).sort((a,b)=>b._score-a._score), [retailers]);

  const totalRevPotential = scored.reduce((s,r)=>s+(r.totalSales??r.sales??0)*0.1,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, display:"flex", alignItems:"center", gap:8 }}><MapPin size={14}/> All Regions ▾</div>
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, display:"flex", alignItems:"center", gap:8 }}><Calendar size={14}/> {new Date().toLocaleDateString("en-IN")} ▾</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr) auto", gap:14 }}>
        {[
          { icon:<Users size={24}/>, label:"Visits Planned",    value:loading?"…":`${scored.length}`, sub:"Today" },
          { icon:<IndianRupee size={24}/>, label:"Revenue Potential", value:loading?"…":`₹${Math.round(totalRevPotential).toLocaleString()}`, sub:"Estimated" },
          { icon:<CornerDownRight size={24}/>, label:"Retailers",  value:loading?"…":scored.length,  sub:"To visit" },
          { icon:<Clock size={24}/>, label:"Est. Time",           value:"~6h", sub:"On the road" },
        ].map((s,i)=>(
          <div key={i} style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:12, padding:16, display:"flex", alignItems:"center", gap:16 }}>
            {s.icon}
            <div><div style={{ fontSize:11, color:"#94A3B8" }}>{s.label}</div><div style={{ fontSize:22, fontWeight:800, color:"#F8FAFC" }}>{s.value} <span style={{fontSize:12, fontWeight:400, color:"#64748B"}}>{s.sub}</span></div></div>
          </div>
        ))}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button style={{ background:"#16A34A", color:"#fff", border:"none", borderRadius:8, padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}><Play size={16}/> Start Route</button>
          <button style={{ background:"rgba(255,255,255,0.05)", color:"#F8FAFC", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 24px", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}><RefreshCw size={16}/> Optimize</button>
        </div>
      </div>

      {loading ? <Spinner height={200}/> : error ? <ErrMsg msg={error}/> : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {scored.map((v,i) => (
            <Card key={v._id ?? i} style={{ padding:16, display:"flex", gap:16, alignItems:"center", background:i<2?"rgba(74,222,128,0.03)":"rgba(255,255,255,0.02)", borderColor:i<2?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.07)" }}>
              <div style={{ width:70, height:70, borderRadius:"50%", border:`4px solid ${v._score>90?"#4ADE80":v._score>70?"#EAB308":"#F97316"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", lineHeight:1 }}>{v._score}</span>
                <span style={{ fontSize:9, color:"#94A3B8" }}>AI Score</span>
              </div>
              <div style={{ flex:1.2 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ background:"#4ADE80", color:"#0F1F14", fontSize:10, fontWeight:800, padding:"2px 6px", borderRadius:4 }}>{i+1}</span>
                  <span style={{ fontSize:16, fontWeight:700, color:"#F8FAFC" }}>{v.name}</span>
                </div>
                <div style={{ fontSize:12, color:"#94A3B8", marginTop:4, display:"flex", alignItems:"center", gap:4 }}><MapPin size={12}/> {v.location ?? v.address ?? "—"}</div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:10 }}>
                  <div style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:v._stockRisk.includes("Critical")?"rgba(239,68,68,0.15)":"rgba(249,115,22,0.15)", color:v._stockRisk.includes("Critical")?"#EF4444":"#F97316", fontWeight:600 }}>{v._stockRisk}</div>
                </div>
              </div>
              <div style={{ flex:1, borderLeft:"1px solid rgba(255,255,255,0.1)", paddingLeft:16 }}>
                <div style={{ fontSize:11, color:"#94A3B8" }}>Outstanding</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#EAB308", marginTop:2 }}>₹{(v.outstanding ?? v.outstandingBalance ?? 0).toLocaleString()}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                <button style={{ background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:6, padding:"6px 12px", color:"#4ADE80", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}><Calendar size={14}/> Plan Visit</button>
                <div style={{ display:"flex", gap:6 }}>
                  {["📞","💬","↗️"].map(icon=><button key={icon} style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#F8FAFC", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>{icon}</button>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── AI RECOMMENDATIONS PAGE ──────────────────────────────────────────────────
const AiRecommendationsPage = () => {
  const { data: recs, loading, error } = useFetch("/recommendations", []);
  const recommendations = useMemo(() => Array.isArray(recs) ? recs : [], [recs]);

  const prioColor = p => p==="high"?"#EF4444":p==="medium"?"#F97316":"#4ADE80";
  const prioBg    = p => p==="high"?"rgba(239,68,68,0.1)":p==="medium"?"rgba(249,115,22,0.1)":"rgba(74,222,128,0.1)";
  const prioLabel = p => p==="high"?"High Priority":p==="medium"?"Medium Priority":"Low Priority";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {loading ? <Spinner height={200}/> : error ? <ErrMsg msg={error}/> : recommendations.length===0 ? (
        <Card><div style={{ textAlign:"center", color:"#475569", padding:"40px 0", fontSize:14 }}>No active recommendations at this time.</div></Card>
      ) : recommendations.map((rec, idx) => (
        <Card key={idx} style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
          <div style={{ flexShrink:0 }}>
            <span style={{ fontSize:11, fontWeight:700, color:prioColor(rec.priority), background:prioBg(rec.priority), padding:"4px 10px", borderRadius:6 }}>{prioLabel(rec.priority)}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", marginBottom:6 }}>{rec.message}</div>
            <div style={{ fontSize:12, color:"#94A3B8" }}>Type: <span style={{ color:"#CBD5E1" }}>{rec.type}</span></div>
          </div>
          <div style={{ display:"flex", gap:8, flexShrink:0 }}>
            <button style={{ background:"#16A34A", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}><Check size={13}/> Apply</button>
            <button style={{ background:"rgba(255,255,255,0.05)", color:"#F8FAFC", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", fontSize:12, cursor:"pointer" }}>Dismiss</button>
            <button style={{ background:"transparent", color:"#CBD5E1", border:"1px dashed rgba(255,255,255,0.2)", borderRadius:8, padding:"8px 16px", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}><ExternalLink size={13}/> Share</button>
          </div>
        </Card>
      ))}
      <InfoBar text="Recommendations are generated dynamically from live product stock levels and crop risk data in the database."/>
    </div>
  );
};

// ─── RISK ANALYZER PAGE ───────────────────────────────────────────────────────
const riskCategoryData = [
  { name:"Pest & Disease", pct:34, color:"#EF4444" },
  { name:"Weather",        pct:26, color:"#F97316" },
  { name:"Crop Health",   pct:17, color:"#EAB308" },
  { name:"Market",         pct:13, color:"#84CC16" },
  { name:"Supply Chain",  pct:10, color:"#3B82F6" },
];

const RiskAnalyzerPage = () => {
  const [filter, setFilter] = useState("Last 7 Days");
  const { chartData: cropData, loading: cL } = useCropRiskData();
  const { data: rawProducts }                = useFetch("/products", []);

  const riskOverview = useMemo(() => {
    const groups = { High:0, Medium:0, Low:0 };
    cropData.forEach(d => { if(groups[d.level]!==undefined) groups[d.level]+=d.risk; });
    const total = Object.values(groups).reduce((s,v)=>s+v,0)||1;
    return [
      { name:"High Risk",   value:Math.round((groups.High/total)*100),   color:"#EF4444" },
      { name:"Medium Risk", value:Math.round((groups.Medium/total)*100), color:"#F97316" },
      { name:"Low Risk",    value:Math.round((groups.Low/total)*100),    color:"#4ADE80" },
    ];
  }, [cropData]);

  const criticalProducts = useMemo(() => Array.isArray(rawProducts) ? rawProducts.filter(p=>(p.alertLevel??"")==="Critical") : [], [rawProducts]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader filterOptions={["Last 7 Days","Last 30 Days","This Season"]} filter={filter} onFilter={setFilter}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)"  label="Overall Risk Index"  value={cL?"…":cropData.some(d=>d.level==="High")?"High":"Medium"} valueColor="#EF4444" sub="From crop risk DB"/>
        <KpiCard icon={<Wheat size={22}/>}         iconBg="rgba(249,115,22,0.2)" label="High-Risk Entries"  value={cL?"…":cropData.filter(d=>d.level==="High").reduce((s,d)=>s+d.risk,0)} valueColor="#F97316" sub="Records in DB"/>
        <KpiCard icon={<Banknote size={22}/>}      iconBg="rgba(234,179,8,0.2)"  label="Critical Products"  value={Array.isArray(rawProducts)?criticalProducts.length:"…"}          valueColor="#EAB308" sub="Stock at critical"/>
        <KpiCard icon={<ShieldAlert size={22}/>}   iconBg="rgba(74,222,128,0.2)" label="Low Risk Entries"   value={cL?"…":cropData.filter(d=>d.level==="Low").reduce((s,d)=>s+d.risk,0)} valueColor="#4ADE80" sub="Well managed"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Crop Risk by Level (Live from DB)</div>
          {cL ? <Spinner height={250}/> : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cropData} margin={{ top:5, right:20, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="crop" tick={{ fill:"#94A3B8", fontSize:11 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false}/>
                <Tooltip content={<ChartTip suffix=" records"/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
                <Bar dataKey="risk" radius={[6,6,0,0]}>{cropData.map((d,i)=><Cell key={i} fill={CROP_COLOR(d.level)}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Risk Distribution</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskOverview} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {riskOverview.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
            {riskOverview.map(d=><div key={d.name} style={{fontSize:11, color:"#94A3B8"}}><span style={{color:d.color}}>●</span> {d.name} ({d.value}%)</div>)}
          </div>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Risk Categories</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {riskCategoryData.map(d=>(
              <div key={d.name}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                  <span style={{ color:"#CBD5E1" }}>{d.name}</span>
                  <span style={{ color:d.color, fontWeight:700 }}>{d.pct}%</span>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3 }}>
                  <div style={{ height:"100%", background:d.color, width:`${d.pct}%`, borderRadius:3 }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Critical Stock Alerts (Live)</div>
          {criticalProducts.length===0 ? (
            <div style={{ color:"#4ADE80", fontSize:13 }}>✓ No critical stock alerts at this time.</div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                  {["Product","Stock","Alert","Action"].map(h=>(
                    <th key={h} style={{ padding:"10px 14px", fontSize:11, color:"#64748B", fontWeight:600, textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criticalProducts.map((p,i)=>(
                  <tr key={p._id??i} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:"#F8FAFC" }}>{p.name}</td>
                    <td style={{ padding:"12px 14px", fontSize:12, color:"#CBD5E1" }}>{p.stock ?? p.quantity ?? "—"} {p.unit ?? ""}</td>
                    <td style={{ padding:"12px 14px" }}><span style={{ fontSize:11, background:"rgba(239,68,68,0.12)", color:"#EF4444", padding:"3px 8px", borderRadius:4, fontWeight:700 }}>Critical</span></td>
                    <td style={{ padding:"12px 14px", fontSize:12, color:"#EF4444", fontWeight:600 }}>Restock within 2 days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const Switch = ({ checked, onChange }) => (
  <div onClick={onChange} style={{ width:42, height:22, borderRadius:11, background:checked?"#16A34A":"rgba(255,255,255,0.08)", border:`1px solid ${checked?"#4ADE80":"rgba(255,255,255,0.12)"}`, position:"relative", cursor:"pointer", transition:"all 0.2s ease" }}>
    <div style={{ width:16, height:16, borderRadius:"50%", background:checked?"#FFF":"#64748B", position:"absolute", top:2, left:checked?22:2, transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 2px 4px rgba(0,0,0,0.3)" }}/>
  </div>
);

const SettingsPage = ({ user = {} }) => {
  const [activeTab, setActiveTab]     = useState("profile");
  const [depot, setDepot]             = useState("Jhansi Depot");
  const [stockAlerts, setStockAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts]   = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [phone, setPhone]             = useState(user.phone ?? "+91 94123 45678");
  const [vehicle, setVehicle]         = useState(user.vehicle ?? "UP-93-AB-4321");
  const [territory, setTerritory]     = useState(user.region ?? "Jhansi Cluster-C");
  const [syncing, setSyncing]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [lastSync, setLastSync]       = useState("10 June 2026, 04:30 AM");
  const [toast, setToast]             = useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3000); };
  const handleSync = () => { setSyncing(true); setTimeout(()=>{ setSyncing(false); setLastSync(new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})); showToast("Synchronization completed!"); },1500); };
  const handleSave = () => { setSaving(true); setTimeout(()=>{ setSaving(false); showToast("Changes saved successfully!"); },1000); };

  const FormInput = ({ label, value, onChange, readOnly }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
      <label style={{ fontSize:11, color:"#64748B", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
      <input type="text" value={value} onChange={onChange} readOnly={readOnly} style={{ background:readOnly?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.03)", border:`1px solid ${readOnly?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.08)"}`, borderRadius:8, padding:"10px 14px", color:readOnly?"#475569":"#CBD5E1", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.2s" }} onFocus={e=>{ if(!readOnly) e.target.style.borderColor="rgba(74,222,128,0.4)"; }} onBlur={e=>{ if(!readOnly) e.target.style.borderColor="rgba(255,255,255,0.08)"; }}/>
    </div>
  );

  return (
    <div style={{ display:"flex", gap:32, width:"100%", position:"relative" }}>
      {toast && <div style={{ position:"fixed", bottom:24, right:32, zIndex:1000, background:"#0F1F14", border:"1px solid #4ADE80", borderRadius:8, padding:"12px 24px", color:"#4ADE80", fontSize:13, fontWeight:700, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>✓ {toast}</div>}

      <div style={{ width:200, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        {[{id:"profile",label:"Representative Profile",icon:<User size={16}/>},{id:"preferences",label:"Field Preferences",icon:<Settings size={16}/>},{id:"sync",label:"Offline Sync",icon:<RefreshCw size={16}/>}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:10, border:"none", cursor:"pointer", textAlign:"left", background:activeTab===t.id?"rgba(74,222,128,0.12)":"transparent", color:activeTab===t.id?"#4ADE80":"#64748B", fontWeight:activeTab===t.id?700:500, fontSize:13, fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:20, maxWidth:640 }}>
        {activeTab==="profile" && (
          <>
            <Card style={{ display:"flex", alignItems:"center", gap:20, padding:20 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(74,222,128,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:"#4ADE80", fontWeight:700, border:"2px solid rgba(74,222,128,0.3)" }}>
                {(user.name ?? "?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:"#F8FAFC", fontFamily:"'Space Grotesk',sans-serif" }}>{user.name ?? "—"}</div>
                <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{user.role ?? "Field Representative"} • {user.region ?? "—"}</div>
                <span style={{ fontSize:9, background:"rgba(74,222,128,0.12)", color:"#4ADE80", padding:"2px 6px", borderRadius:4, fontWeight:700, display:"inline-block", marginTop:6 }}>ONLINE STATUS: ACTIVE</span>
              </div>
            </Card>
            <Card style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:10 }}>Personal Information</div>
              <div style={{ display:"flex", gap:16 }}><FormInput label="Full Name" value={user.name ?? ""} readOnly/><FormInput label="Email" value={user.email ?? ""} readOnly/></div>
              <div style={{ display:"flex", gap:16 }}><FormInput label="Role" value={user.role ?? ""} readOnly/><FormInput label="Region" value={user.region ?? ""} readOnly/></div>
              <div style={{ display:"flex", gap:16 }}><FormInput label="Contact Phone" value={phone} onChange={e=>setPhone(e.target.value)}/><FormInput label="Assigned Cluster" value={territory} onChange={e=>setTerritory(e.target.value)}/></div>
              <div style={{ display:"flex", gap:16 }}><FormInput label="Vehicle No." value={vehicle} onChange={e=>setVehicle(e.target.value)}/><div style={{flex:1}}/></div>
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:16, display:"flex", justifyContent:"flex-end" }}>
                <button onClick={handleSave} disabled={saving} style={{ background:"#16A34A", color:"#FFF", border:"none", borderRadius:8, padding:"10px 24px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{saving?"Saving…":"Save Changes"}</button>
              </div>
            </Card>
          </>
        )}

        {activeTab==="preferences" && (
          <>
            <Card style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:10 }}>Primary Depot Selection</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[{id:"Jhansi Depot",name:"Jhansi Depot",region:"UP Region-A",code:"JHS-01"},{id:"Agra Depot",name:"Agra Depot",region:"UP Region-B",code:"AGR-02"},{id:"Kanpur Depot",name:"Kanpur Depot",region:"UP Region-C",code:"KNP-03"}].map(d=>{
                  const isSel = depot===d.id;
                  return (
                    <div key={d.id} onClick={()=>setDepot(d.id)} style={{ background:isSel?"rgba(74,222,128,0.06)":"rgba(255,255,255,0.02)", border:`1px solid ${isSel?"#4ADE80":"rgba(255,255,255,0.07)"}`, borderRadius:12, padding:14, cursor:"pointer", transition:"all 0.2s" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:isSel?"#4ADE80":"#F8FAFC" }}>{d.name}</span>
                        {isSel && <span style={{ fontSize:9, background:"rgba(74,222,128,0.15)", color:"#4ADE80", padding:"2px 6px", borderRadius:4, fontWeight:800 }}>ACTIVE</span>}
                      </div>
                      <div style={{ fontSize:11, color:"#64748B" }}>{d.region}</div>
                      <div style={{ fontSize:10, color:"#475569", marginTop:6 }}>Code: {d.code}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:10 }}>Notification & Field Alerts</div>
              {[
                {label:"Critical Stock Alerts",    desc:"Notify when inventory drops below 20%",         state:stockAlerts,   setState:setStockAlerts},
                {label:"High Crop Risk Advisories", desc:"Notify when farm risk indexes increase to High", state:riskAlerts,    setState:setRiskAlerts},
                {label:"Weather Anomalies",          desc:"Notify if rain forecast probability is above 60%",state:weatherAlerts, setState:setWeatherAlerts},
              ].map(opt=>(
                <div key={opt.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:13, fontWeight:600, color:"#CBD5E1" }}>{opt.label}</div><div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{opt.desc}</div></div>
                  <Switch checked={opt.state} onChange={()=>opt.setState(s=>!s)}/>
                </div>
              ))}
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:16, display:"flex", justifyContent:"flex-end" }}>
                <button onClick={handleSave} disabled={saving} style={{ background:"#16A34A", color:"#FFF", border:"none", borderRadius:8, padding:"10px 24px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{saving?"Saving…":"Save Preferences"}</button>
              </div>
            </Card>
          </>
        )}

        {activeTab==="sync" && (
          <Card style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:10 }}>Offline Database Synchronization</div>
            {[
              ["Database Connection","ONLINE (FAST 4G)","#4ADE80"],
              ["Local Cache Size","4.82 MB","#CBD5E1"],
              ["Pending Offline Uploads","0 records","#CBD5E1"],
              ["Last Synchronization",lastSync,"#CBD5E1"],
            ].map(([k,v,c])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.03)", paddingBottom:10 }}>
                <span style={{ fontSize:13, color:"#94A3B8" }}>{k}</span>
                <span style={{ fontSize:13, color:c, fontWeight:700 }}>{v}</span>
              </div>
            ))}
            <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:12, color:"#4ADE80", fontWeight:700 }}>💡 Tip</div>
              <div style={{ fontSize:11, color:"#64748B", marginTop:4, lineHeight:1.5 }}>Syncing updates offline distributor maps and weather forecasts. Ensure stable internet before running.</div>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:16, display:"flex", justifyContent:"flex-end" }}>
              <button onClick={handleSync} disabled={syncing} style={{ background:syncing?"rgba(255,255,255,0.05)":"rgba(74,222,128,0.12)", color:syncing?"#64748B":"#4ADE80", border:`1px solid ${syncing?"rgba(255,255,255,0.1)":"rgba(74,222,128,0.25)"}`, borderRadius:8, padding:"12px 24px", fontSize:13, fontWeight:700, cursor:syncing?"default":"pointer" }}>
                {syncing?"Synchronizing…":"Force Full Synchronization"}
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const SkeletonLoader = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:24, width:"100%" }}>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
      {[1,2,3,4].map(i=><div key={i} className="shimmer-bg" style={{ height:120, borderRadius:14 }}/>)}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
      <div className="shimmer-bg" style={{ height:320, borderRadius:16 }}/>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div className="shimmer-bg" style={{ height:152, borderRadius:16 }}/>
        <div className="shimmer-bg" style={{ height:152, borderRadius:16 }}/>
      </div>
    </div>
  </div>
);

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [authView, setAuthView] = useState("login"); // "login" | "register"

  // Google Fonts loaded once
  const fonts = (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        .shimmer-bg { background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.03) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite linear; }
        * { box-sizing:border-box; }
        input, select { color-scheme: dark; }
        input:focus, select:focus { border-color: rgba(74,222,128,0.4) !important; }
      `}</style>
    </>
  );

  // While verifying existing token
  if (authLoading) {
    return (
      <div style={{ height:"100vh", background:"#0A1A0F", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
        {fonts}
        <div style={{ textAlign:"center" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid rgba(74,222,128,0.2)", borderTopColor:"#4ADE80", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
          <div style={{ color:"#475569", fontSize:13 }}>Verifying session…</div>
        </div>
      </div>
    );
  }

  // Not logged in — show login or register
  if (!user) {
    return (
      <>
        {fonts}
        {authView === "login"
          ? <LoginPage    onSwitchToRegister={()=>setAuthView("register")}/>
          : <RegisterPage onSwitchToLogin={()=>setAuthView("login")}/>
        }
      </>
    );
  }

  // ── Logged in ─────────────────────────────────────────────────────────────
  return <Dashboard user={user} onLogout={logout} fonts={fonts}/>;
}

// ─── DASHBOARD (authenticated shell) ─────────────────────────────────────────
function Dashboard({ user, onLogout, fonts }) {
  const [page, setPage]               = useState("dashboard");
  const [pageLoading, setPageLoading] = useState(false);
  const { data: dashboard }           = useFetch("/dashboard", {});

  const { data: rawTasks }    = useFetch("/tasks", []);
  const [doneIds, setDoneIds] = useState(new Set());
  const tasks = useMemo(() => {
    if (!Array.isArray(rawTasks)) return [];
    return rawTasks.map(t => ({ ...t, done: doneIds.has(t._id ?? t.id) }));
  }, [rawTasks, doneIds]);

  const toggleTask = id => setDoneIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(()=>setPageLoading(false), 400);
    return ()=>clearTimeout(t);
  }, [page]);

  const criticalCount = dashboard?.criticalStocks ?? 0;

  const PAGES = {
    dashboard:         <Overview tasks={tasks} onToggleTask={toggleTask} onNav={setPage}/>,
    visitPlanner:      <VisitPlannerPage/>,
    aiRecommendations: <AiRecommendationsPage/>,
    riskAnalyzer:      <RiskAnalyzerPage/>,
    retailerInsights:  <RetailerInsightsPage/>,
    growerInsights:    <GrowerInsightsPage/>,
    analytics:         <AnalyticsPage/>,
    settings:          <SettingsPage user={user}/>,
    visit:             <VisitPage/>,
    revenue:           <RevenuePage/>,
    stock:             <StockPage/>,
    crop:              <CropPage/>,
    weather:           <WeatherPage/>,
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:"linear-gradient(160deg,#0A1A0F 0%,#0D1F12 50%,#080F10 100%)", fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      {fonts}
      <Sidebar active={page} onNav={setPage} criticalCount={criticalCount} user={user} onLogout={onLogout}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <TopBar page={page} dashboard={dashboard} onLogout={onLogout}/>
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
          {pageLoading ? <SkeletonLoader/> : PAGES[page]}
        </main>
      </div>
    </div>
  );
}