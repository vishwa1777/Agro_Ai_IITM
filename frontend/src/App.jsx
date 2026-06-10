import { useState, useRef, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useUIStore } from "./store";
import ManagerApp from "./components/manager/ManagerApp";
import LoginPage from "./components/auth/LoginPage";
import { Home, Calendar, Lightbulb, Search, Store, Users, BarChart2, Settings, IndianRupee, Bell, Wheat, CloudRain, Info, ChevronDown, Check, X, Sun, AlertTriangle, Navigation, TrendingUp, ShieldAlert, Bug, FlaskConical, User, Phone, MessageSquare, ExternalLink, Activity, Clipboard, MapPin, Target, TrendingDown, Minus, CheckCircle, Construction, CheckSquare, CornerDownRight, Clock, Play, RefreshCw, Map, Banknote, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Area, AreaChart, PieChart, Pie, LineChart, Line } from "recharts";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const visitData = [
  { week:"W1 Oct 12–18", visits:2.0 }, { week:"W2 Nov 19–25", visits:1.0 },
  { week:"W3 Dec 26–Jan 1", visits:3.0 }, { week:"W4 Feb 2–8", visits:2.0 },
];
const revenueData = [
  { month:"Oct", revenue:0.80 }, { month:"Nov", revenue:1.20 }, { month:"Dec", revenue:1.50 },
  { month:"Jan", revenue:1.80 }, { month:"Feb", revenue:3.00 }, { month:"Mar", revenue:2.50 },
];
const stockData = [
  { name:"Actara 25 WG", pack:"100g Pack",    stock:"20 Packs",   pct:18, level:"Critical", demand:["Pest outbreak in nearby villages","High grower demand"],   supply:["Delayed distributor supply","Low warehouse stock"],  action:"Restock within 2 days", actionIcon:<Store size={14}/> },
  { name:"Score 250 EC", pack:"250ml Bottle", stock:"15 Bottles", pct:15, level:"Critical", demand:["Increase in Mustard area","Seasonal disease rise"],           supply:["Supplier dispatch delay","High recent sales"],       action:"Restock within 2 days", actionIcon:<Store size={14}/> },
  { name:"Kavach 75 WP", pack:"250g Pack",    stock:"45 Packs",   pct:45, level:"Low",      demand:["Potato blight risk","Preventive applications"],           supply:["High recent sales","Replenishment in transit"],      action:"Restock within 5 days", actionIcon:<Store size={14}/> },
  { name:"Topik 15 WP",  pack:"500g Pack",    stock:"65 Packs",   pct:65, level:"Medium",   demand:["Weed pressure in wheat","Moderate demand"],                 supply:["Stock moving normal","Some pending orders"],         action:"Monitor stock",         actionIcon:<Search size={14}/> },
  { name:"Movondo",       pack:"250ml Bottle", stock:"90 Bottles", pct:90, level:"Healthy",  demand:["Steady demand","Regular usage"],                            supply:["Stock well available","No supply issues"],           action:"No action needed",      actionIcon:<Check size={14}/> },
];
const cropData = [
  { crop:"Wheat", risk:75, level:"High" }, { crop:"Mustard",  risk:45, level:"Medium" },
  { crop:"Pea",   risk:20, level:"Low" },  { crop:"Chickpea", risk:60, level:"High" }, { crop:"Potato", risk:30, level:"Low" },
];
const weatherData = [
  { time:"6AM",pct:20 },{ time:"9AM",pct:40 },{ time:"12PM",pct:80 },{ time:"3PM",pct:90 },
  { time:"6PM",pct:70 },{ time:"9PM",pct:50 },{ time:"12AM",pct:30 },{ time:"3AM",pct:20 },{ time:"6AM+",pct:10 },
];
const todayTasks = [
  { id:1, type:"Visit",   text:"Ramesh Kumar — Wheat crop inspection (Topik 15 WP)",    time:"9:00 AM"  },
  { id:2, type:"Visit",   text:"Suresh Patel — Mustard disease treatment (Score 250 EC)", time:"11:00 AM" },
  { id:3, type:"Stock",   text:"Restock Kavach 75 WP at Jhansi depot",    time:"1:00 PM"  },
  { id:4, type:"Visit",   text:"Mahesh Singh — Chickpea pest follow-up (Actara 25 WG)", time:"3:00 PM"  },
  { id:5, type:"Revenue", text:"Follow up on ₹18K pending retailer order",         time:"4:30 PM"  },
];

const retailerData = [
  { id: 1, name: "Ganga Agri Kendra", owner: "Rajesh Gupta", phone: "+91 98765 43210", location: "Patna Tahsil, Patna", status: "Active", stockLevel: "Low Stock", outstanding: 12500, totalSales: 185000, lastVisit: "3 days ago" },
  { id: 2, name: "Kisan Seed Store", owner: "Suresh Patel", phone: "+91 98765 43211", location: "Jhansi Bypass, Jhansi", status: "Low Stock", stockLevel: "Critical", outstanding: 8000, totalSales: 152000, lastVisit: "7 days ago" },
  { id: 3, name: "Mahavir Fertilizers", owner: "Mahendra Singh", phone: "+91 98765 43212", location: "Mauranipur, Jhansi", status: "Active", stockLevel: "Healthy", outstanding: 0, totalSales: 98000, lastVisit: "12 days ago" },
  { id: 4, name: "Ram Krishi Bhandar", owner: "Ram Kumar", phone: "+91 98765 43213", location: "Babina, Jhansi", status: "Inactive", stockLevel: "Healthy", outstanding: 4500, totalSales: 75000, lastVisit: "28 days ago" },
  { id: 5, name: "Balaji Seeds & Chemicals", owner: "Vijay Sharma", phone: "+91 98765 43214", location: "Gursarai, Jhansi", status: "Active", stockLevel: "Low Stock", outstanding: 15000, totalSales: 210000, lastVisit: "Yesterday" }
];

const growerData = [
  { id: 1, name: "Ramesh Kumar", land: "12 Acres", crop: "Wheat", stage: "Tillering", risk: "High Risk", phone: "+91 94123 45678", location: "Karguwan Village", lastContact: "Today", advisory: "Apply Topik 15 WP for weed control" },
  { id: 2, name: "Suresh Patel", land: "8 Acres", crop: "Mustard", stage: "Flowering", risk: "Medium Risk", phone: "+91 94123 45679", location: "Sajnam Village", lastContact: "3 days ago", advisory: "Apply Score 250 EC for alternaria blight" },
  { id: 3, name: "Mahesh Singh", land: "15 Acres", crop: "Chickpea", stage: "Nursery", risk: "Low Risk", phone: "+91 94123 45680", location: "Simra Village", lastContact: "5 days ago", advisory: "Apply Actara 25 WG for pod borer" },
  { id: 4, name: "Dinesh Yadav", land: "5 Acres", crop: "Potato", stage: "Vegetative", risk: "Low Risk", phone: "+91 94123 45681", location: "Bijoli Village", lastContact: "10 days ago", advisory: "Apply Kavach 75 WP for late blight" },
  { id: 5, name: "Harish Chandra", land: "20 Acres", crop: "Wheat", stage: "Harvested", risk: "Low Risk", phone: "+91 94123 45682", location: "Pura Village", lastContact: "Yesterday", advisory: "Soil preparation advice for next season" }
];

const LEVEL_COLOR = { Critical:"#EF4444", Low:"#F97316", Medium:"#EAB308", Healthy:"#4ADE80", High:"#EF4444" };
const LEVEL_BG    = { Critical:"rgba(239,68,68,0.12)", Low:"rgba(249,115,22,0.12)", Medium:"rgba(234,179,8,0.12)", Healthy:"rgba(74,222,128,0.12)" };
const CROP_COLOR  = l => ({ High:"#EF4444", Medium:"#F97316", Low:"#84CC16" }[l]);
const TYPE_COLOR  = { Visit:"#4ADE80", Stock:"#A855F7", Revenue:"#EAB308" };

const NAV = [
  { key:"dashboard", icon:<Home size={18}/>, label:"Dashboard" },
  { key:"visitPlanner", icon:<Calendar size={18}/>, label:"Visit Planner", sub:"AI-powered visit planning to maximize your impact" },
  { key:"aiRecommendations", icon:<Lightbulb size={18}/>, label:"AI Recommendations", sub:"Smart recommendations to help you take the right action." },
  { key:"riskAnalyzer", icon:<Search size={18}/>, label:"Risk Analyzer", sub:"Monitor and mitigate agricultural risks" },
  { key:"retailerInsights", icon:<Store size={18}/>, label:"Retailer Insights", sub:"Detailed performance and insights of retail locations" },
  { key:"growerInsights", icon:<Users size={18}/>, label:"Grower Insights", sub:"Track grower engagement and feedback" },
  { key:"analytics", icon:<BarChart2 size={18}/>, label:"Analytics", sub:"Visualized analytics and data trends" },
  { key:"settings", icon:<Settings size={18}/>, label:"Settings", sub:"Configure your app and region preferences" },
  { key:"visit",    icon:<Clipboard size={18}/>, label:"Visit Performance", sub:"Track actual field visits against the target per day", hideInSidebar: true },
  { key:"revenue",  icon:<IndianRupee size={18}/>,  label:"Monthly Revenue", sub:"Track revenue generated across months", hideInSidebar: true },
  { key:"stock",    icon:<Bell size={18}/>, label:"Stock Alerts", sub:"Real-time stock status across top products", hideInSidebar: true },
  { key:"crop",     icon:<Wheat size={18}/>, label:"Crop Risk", sub:"Risk Percentage by Crop", hideInSidebar: true },
  { key:"weather",  icon:<CloudRain size={18}/>, label:"Weather Alert", sub:"Stay prepared for changing weather", hideInSidebar: true },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label, suffix="" }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}>
      <div style={{ color:"#94A3B8", marginBottom:2 }}>{label}</div>
      <div style={{ color:"#4ADE80", fontWeight:700 }}>{payload[0].value}{suffix}</div>
    </div>
  );
};

const InfoBar = ({ text }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 16px", background:"rgba(74,222,128,0.05)", borderRadius:10, border:"1px solid rgba(74,222,128,0.1)" }}>
    <span><Info size={16}/></span><span style={{ fontSize:12, color:"#64748B", lineHeight:1.6 }}>{text}</span>
  </div>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"22px 24px", ...style }}>{children}</div>
);

// Filter Dropdown
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.06)",
        border:`1px solid ${open ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.1)"}`,
        borderRadius:8, padding:"6px 12px", fontSize:12, color:"#CBD5E1", cursor:"pointer",
        fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.15s",
      }}>
        <span><Calendar size={14}/></span> {value} <span style={{ fontSize:10, color:"#64748B" }}>▾</span>
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:200,
          background:"#0F1F14", border:"1px solid rgba(74,222,128,0.2)", borderRadius:10,
          padding:"6px", minWidth:170, boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {options.map(o => (
            <div key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              padding:"9px 14px", fontSize:12, borderRadius:7, cursor:"pointer",
              color: value===o ? "#4ADE80" : "#CBD5E1",
              background: value===o ? "rgba(74,222,128,0.1)" : "transparent",
              fontWeight: value===o ? 700 : 400,
            }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Page Header with filter - only renders the filter dropdown now that title/sub/icon are in the TopBar
const PageHeader = ({ filterOptions, filter, onFilter }) => {
  if (!filterOptions) return null;
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
      <FilterDropdown label={filter} options={filterOptions} value={filter} onChange={onFilter} />
    </div>
  );
};

const KpiCard = ({ icon, iconBg, label, value, valueColor, sub, onClick }) => (
  <div onClick={onClick} style={{
    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:14, padding:"18px 20px", cursor: onClick ? "pointer" : "default",
    transition:"border-color 0.2s, background 0.2s",
  }}
    onMouseEnter={e => { if(onClick){ e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; }}}
    onMouseLeave={e => { if(onClick){ e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}}
  >
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <div style={{ width:40, height:40, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
      <span style={{ fontSize:12, color:"#94A3B8" }}>{label}</span>
    </div>
    <div style={{ fontSize:28, fontWeight:800, color:valueColor, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:11, color:"#64748B", marginTop:5 }}>{sub}</div>
    {onClick && <div style={{ fontSize:10, color:"#4ADE80", marginTop:6 }}>View details →</div>}
  </div>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, onNav }) => {
  const { role, setRole, logout } = useUIStore();
  return (
    <aside style={{
      width:240, flexShrink:0, background:"rgba(8,18,12,0.97)",
      borderRight:"1px solid rgba(255,255,255,0.07)",
      display:"flex", flexDirection:"column", padding:"28px 16px",
      gap:4, height:"100vh", position:"sticky", top:0,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 8px 28px" }}>
        <div style={{ width:38, height:38, borderRadius:10, background:"rgba(74,222,128,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}><Leaf size={24}/></div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#4ADE80", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>AgroAI</div>
          <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>Field Intelligence</div>
        </div>
      </div>
      <div style={{ fontSize:9, color:"#334155", fontWeight:700, letterSpacing:2, padding:"0 10px 8px", textTransform:"uppercase" }}>Navigation</div>
      {NAV.filter(n => !n.hideInSidebar).map(n => (
        <button key={n.key} onClick={() => onNav(n.key)} style={{
          display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
          borderRadius:10, border:"none", cursor:"pointer",
          background: active===n.key ? "rgba(74,222,128,0.12)" : "transparent",
          borderLeft: active===n.key ? "3px solid #4ADE80" : "3px solid transparent",
          color: active===n.key ? "#4ADE80" : "#64748B",
          fontSize:13, fontWeight: active===n.key ? 700 : 400,
          fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s", textAlign:"left",
        }}>
          <span style={{ fontSize:16, width:22, textAlign:"center" }}>{n.icon}</span>
          {n.label}
          {n.key==="stock" && <span style={{ marginLeft:"auto", fontSize:10, background:"rgba(239,68,68,0.2)", color:"#EF4444", borderRadius:5, padding:"2px 6px", fontWeight:700 }}>2</span>}
        </button>
      ))}
      <div style={{ marginTop:"auto", padding:"20px 10px 0", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", gap:12 }}>
        {/* Log Out */}
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(239, 68, 68, 0.3)",
            background: "rgba(239, 68, 68, 0.05)",
            color: "#F87171",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "'DM Sans',sans-serif",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(239, 68, 68, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>🚪</span> Log Out
        </button>

        {/* User profile card */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(74,222,128,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}><User size={20}/></div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#CBD5E1" }}>Amit Sharma</div>
            <div style={{ fontSize:10, color:"#475569" }}>Field Representative</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const TopBar = ({ page }) => {
  const item = NAV.find(n=>n.key===page)||NAV[0];
  return (
    <div style={{
      height:72, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 28px", borderBottom:"1px solid rgba(255,255,255,0.07)",
      background:"rgba(8,18,12,0.85)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:"rgba(74,222,128,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#4ADE80" }}>
          {item.icon}
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1.2 }}>{item.label}</div>
          {item.sub && <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{item.sub}</div>}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#F8FAFC" }}>
          <span><AlertTriangle size={14}/></span> 2 Critical Stocks
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#F8FAFC" }}>
          <span><Navigation size={14}/></span> Jhansi Region
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#4ADE80" }}>
          <span><CloudRain size={14}/></span> Rain Alert Today
        </div>
      </div>
    </div>
  );
};

// ─── OVERVIEW PAGE ─────────────────────────────────────────────────────────────
const Overview = ({ tasks, onToggleTask, onNav, onOpenTask, onOpenCropRisk }) => {
  const d = new Date().toLocaleDateString("en-IN",{ weekday:"long", year:"numeric", month:"long", day:"numeric" });
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Welcome */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif" }}>
            <span style={{ color:"#F8FAFC" }}>Good Morning, </span><span style={{ color:"#4ADE80" }}>Amit</span>
          </div>
          <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>{d}</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <span><Sun size={14}/></span><span style={{ fontSize:13, fontWeight:600, color:"#F8FAFC" }}>28°C — Sunny</span>
          </div>
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <span><CloudRain size={14}/></span><span style={{ fontSize:13, fontWeight:600, color:"#F8FAFC" }}>Rain Expected — 80%</span>
          </div>
        </div>
      </div>

      {/* Contextual Weather Action Banner */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 16, 
        background: "rgba(239, 115, 22, 0.08)", 
        border: "1px solid rgba(249, 115, 22, 0.25)", 
        borderRadius: 12, 
        padding: "16px 20px" 
      }}>
        <div style={{ fontSize: 24, display: "flex", alignItems: "center" }}>⚠️</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F97316", marginBottom: 4 }}>Field Operations Advisory - Rain Probability High</div>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.5 }}>
            Heavy rain forecast (80% probability) in Jhansi. We recommend postponing outdoor crop inspections or spraying campaigns (Topik 15 WP, Score 250 EC) to avoid chemical wash-off. Prioritize indoor retailer stock audits and outstanding payment follow-ups today.
          </div>
        </div>
      </div>

      {/* Clickable KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        <KpiCard icon={<Calendar size={22}/>} iconBg="rgba(74,222,128,0.2)"  label="Avg. Visits/Day"   value="2.0"   valueColor="#4ADE80" sub="vs Target: 2.0"    onClick={()=>onNav("visit")} />
        <KpiCard icon={<IndianRupee size={22}/>}  iconBg="rgba(234,179,8,0.2)"   label="Monthly Revenue"   value="₹3.0L" valueColor="#EAB308" sub="Feb 2026 (Peak)"    onClick={()=>onNav("revenue")} />
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)"   label="Critical Stocks"   value="2"     valueColor="#EF4444" sub="Need restocking"    onClick={()=>onNav("stock")} />
        <KpiCard icon={<Wheat size={22}/>} iconBg="rgba(249,115,22,0.2)"  label="High-Risk Crops"   value="2"     valueColor="#F97316" sub="Wheat & Chickpea"     onClick={()=>onNav("crop")} />
        <KpiCard icon={<CloudRain size={22}/>} iconBg="rgba(56,189,248,0.2)"  label="Weather Alert"     value="Rain"  valueColor="#38BDF8" sub="80% probability"    onClick={()=>onNav("weather")} />
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Visit Performance</div>
            <button onClick={()=>onNav("visit")} style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>View All →</button>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={visitData} barSize={50} margin={{ top:16, right:10, left:-18, bottom:0 }}>
              <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#16A34A"/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill:"#64748B", fontSize:9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false} domain={[0,4]} />
              <Tooltip content={<ChartTip suffix=" visits/day" />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
              <ReferenceLine y={2} stroke="#CBD5E1" strokeDasharray="6 3" strokeWidth={1.5} />
              <Bar dataKey="visits" radius={[6,6,0,0]}>{visitData.map((d,i)=><Cell key={i} fill={d.visits>=2?"url(#gB)":"#EF4444"}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Monthly Revenue</div>
            <button onClick={()=>onNav("revenue")} style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>View All →</button>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={revenueData} margin={{ top:16, right:16, left:-10, bottom:0 }}>
              <defs><linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#84CC16" stopOpacity={0.3}/><stop offset="90%" stopColor="#84CC16" stopOpacity={0.02}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v}L`} domain={[0,3.5]} />
              <Tooltip content={({ active,payload,label }) => { if(!active||!payload?.length) return null; return <div style={{ background:"#0F1F14", border:"1px solid rgba(132,204,22,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}><div style={{ color:"#94A3B8" }}>{label}</div><div style={{ color:"#84CC16", fontWeight:700 }}>₹{payload[0].value}L</div></div>; }} />
              <Area type="monotone" dataKey="revenue" stroke="#84CC16" strokeWidth={2.5} fill="url(#rG)" dot={{ r:4, fill:"#84CC16" }} activeDot={{ r:6, fill:"#84CC16", stroke:"#0D1F12", strokeWidth:2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tasks + Crop row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 0.7fr", gap:16 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}><Clipboard size={14} style={{marginRight:8}}/> Today's Tasks <span style={{ fontSize:11, color:"#64748B", fontWeight:400 }}>({tasks.filter(t=>!t.done).length} remaining)</span></div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {tasks.map(task => (
              <div key={task.id} style={{
                display:"flex", alignItems:"center", gap:14, cursor:"pointer",
                background: task.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${task.done ? "rgba(255,255,255,0.05)" : TYPE_COLOR[task.type]+"30"}`,
                borderRadius:10, padding:"10px 14px", opacity: task.done ? 0.5 : 1, transition:"all 0.2s",
              }}
                onClick={() => {
                  if (task.type === "Visit") {
                    const growerName = task.text.split("—")[0].trim();
                    const grower = growerData.find(g => g.name.toLowerCase().includes(growerName.toLowerCase()));
                    onOpenTask({ type: "grower", data: grower || growerData[0] });
                  } else if (task.type === "Stock") {
                    const product = stockData.find(s => task.text.toLowerCase().includes(s.name.toLowerCase())) || stockData[0];
                    onOpenTask({ type: "stock", data: { ...product, warehouse: "Jhansi Depot" } });
                  } else if (task.type === "Revenue") {
                    const retailer = retailerData.find(r => r.outstanding > 0) || retailerData[0];
                    onOpenTask({ type: "retailer", data: { ...retailer, outstanding: 18000 } });
                  }
                }}
                onMouseEnter={e => { if(!task.done) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { if(!task.done) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <div 
                  onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                  style={{ width:22, height:22, borderRadius:6, border:`2px solid ${TYPE_COLOR[task.type]}`, background: task.done ? TYPE_COLOR[task.type] : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:"#0D1F12", fontWeight:700 }}
                >
                  {task.done ? <Check size={14} /> : null}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color: task.done?"#64748B":"#CBD5E1", textDecoration: task.done?"line-through":"none", fontWeight:500 }}>{task.text}</div>
                  <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{task.time}</div>
                </div>
                <span style={{ fontSize:10, background:`${TYPE_COLOR[task.type]}15`, color:TYPE_COLOR[task.type], borderRadius:4, padding:"3px 8px", fontWeight:700 }}>
                  {task.type}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}><Wheat size={14} style={{marginRight:8}}/> Crop Risk</div>
            <button onClick={()=>onNav("crop")} style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>View All →</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {cropData.map(d=>(
              <div 
                key={d.crop} 
                onClick={() => onOpenCropRisk(d)}
                style={{ 
                  display:"flex", 
                  alignItems:"center", 
                  gap:10, 
                  cursor: "pointer", 
                  padding: "4px 8px", 
                  borderRadius: 6,
                  transition: "background 0.2s" 
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ width:50, fontSize:12, color:"#CBD5E1", fontWeight:500 }}>{d.crop}</span>
                <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.07)", borderRadius:3 }}>
                  <div style={{ width:`${d.risk}%`, height:"100%", background:CROP_COLOR(d.level), borderRadius:3, transition:"width 0.4s" }} />
                </div>
                <span style={{ width:38, fontSize:12, fontWeight:700, color:CROP_COLOR(d.level), textAlign:"right" }}>{d.risk}%</span>
              </div>
            ))}
            <div style={{ display:"flex", gap:14, marginTop:6, flexWrap:"wrap" }}>
              {[["#EF4444","High"],["#F97316","Medium"],["#84CC16","Low"]].map(([c,l])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#94A3B8" }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:c }} />{l}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── VISIT PAGE ───────────────────────────────────────────────────────────────
const VisitPage = ({ onNav }) => {
  const [filter, setFilter] = useState("Last 4 Weeks");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");
  
  // Mapped visits based on the week data
  const recentVisits = [
    { date: "Oct 14, 2025", week: "W1 Oct 12–18", target: "Ramesh Kumar (Grower)", type: "Grower Visit", location: "Karguwan Village", purpose: "Wheat crop inspection (Topik 15 WP)", status: "Completed" },
    { date: "Oct 17, 2025", week: "W1 Oct 12–18", target: "Ganga Agri Kendra (Retailer)", type: "Retailer Visit", location: "Patna Tahsil, Patna", purpose: "Stock verification & demand planning", status: "Completed" },
    { date: "Nov 21, 2025", week: "W2 Nov 19–25", target: "Suresh Patel (Grower)", type: "Grower Visit", location: "Sajnam Village", purpose: "Mustard disease treatment (Score 250 EC)", status: "Completed" },
    { date: "Dec 27, 2025", week: "W3 Dec 26–Jan 1", target: "Kisan Seed Store (Retailer)", type: "Retailer Visit", location: "Jhansi Bypass, Jhansi", purpose: "Restock request for Actara 25 WG", status: "Completed" },
    { date: "Dec 29, 2025", week: "W3 Dec 26–Jan 1", target: "Mahesh Singh (Grower)", type: "Grower Visit", location: "Simra Village", purpose: "Chickpea pest follow-up (Actara 25 WG)", status: "Completed" },
    { date: "Dec 31, 2025", week: "W3 Dec 26–Jan 1", target: "Mahavir Fertilizers (Retailer)", type: "Retailer Visit", location: "Mauranipur, Jhansi", purpose: "Outstanding payment discussion", status: "Completed" },
    { date: "Feb 03, 2026", week: "W4 Feb 2–8", target: "Dinesh Yadav (Grower)", type: "Grower Visit", location: "Bijoli Village", purpose: "Potato blight inspection (Kavach 75 WP)", status: "Completed" },
    { date: "Feb 06, 2026", week: "W4 Feb 2–8", target: "Balaji Seeds & Chemicals (Retailer)", type: "Retailer Visit", location: "Gursarai, Jhansi", purpose: "Order booking for Kavach 75 WP", status: "Completed" }
  ];

  const filteredVisits = recentVisits.filter(v => {
    const matchesWeek = !selectedWeek || v.week === selectedWeek;
    const matchesType = typeFilter === "All" || v.type === typeFilter;
    return matchesWeek && matchesType;
  });

  const visitLegendItems = [
    { label: "Grower Visit", color: "#4ADE80", key: "Grower Visit" },
    { label: "Retailer Visit", color: "#A855F7", key: "Retailer Visit" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <button onClick={() => onNav("dashboard")} style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 12,
          color: "#CBD5E1",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          fontFamily: "'DM Sans', sans-serif"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; e.currentTarget.style.color="#4ADE80"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#CBD5E1"; }}
        >
          ← Back to Dashboard
        </button>
        <PageHeader filterOptions={["Last 4 Weeks","Last 8 Weeks","This Month","Last Month"]} filter={filter} onFilter={setFilter} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<Calendar size={22}/>} iconBg="rgba(74,222,128,0.2)"  label="Avg. Actual Visits"  value="2.0"  valueColor="#4ADE80" sub="Visits/Day" />
        <KpiCard icon={<Target size={22}/>} iconBg="rgba(56,189,248,0.2)"  label="Target Visits/Day"   value="2.0"  valueColor="#38BDF8" sub="Visits/Day" />
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(249,115,22,0.2)"  label="Avg. Achievement"    value="100%" valueColor="#F97316" sub="of Target" />
        <KpiCard icon={<BarChart2 size={22}/>} iconBg="rgba(168,85,247,0.2)"  label="Total Actual Visits" value="8"    valueColor="#A855F7" sub="This Period" />
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Visits per Day</div>
            {selectedWeek && <div style={{ fontSize:11, color:"#4ADE80", marginTop:4 }}>Filtered: {selectedWeek}</div>}
          </div>
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94A3B8" }}><div style={{ width:14, height:14, borderRadius:3, background:"linear-gradient(#4ADE80,#16A34A)" }} /> Actual Visits (Visits/Day)</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94A3B8" }}><div style={{ width:20, height:0, borderTop:"2px dashed #CBD5E1" }} /> Target (Visits/Day)</div>
          </div>
        </div>
        <div style={{ fontSize:11, color:"#64748B", marginBottom:12 }}>💡 Pro-Tip: Click on a bar to filter visits by week</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visitData} barSize={80} margin={{ top:20, right:60, left:-10, bottom:0 }}>
            <defs><linearGradient id="gB2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#16A34A"/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill:"#94A3B8", fontSize:12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} domain={[0,4]} ticks={[0,1,2,3,4]} />
            <Tooltip content={<ChartTip suffix=" visits/day" />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
            <ReferenceLine y={2} stroke="#CBD5E1" strokeDasharray="6 3" strokeWidth={1.5} label={{ value:"Target: 2", position:"right", fill:"#F8FAFC", fontSize:11, dx:8 }} />
            <Bar dataKey="visits" radius={[8,8,0,0]} cursor="pointer"
              onClick={(entry) => {
                const weekName = entry?.week || entry?.payload?.week;
                if (weekName) setSelectedWeek(w => w === weekName ? null : weekName);
              }}
              label={({ x, y, width, value, index }) => {
                const item = visitData[index];
                if (!item) return null;
                const isSelected = selectedWeek === item.week;
                return (
                  <text x={x + width / 2} y={y - 10} fill={isSelected ? "#4ADE80" : "#CBD5E1"} fontSize={11} fontWeight={700} textAnchor="middle">
                    {isSelected ? `✓ ${value}` : value}
                  </text>
                );
              }}
            >
              {visitData.map((d,i) => {
                const isSelected = selectedWeek === d.week;
                const matchesFilter = !selectedWeek || isSelected;
                const baseColor = d.visits>=2 ? "url(#gB2)" : "#EF4444";
                return <Cell key={i} fill={matchesFilter ? (isSelected ? "#4ADE80" : baseColor) : `rgba(255,255,255,0.08)`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:14, flexWrap:"wrap" }}>
          {visitLegendItems.map(item => (
            <div 
              key={item.key} 
              onClick={() => { setTypeFilter(t => t === item.key ? "All" : item.key); }}
              style={{ 
                display:"flex", alignItems:"center", gap:8, fontSize:11, 
                color: typeFilter === item.key ? "#4ADE80" : "#94A3B8",
                cursor: "pointer", padding: "6px 12px",
                background: typeFilter === item.key ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${typeFilter === item.key ? "#4ADE80" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, transition: "all 0.15s"
              }}
              onMouseEnter={e => { if (typeFilter !== item.key) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { if (typeFilter !== item.key) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ 
                width:12, height:12, borderRadius:3, background:item.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, color: "#0D1F12", fontWeight: 900
              }}>
                {typeFilter === item.key && "✓"}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
          {(selectedWeek || typeFilter !== "All") && (
            <button 
              onClick={() => { setSelectedWeek(null); setTypeFilter("All"); }}
              style={{
                fontSize: 10, color: "#64748B", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
                padding: "4px 10px", cursor: "pointer"
              }}
            >
              Clear Filter ✕
            </button>
          )}
        </div>
      </Card>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>
            Recent Field Visits Log {selectedWeek && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{selectedWeek}</span>} {typeFilter !== "All" && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:4 }}>{typeFilter}</span>}
          </div>
          {(selectedWeek || typeFilter !== "All") && (
            <button onClick={()=>{ setSelectedWeek(null); setTypeFilter("All"); }} style={{ fontSize:11, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>
              Clear All Filters ✕
            </button>
          )}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)" }}>
              {["Date", "Week", "Target Entity", "Type", "Location", "Purpose / Discussion", "Status"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", fontSize:10, color:"#64748B", fontWeight:700, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:"24px", textAlign:"center", color:"#64748B", fontSize:13 }}>No visits found for the selected filter.</td></tr>
            ) : filteredVisits.map((v,i)=>(
              <tr key={i} style={{ background: i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1", whiteSpace:"nowrap" }}>{v.date}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#94A3B8", whiteSpace:"nowrap" }}>{v.week}</td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#F8FAFC" }}>{v.target}</td>
                <td style={{ padding:"12px 16px", fontSize:11, color:v.type.includes("Retailer")?"#A855F7":"#4ADE80", fontWeight:600 }}>{v.type}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{v.location}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#94A3B8" }}>{v.purpose}</td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{ fontSize:10, background:"rgba(74,222,128,0.12)", color:"#4ADE80", border:"1px solid rgba(74,222,128,0.25)", borderRadius:6, padding:"4px 8px", fontWeight:700 }}>{v.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <InfoBar text="Visits per day is the average number of field visits completed by representatives per working day." />
    </div>
  );
};

// ─── REVENUE PAGE ─────────────────────────────────────────────────────────────
const RevenuePage = ({ onNav }) => {
  const [filter, setFilter] = useState("Last 6 Months");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const recentOrders = [
    { date: "Feb 12, 2026", month: "Feb", retailer: "Ganga Agri Kendra", product: "Topik 15 WP", qty: "50 Packs", value: "₹45,000", status: "Paid", remarks: "Restocked Wheat herbicide for peak demand" },
    { date: "Feb 18, 2026", month: "Feb", retailer: "Kisan Seed Store", product: "Score 250 EC", qty: "30 Bottles", value: "₹36,000", status: "Pending", remarks: "Mustard disease control requirement" },
    { date: "Jan 15, 2026", month: "Jan", retailer: "Balaji Seeds & Chemicals", product: "Actara 25 WG", qty: "40 Packs", value: "₹32,000", status: "Paid", remarks: "Chickpea insecticide distributor push" },
    { date: "Dec 10, 2025", month: "Dec", retailer: "Mahavir Fertilizers", product: "Kavach 75 WP", qty: "60 Packs", value: "₹48,000", status: "Paid", remarks: "Preventive spray for potato late blight" },
    { date: "Nov 08, 2025", month: "Nov", retailer: "Ganga Agri Kendra", product: "Score 250 EC", qty: "25 Bottles", value: "₹30,000", status: "Paid", remarks: "Early season stock replenishment" },
    { date: "Oct 20, 2025", month: "Oct", retailer: "Ram Krishi Bhandar", product: "Topik 15 WP", qty: "20 Packs", value: "₹18,000", status: "Paid", remarks: "Initial wheat sowing herbicide setup" }
  ];

  const filteredOrders = recentOrders.filter(o => {
    const matchesMonth = !selectedMonth || o.month === selectedMonth;
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesMonth && matchesStatus;
  });

  const revenueLegendItems = [
    { label: "Paid Orders", color: "#4ADE80", key: "Paid" },
    { label: "Pending Orders", color: "#F97316", key: "Pending" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <button onClick={() => onNav("dashboard")} style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 12,
          color: "#CBD5E1",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          fontFamily: "'DM Sans', sans-serif"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; e.currentTarget.style.color="#4ADE80"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#CBD5E1"; }}
        >
          ← Back to Dashboard
        </button>
        <PageHeader filterOptions={["Last 6 Months","Last 3 Months","This Year","Last Year"]} filter={filter} onFilter={setFilter} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<IndianRupee size={22}/>}  iconBg="rgba(74,222,128,0.2)"  label="Total Revenue"      value="₹10.80L" valueColor="#4ADE80" sub="Last 6 Months" />
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(56,189,248,0.2)"  label="Average / Month"    value="₹1.80L"  valueColor="#38BDF8" sub="Per Month" />
        <KpiCard icon={<Activity size={22}/>} iconBg="rgba(249,115,22,0.2)"  label="Highest Month"      value="₹3.00L"  valueColor="#F97316" sub="Feb 2026" />
        <KpiCard icon={<BarChart2 size={22}/>} iconBg="rgba(168,85,247,0.2)"  label="Growth Feb vs Jan"  value="+66.7%"  valueColor="#A855F7" sub="Increase" />
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Revenue Trend (₹ Lakhs)</div>
            {selectedMonth && <div style={{ fontSize:11, color:"#4ADE80", marginTop:4 }}>Filtered: {selectedMonth}</div>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#94A3B8" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#84CC16" }} /> Revenue (₹)
          </div>
        </div>
        <div style={{ fontSize:11, color:"#64748B", marginBottom:8 }}>💡 Pro-Tip: Click on a dot to filter orders by month</div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData} margin={{ top:20, right:20, left:15, bottom:0 }}>
            <defs><linearGradient id="rG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#84CC16" stopOpacity={0.3}/><stop offset="90%" stopColor="#84CC16" stopOpacity={0.02}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:"#94A3B8", fontSize:12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v}L`} domain={[0,3.5]} />
            <Tooltip content={({ active,payload,label }) => { if(!active||!payload?.length) return null; return <div style={{ background:"#0F1F14", border:"1px solid rgba(132,204,22,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}><div style={{ color:"#94A3B8" }}>{label}</div><div style={{ color:"#84CC16", fontWeight:700 }}>₹{payload[0].value}L</div></div>; }} />
            <Area type="monotone" dataKey="revenue" stroke="#84CC16" strokeWidth={3} fill="url(#rG2)"
              dot={({ cx,cy,payload }) => {
                const isSelected = selectedMonth === payload.month;
                const isDimmed = selectedMonth && !isSelected;
                return (
                  <g key={payload.month} onClick={() => setSelectedMonth(m => m === payload.month ? null : payload.month)} style={{ cursor:"pointer" }}>
                    <circle cx={cx} cy={cy} r={isSelected ? 7 : 5} fill={isDimmed ? "rgba(132,204,22,0.25)" : "#84CC16"} stroke={isSelected ? "#0D1F12" : "none"} strokeWidth={isSelected ? 2 : 0} />
                    <text x={cx} y={cy-12} textAnchor="middle" fill={isDimmed ? "rgba(132,204,22,0.3)" : "#84CC16"} fontSize={11} fontWeight={700}>
                      {isSelected ? `✓ ₹${payload.revenue}L` : `₹${payload.revenue}L`}
                    </text>
                  </g>
                );
              }}
              activeDot={{ r:7, fill:"#84CC16", stroke:"#0D1F12", strokeWidth:2 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:14, flexWrap:"wrap" }}>
          {revenueLegendItems.map(item => (
            <div 
              key={item.key} 
              onClick={() => { setStatusFilter(s => s === item.key ? "All" : item.key); }}
              style={{ 
                display:"flex", alignItems:"center", gap:8, fontSize:11, 
                color: statusFilter === item.key ? "#4ADE80" : "#94A3B8",
                cursor: "pointer", padding: "6px 12px",
                background: statusFilter === item.key ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${statusFilter === item.key ? "#4ADE80" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, transition: "all 0.15s"
              }}
              onMouseEnter={e => { if (statusFilter !== item.key) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { if (statusFilter !== item.key) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ 
                width:12, height:12, borderRadius:3, background:item.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, color: "#0D1F12", fontWeight: 900
              }}>
                {statusFilter === item.key && "✓"}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
          {(selectedMonth || statusFilter !== "All") && (
            <button 
              onClick={() => { setSelectedMonth(null); setStatusFilter("All"); }}
              style={{
                fontSize: 10, color: "#64748B", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
                padding: "4px 10px", cursor: "pointer"
              }}
            >
              Clear Filter ✕
            </button>
          )}
        </div>
        <div style={{ textAlign:"center", fontSize:10, color:"#64748B", marginTop:6 }}>Month</div>
      </Card>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>
            Recent Retailer Orders & Revenue Log {selectedMonth && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{selectedMonth}</span>} {statusFilter !== "All" && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:4 }}>{statusFilter}</span>}
          </div>
          {(selectedMonth || statusFilter !== "All") && (
            <button onClick={()=>{ setSelectedMonth(null); setStatusFilter("All"); }} style={{ fontSize:11, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>
              Clear All Filters ✕
            </button>
          )}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)" }}>
              {["Order Date", "Retailer", "Product Ordered", "Quantity", "Order Value", "Payment Status", "Remarks"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", fontSize:10, color:"#64748B", fontWeight:700, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:"24px", textAlign:"center", color:"#64748B", fontSize:13 }}>No orders found for the selected filter.</td></tr>
            ) : filteredOrders.map((o,i)=>(
              <tr key={i} style={{ background: i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1", whiteSpace:"nowrap" }}>{o.date}</td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#F8FAFC" }}>{o.retailer}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#EAB308", fontWeight:600 }}>{o.product}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{o.qty}</td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#84CC16" }}>{o.value}</td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{
                    fontSize:10,
                    background: o.status === "Paid" ? "rgba(74,222,128,0.12)" : "rgba(249,115,22,0.12)",
                    color: o.status === "Paid" ? "#4ADE80" : "#F97316",
                    border: `1px solid ${o.status === "Paid" ? "rgba(74,222,128,0.25)" : "rgba(249,115,22,0.25)"}`,
                    borderRadius:6, padding:"4px 8px", fontWeight:700
                  }}>{o.status}</span>
                </td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#94A3B8" }}>{o.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <InfoBar text="Revenue is calculated based on approved recommendations, product orders, and services delivered by field representatives." />
    </div>
  );
};

// ─── STOCK PAGE ───────────────────────────────────────────────────────────────
const StockPage = ({ onNav, initialWarehouse = "All Warehouses" }) => {
  const [filter, setFilter] = useState(initialWarehouse);
  const [levelFilter, setLevelFilter] = useState("All");

  useEffect(() => {
    setFilter(initialWarehouse);
  }, [initialWarehouse]);

  const simulatedStock = (() => {
    if (filter === "Jhansi Depot") {
      return [
        { name:"Actara 25 WG", pack:"100g Pack",    stock:"15 Packs",   pct:15, level:"Critical", demand:["High grower demand in Jhansi region","Infestation outbreak"],   supply:["Delayed distributor supply","Low warehouse stock"],  action:"Restock within 2 days", actionIcon:<Store size={14}/> },
        { name:"Score 250 EC", pack:"250ml Bottle", stock:"10 Bottles", pct:10, level:"Critical", demand:["Increase in Mustard area in Jhansi","Seasonal disease"],           supply:["Supplier dispatch delay","High recent sales"],       action:"Restock within 2 days", actionIcon:<Store size={14}/> },
        { name:"Kavach 75 WP", pack:"250g Pack",    stock:"30 Packs",   pct:30, level:"Low",      demand:["Potato blight risk","Preventive applications"],           supply:["High recent sales","Replenishment in transit"],      action:"Restock within 5 days", actionIcon:<Store size={14}/> },
        { name:"Topik 15 WP",  pack:"500g Pack",    stock:"40 Packs",   pct:40, level:"Low",      demand:["Weed pressure in wheat","Moderate demand"],                 supply:["Stock moving normal","Some pending orders"],         action:"Restock within 5 days", actionIcon:<Store size={14}/> },
        { name:"Movondo",       pack:"250ml Bottle", stock:"80 Bottles", pct:80, level:"Healthy",  demand:["Steady demand","Regular usage"],                            supply:["Stock well available","No supply issues"],           action:"No action needed",      actionIcon:<Check size={14}/> },
      ];
    }
    if (filter === "Agra Depot") {
      return [
        { name:"Actara 25 WG", pack:"100g Pack",    stock:"60 Packs",   pct:60, level:"Medium",   demand:["Insect control in Agra","Moderate grower demand"],          supply:["Regular supply channel","Average inventory"],        action:"Monitor stock",         actionIcon:<Search size={14}/> },
        { name:"Score 250 EC", pack:"250ml Bottle", stock:"45 Bottles", pct:45, level:"Low",      demand:["Mustard cultivation disease prevention"],                   supply:["Supplier dispatch delay","High recent sales"],       action:"Restock within 5 days", actionIcon:<Store size={14}/> },
        { name:"Kavach 75 WP", pack:"250g Pack",    stock:"95 Packs",   pct:95, level:"Healthy",  demand:["Low current demand in Agra"],                               supply:["Stock well available","New shipment received"],      action:"No action needed",      actionIcon:<Check size={14}/> },
        { name:"Topik 15 WP",  pack:"500g Pack",    stock:"20 Packs",   pct:20, level:"Critical", demand:["Heavy weed infestation in Agra wheat belt"],               supply:["Delayed distributor supply","Low warehouse stock"],  action:"Restock within 2 days", actionIcon:<Store size={14}/> },
        { name:"Movondo",       pack:"250ml Bottle", stock:"50 Bottles", pct:50, level:"Low",      demand:["Foliar pest control demand"],                               supply:["High recent sales","Replenishment in transit"],      action:"Restock within 5 days", actionIcon:<Store size={14}/> },
      ];
    }
    if (filter === "Kanpur Depot") {
      return [
        { name:"Actara 25 WG", pack:"100g Pack",    stock:"85 Packs",   pct:85, level:"Healthy",  demand:["Steady demand","Regular usage"],                            supply:["Stock well available","No supply issues"],           action:"No action needed",      actionIcon:<Check size={14}/> },
        { name:"Score 250 EC", pack:"250ml Bottle", stock:"75 Bottles", pct:75, level:"Healthy",  demand:["Steady demand","Regular usage"],                            supply:["Stock well available","No supply issues"],           action:"No action needed",      actionIcon:<Check size={14}/> },
        { name:"Kavach 75 WP", pack:"250g Pack",    stock:"12 Packs",   pct:12, level:"Critical", demand:["Late blight alert in Kanpur potato fields"],               supply:["Delayed distributor supply","Low warehouse stock"],  action:"Restock within 2 days", actionIcon:<Store size={14}/> },
        { name:"Topik 15 WP",  pack:"500g Pack",    stock:"55 Packs",   pct:55, level:"Medium",   demand:["Weed pressure in wheat","Moderate demand"],                 supply:["Stock moving normal","Some pending orders"],         action:"Monitor stock",         actionIcon:<Search size={14}/> },
        { name:"Movondo",       pack:"250ml Bottle", stock:"65 Bottles", pct:65, level:"Medium",   demand:["Foliar pest control demand"],                               supply:["Stock moving normal","Some pending orders"],         action:"Monitor stock",         actionIcon:<Search size={14}/> },
      ];
    }
    // Default / All Warehouses
    return stockData;
  })();

  const counts = { Critical:0, Low:0, Medium:0, Healthy:0 };
  simulatedStock.forEach(s=>counts[s.level]++);
  const filtered = levelFilter==="All" ? simulatedStock : simulatedStock.filter(s=>s.level===levelFilter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <button onClick={() => onNav("dashboard")} style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 12,
          color: "#CBD5E1",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          fontFamily: "'DM Sans', sans-serif"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; e.currentTarget.style.color="#4ADE80"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#CBD5E1"; }}
        >
          ← Back to Dashboard
        </button>
        <PageHeader filterOptions={["All Warehouses","Jhansi Depot","Agra Depot","Kanpur Depot"]} filter={filter} onFilter={setFilter} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { label:"Critical (≤ 20%)", count:counts.Critical, color:"#EF4444", bg:"rgba(239,68,68,0.1)",  icon:"⚠️", key:"Critical" },
          { label:"Low (21%–50%)",    count:counts.Low,      color:"#F97316", bg:"rgba(249,115,22,0.1)", icon:"📉", key:"Low" },
          { label:"Medium (51%–70%)", count:counts.Medium,   color:"#EAB308", bg:"rgba(234,179,8,0.1)",  icon:"➖", key:"Medium" },
          { label:"Healthy (> 70%)",  count:counts.Healthy,  color:"#4ADE80", bg:"rgba(74,222,128,0.1)", icon:"✅", key:"Healthy" },
        ].map(sc=>(
          <div key={sc.key} onClick={()=>setLevelFilter(l=>l===sc.key?"All":sc.key)} style={{
            background: levelFilter===sc.key ? sc.bg : "rgba(255,255,255,0.03)",
            border:`1px solid ${levelFilter===sc.key ? sc.color+"60" : sc.color+"30"}`,
            borderRadius:14, padding:"18px 20px", display:"flex", alignItems:"center", gap:14,
            cursor:"pointer", transition:"all 0.2s",
          }}
            onMouseEnter={e => { if(levelFilter!==sc.key){ e.currentTarget.style.borderColor=sc.color+"50"; e.currentTarget.style.background=sc.bg; }}}
            onMouseLeave={e => { if(levelFilter!==sc.key){ e.currentTarget.style.borderColor=sc.color+"30"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}}
          >
            <div style={{ width:44, height:44, borderRadius:"50%", background:`${sc.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, position:"relative" }}>
              {sc.icon}
              {levelFilter===sc.key && <div style={{ position:"absolute", top:-2, right:-2, width:16, height:16, borderRadius:"50%", background:"#4ADE80", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#0D1F12", fontWeight:900, border:"2px solid #0D1F12" }}>✓</div>}
            </div>
            <div>
              <div style={{ fontSize:11, color:sc.color, fontWeight:700, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                {sc.label}
                {levelFilter===sc.key && <span style={{ fontSize:9, background:"rgba(74,222,128,0.15)", color:"#4ADE80", borderRadius:4, padding:"1px 5px", fontWeight:800 }}>✓</span>}
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:"#F8FAFC", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{sc.count} <span style={{ fontSize:13, color:"#94A3B8", fontWeight:400 }}>{sc.count === 1 ? "Product" : "Products"}</span></div>
              <div style={{ fontSize:10, color: levelFilter===sc.key ? "#4ADE80" : "#64748B", marginTop:4, fontWeight: levelFilter===sc.key ? 700 : 400 }}>{levelFilter===sc.key ? "✓ Active Filter" : "Click to filter"}</div>
            </div>
          </div>
        ))}
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Product Stock Status {levelFilter!=="All" && <span style={{ fontSize:11, color:LEVEL_COLOR[levelFilter], background:LEVEL_BG[levelFilter], borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{levelFilter}</span>}</div>
          {levelFilter!=="All" && <button onClick={()=>setLevelFilter("All")} style={{ fontSize:11, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Clear Filter ✕</button>}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)" }}>
              {["Product","Current Stock","Stock Level (%)","Alert Level","Reason – High Demand","Reason – Low Availability","AI Recommendation"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", fontSize:10, color:"#64748B", fontWeight:700, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s,i)=>(
              <tr key={s.name} style={{ background: i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:LEVEL_COLOR[s.level] }}>{s.name}</div>
                  <div style={{ fontSize:10, color:"#475569" }}>{s.pack}</div>
                </td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{s.stock}<div style={{ fontSize:10, color:"#475569" }}>({s.pack})</div></td>
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:LEVEL_COLOR[s.level], marginBottom:5 }}>{s.pct}%</div>
                  <div style={{ height:5, width:100, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
                    <div style={{ width:`${s.pct}%`, height:"100%", background:LEVEL_COLOR[s.level], borderRadius:3 }} />
                  </div>
                </td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{ fontSize:11, background:LEVEL_BG[s.level], color:LEVEL_COLOR[s.level], border:`1px solid ${LEVEL_COLOR[s.level]}40`, borderRadius:6, padding:"4px 10px", fontWeight:700, whiteSpace:"nowrap" }}>{s.level}</span>
                </td>
                <td style={{ padding:"12px 16px" }}>{s.demand.map(d=><div key={d} style={{ fontSize:11, color:"#94A3B8", lineHeight:1.6 }}>• {d}</div>)}</td>
                <td style={{ padding:"12px 16px" }}>{s.supply.map(d=><div key={d} style={{ fontSize:11, color:"#94A3B8", lineHeight:1.6 }}>• {d}</div>)}</td>
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:LEVEL_COLOR[s.level], fontWeight:600 }}>
                    {s.actionIcon} {s.action}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <InfoBar text="AI insights are generated based on historical data, field activity, weather forecast & market trends." />
    </div>
  );
};

// ─── CROP PAGE ────────────────────────────────────────────────────────────────
const CropPage = ({ onNav, initialCrop = null }) => {
  const [filter, setFilter] = useState("This Season");
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    if (initialCrop) {
      const kharifCrops = ["rice", "cotton", "maize", "soybean", "groundnut"];
      if (kharifCrops.includes(initialCrop.toLowerCase())) {
        setFilter("Kharif 2024");
      } else {
        setFilter("This Season");
      }
      setSelectedCrop(initialCrop);
    } else {
      setSelectedCrop(null);
    }
  }, [initialCrop]);

  // Dynamic simulated crops and growers depending on Rabi/Kharif selection
  const isKharif = filter === "Kharif 2024";

  const simulatedCrops = isKharif ? [
    { crop:"Rice", risk:80, level:"High" },
    { crop:"Cotton", risk:65, level:"High" },
    { crop:"Maize", risk:40, level:"Medium" },
    { crop:"Soybean", risk:25, level:"Low" },
    { crop:"Groundnut", risk:15, level:"Low" }
  ] : [
    { crop:"Wheat", risk:75, level:"High" },
    { crop:"Mustard", risk:45, level:"Medium" },
    { crop:"Pea", risk:20, level:"Low" },
    { crop:"Chickpea", risk:60, level:"High" },
    { crop:"Potato", risk:30, level:"Low" }
  ];

  const simulatedGrowers = isKharif ? [
    { id: 1, name: "Ramesh Yadav", land: "12 Acres", crop: "Rice", stage: "Tillering", risk: "High Risk", phone: "+91 94123 45678", location: "Karguwan Village", lastContact: "Today", advisory: "Apply Custodia fungicide for blast disease control" },
    { id: 2, name: "Suresh Patel", land: "8 Acres", crop: "Cotton", stage: "Flowering", risk: "High Risk", phone: "+91 94123 45679", location: "Sajnam Village", lastContact: "3 days ago", advisory: "Spray Actara 25 WG for sucking pests control" },
    { id: 3, name: "Mahesh Chand", land: "15 Acres", crop: "Maize", stage: "Vegetative", risk: "Medium Risk", phone: "+91 94123 45680", location: "Simra Village", lastContact: "5 days ago", advisory: "Apply nitrogen fertilizer top dressing" },
    { id: 4, name: "Dinesh Yadav", land: "5 Acres", crop: "Soybean", stage: "Vegetative", risk: "Low Risk", phone: "+91 94123 45681", location: "Bijoli Village", lastContact: "10 days ago", advisory: "Monitor crop health for weed infestation" },
    { id: 5, name: "Ram Sevak", land: "10 Acres", crop: "Rice", stage: "Panicle Initiation", risk: "High Risk", phone: "+91 94123 45683", location: "Patna Village", lastContact: "Yesterday", advisory: "Drain excess water, spray Custodia fungicide" }
  ] : [
    { id: 1, name: "Ramesh Kumar", land: "12 Acres", crop: "Wheat", stage: "Tillering", risk: "High Risk", phone: "+91 94123 45678", location: "Karguwan Village", lastContact: "Today", advisory: "Apply Topik 15 WP for weed control" },
    { id: 2, name: "Suresh Patel", land: "8 Acres", crop: "Mustard", stage: "Flowering", risk: "Medium Risk", phone: "+91 94123 45679", location: "Sajnam Village", lastContact: "3 days ago", advisory: "Apply Score 250 EC for alternaria blight control" },
    { id: 3, name: "Mahesh Singh", land: "15 Acres", crop: "Chickpea", stage: "Nursery", risk: "High Risk", phone: "+91 94123 45680", location: "Simra Village", lastContact: "5 days ago", advisory: "Apply Actara 25 WG for pod borer control" },
    { id: 4, name: "Dinesh Yadav", land: "5 Acres", crop: "Potato", stage: "Vegetative", risk: "Low Risk", phone: "+91 94123 45681", location: "Bijoli Village", lastContact: "10 days ago", advisory: "Apply Kavach 75 WP for late blight prevention" },
    { id: 5, name: "Harish Chandra", land: "20 Acres", crop: "Wheat", stage: "Harvested", risk: "Low Risk", phone: "+91 94123 45682", location: "Pura Village", lastContact: "Yesterday", advisory: "Soil preparation advice for next crop rotation" }
  ];

  // Apply crop & risk filter
  const filteredGrowers = simulatedGrowers.filter(g => {
    const matchesCrop = !selectedCrop || g.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesRisk = riskFilter === "All" || g.risk.toLowerCase().includes(riskFilter.toLowerCase());
    return matchesCrop && matchesRisk;
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <button onClick={() => onNav("dashboard")} style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 12,
          color: "#CBD5E1",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          fontFamily: "'DM Sans', sans-serif"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; e.currentTarget.style.color="#4ADE80"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#CBD5E1"; }}
        >
          ← Back to Dashboard
        </button>
        <PageHeader filterOptions={["This Season","Last Season","Kharif 2024","Rabi 2024"]} filter={filter} onFilter={(f) => { setFilter(f); setSelectedCrop(null); setRiskFilter("All"); }} />
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#94A3B8" }}>Risk Percentage (%) {riskFilter !== "All" && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{riskFilter} Risk Only</span>}</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>💡 Pro-Tip: Click on a bar or a legend below to filter</div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={simulatedCrops} barSize={70} margin={{ top:30, right:20, left:-18, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="crop" tick={{ fill:"#94A3B8", fontSize:13 }} tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }} />
            <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"} domain={[0,100]} ticks={[0,20,40,60,80,100]} />
            <Tooltip content={<ChartTip suffix="% risk" />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
            <Bar 
              dataKey="risk" 
              radius={[6,6,0,0]}
              cursor="pointer"
              onClick={(entry) => {
                const cropName = entry?.crop || entry?.payload?.crop;
                if (cropName) {
                  setSelectedCrop(c => c === cropName ? null : cropName);
                }
              }}
              label={({ x, y, width, value, index }) => {
                const item = simulatedCrops[index];
                if (!item) return null;
                const isSelected = selectedCrop === item.crop;
                const matchesRisk = riskFilter === "All" || item.level === riskFilter;
                if (!matchesRisk) return null;
                return (
                  <text x={x + width / 2} y={y - 10} fill={isSelected ? "#4ADE80" : "#CBD5E1"} fontSize={11} fontWeight={700} textAnchor="middle">
                    {isSelected ? `✓ ${value}%` : `${value}%`}
                  </text>
                );
              }}
            >
              {simulatedCrops.map((d,i)=>{
                const isSelected = selectedCrop === d.crop;
                const matchesRisk = riskFilter === "All" || d.level === riskFilter;
                const baseColor = isSelected ? "#4ADE80" : CROP_COLOR(d.level);
                return <Cell key={i} fill={matchesRisk ? baseColor : `${baseColor}25`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:14, flexWrap:"wrap" }}>
          {[
            { color:"#EF4444", label:"High Risk (≥ 60%)", key:"High" },
            { color:"#F97316", label:"Medium Risk (31%–59%)", key:"Medium" },
            { color:"#84CC16", label:"Low Risk (≤ 30%)", key:"Low" }
          ].map(item=>(
            <div 
              key={item.key} 
              onClick={() => {
                setRiskFilter(r => r === item.key ? "All" : item.key);
                setSelectedCrop(null);
              }}
              style={{ 
                display:"flex", 
                alignItems:"center", 
                gap:8, 
                fontSize:11, 
                color: riskFilter === item.key ? "#4ADE80" : "#94A3B8",
                cursor: "pointer",
                padding: "6px 12px",
                background: riskFilter === item.key ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${riskFilter === item.key ? "#4ADE80" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8,
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { if (riskFilter !== item.key) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { if (riskFilter !== item.key) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ 
                width:12, 
                height:12, 
                borderRadius:3, 
                background:item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                color: "#0D1F12",
                fontWeight: 900
              }}>
                {riskFilter === item.key && "✓"}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
          {riskFilter !== "All" && (
            <button 
              onClick={() => setRiskFilter("All")}
              style={{
                fontSize: 10, color: "#64748B", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
                padding: "4px 10px", cursor: "pointer"
              }}
            >
              Clear Filter ✕
            </button>
          )}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "4px 0", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#64748B" }}>Filter by Crop:</span>
        <button onClick={() => setSelectedCrop(null)} style={{
          background: !selectedCrop ? "rgba(74, 222, 128, 0.15)" : "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${!selectedCrop ? "#4ADE80" : "rgba(255, 255, 255, 0.1)"}`,
          borderRadius: 6, padding: "4.5px 10px", fontSize: 11, color: !selectedCrop ? "#4ADE80" : "#CBD5E1",
          cursor: "pointer", transition: "all 0.15s"
        }}>All Crops</button>
        {simulatedCrops.map(c => (
          <button key={c.crop} onClick={() => setSelectedCrop(c.crop)} style={{
            background: selectedCrop === c.crop ? "rgba(74, 222, 128, 0.15)" : "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${selectedCrop === c.crop ? "#4ADE80" : "rgba(255, 255, 255, 0.1)"}`,
            borderRadius: 6, padding: "4.5px 10px", fontSize: 11, color: selectedCrop === c.crop ? "#4ADE80" : "#CBD5E1",
            cursor: "pointer", transition: "all 0.15s"
          }}>{c.crop}</button>
        ))}
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>
            Affected Growers under Crop Risk {selectedCrop && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{selectedCrop}</span>} {riskFilter !== "All" && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:4 }}>{riskFilter} Risk</span>}
          </div>
          {(selectedCrop || riskFilter !== "All") && (
            <button 
              onClick={()=>{ setSelectedCrop(null); setRiskFilter("All"); }} 
              style={{ fontSize:11, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}
            >
              Clear All Filters ✕
            </button>
          )}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)" }}>
              {["Grower Name", "Land Area", "Crop Cultivated", "Crop Stage", "Risk Level", "Location", "AI Advisory Action"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", fontSize:10, color:"#64748B", fontWeight:700, textAlign:"left", whiteSpace:"nowrap", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGrowers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding:"24px", textAlign:"center", color:"#64748B", fontSize:13 }}>No growers found for the selected filter.</td>
              </tr>
            ) : filteredGrowers.map((g,i)=>(
              <tr key={g.id} style={{ background: i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#F8FAFC" }}>{g.name}</div>
                  <div style={{ fontSize:10, color:"#64748B" }}>{g.phone}</div>
                </td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{g.land}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#EAB308", fontWeight:600 }}>{g.crop}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{g.stage}</td>
                <td style={{ padding:"12px 16px" }}>
                  <span style={{
                    fontSize:10,
                    background: g.risk.includes("High") ? "rgba(239,68,68,0.12)" : g.risk.includes("Medium") ? "rgba(249,115,22,0.12)" : "rgba(132,204,22,0.12)",
                    color: g.risk.includes("High") ? "#EF4444" : g.risk.includes("Medium") ? "#F97316" : "#84CC16",
                    border: `1px solid ${g.risk.includes("High") ? "rgba(239,68,68,0.25)" : g.risk.includes("Medium") ? "rgba(249,115,22,0.25)" : "rgba(132,204,22,0.25)"}`,
                    borderRadius:6, padding:"4px 8px", fontWeight:700
                  }}>{g.risk}</span>
                </td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{g.location}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#4ADE80", fontWeight:500 }}>{g.advisory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <InfoBar text="Risk percentage is calculated based on factors like weather anomalies, pest threat, soil health, field visit data, and grower engagement." />
    </div>
  );
};

// ─── WEATHER PAGE ─────────────────────────────────────────────────────────────
// ─── WEATHER PAGE ─────────────────────────────────────────────────────────────
const WeatherPage = ({ onNav }) => {
  const [filter, setFilter] = useState("Jhansi Region");

  // Dynamic simulated weather data based on the selected region/territory
  const weatherSim = (() => {
    if (filter === "Agra Region") {
      return {
        temp: "34°C",
        condition: "Sunny & Clear Sky",
        prob: "10%",
        icon: <Sun size={64} style={{ color: "#EAB308" }} />,
        action: "Clear sunny weather. Excellent day for grower field visits and conducting spraying demonstrations for Topik 15 WP in Wheat fields.",
        chartData: [
          { time:"6AM", pct:5 }, { time:"9AM", pct:10 }, { time:"12PM", pct:10 }, { time:"3PM", pct:8 },
          { time:"6PM", pct:5 }, { time:"9PM", pct:2 }, { time:"12AM", pct:0 }, { time:"3AM", pct:0 }, { time:"6AM+", pct:0 }
        ],
        schedule: [
          { time: "09:30 AM", type: "Grower Visit", target: "Ramesh Kumar", location: "Karguwan Village", activity: "Wheat field inspection & Topik 15 WP spray demonstration" },
          { time: "11:30 AM", type: "Grower Visit", target: "Harish Chandra", location: "Pura Village", activity: "Soil testing advisory for upcoming crop cycle" },
          { time: "02:00 PM", type: "Retailer Meeting", target: "Balaji Seeds & Chemicals", location: "Gursarai", activity: "Booking new herbicide orders and outstanding follow-up" },
          { time: "04:30 PM", type: "Demo Activity", target: "Agra Farmer Group", location: "Sajnam Village", activity: "Conducting community meeting on Alternaria Blight prevention" }
        ]
      };
    }
    if (filter === "Kanpur Region") {
      return {
        temp: "31°C",
        condition: "Overcast / Light Drizzle",
        prob: "45%",
        icon: <CloudRain size={64} style={{ color: "#94A3B8" }} />,
        action: "Overcast conditions. Advise potato growers in Kanpur to monitor for late blight (Kavach 75 WP), but delay spraying until drizzle stops.",
        chartData: [
          { time:"6AM", pct:20 }, { time:"9AM", pct:30 }, { time:"12PM", pct:45 }, { time:"3PM", pct:40 },
          { time:"6PM", pct:35 }, { time:"9PM", pct:25 }, { time:"12AM", pct:15 }, { time:"3AM", pct:10 }, { time:"6AM+", pct:5 }
        ],
        schedule: [
          { time: "10:00 AM", type: "Retailer Visit", target: "Ganga Agri Kendra", location: "Patna Tahsil", activity: "Reviewing Score 250 EC stock levels and outstanding collection" },
          { time: "01:00 PM", type: "Grower Advisory", target: "Dinesh Yadav", location: "Bijoli Village", activity: "Inspect potato crop for early signs of Late Blight, caution against wet sprays" },
          { time: "03:30 PM", type: "Indoor Meeting", target: "Ram Krishi Bhandar", location: "Babina", activity: "Discuss dealer incentives scheme and verify inventory stock" }
        ]
      };
    }
    // Default Jhansi Region
    return {
      temp: "28°C",
      condition: "Heavy Rain Expected",
      prob: "80%",
      icon: <CloudRain size={64} style={{ color: "#38BDF8" }} />,
      action: "Heavy rain starting from 12 PM. Do not advise pesticide/fungicide spray to growers today. Focus on visiting indoor retailers for collection and stock audit.",
      chartData: [
        { time:"6AM", pct:20 }, { time:"9AM", pct:40 }, { time:"12PM", pct:80 }, { time:"3PM", pct:90 },
        { time:"6PM", pct:70 }, { time:"9PM", pct:50 }, { time:"12AM", pct:30 }, { time:"3AM", pct:20 }, { time:"6AM+", pct:10 }
      ],
      schedule: [
        { time: "09:30 AM", type: "Retailer Visit", target: "Kisan Seed Store", location: "Jhansi Bypass", activity: "Urgent restocking verification before rain starts" },
        { time: "11:30 AM", type: "Retailer Meeting", target: "Mahavir Fertilizers", location: "Mauranipur", activity: "Outstanding payment discussion & check receipt details" },
        { time: "02:30 PM", type: "Indoor Work", target: "Jhansi Office / Depot", location: "Jhansi Depot", activity: "Update CRM system with week's progress, phone-call grower follow-ups" }
      ]
    };
  })();

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <button onClick={() => onNav("dashboard")} style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          padding: "7px 14px",
          fontSize: 12,
          color: "#CBD5E1",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          fontFamily: "'DM Sans', sans-serif"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(74,222,128,0.3)"; e.currentTarget.style.background="rgba(74,222,128,0.05)"; e.currentTarget.style.color="#4ADE80"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#CBD5E1"; }}
        >
          ← Back to Dashboard
        </button>
        <PageHeader filterOptions={["Jhansi Region", "Agra Region", "Kanpur Region"]} filter={filter} onFilter={setFilter} />
      </div>
      
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
        <Card style={{ background:"rgba(56,189,248,0.05)", border:"1px solid rgba(56,189,248,0.15)" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:10 }}>
            <div style={{ fontSize:80 }}>{weatherSim.icon}</div>
            <div style={{ fontSize:54, fontWeight:800, color:"#4ADE80", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{weatherSim.temp}</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#F8FAFC" }}>{weatherSim.condition}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#CBD5E1" }}><span><MapPin size={14}/></span> {filter}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
              <span><CloudRain size={14}/></span><span style={{ color:"#CBD5E1" }}>Rain Probability:</span>
              <span style={{ color:"#38BDF8", fontWeight:700, fontSize:16 }}>{weatherSim.prob}</span>
            </div>
          </div>
        </Card>
        
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Rain Forecast (Next 24 Hours)</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weatherSim.chartData} margin={{ top:16, right:16, left:-16, bottom:0 }}>
                <defs><linearGradient id="rnG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35}/><stop offset="90%" stopColor="#3B82F6" stopOpacity={0.02}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill:"#64748B", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"} domain={[0,100]} />
                <Tooltip content={<ChartTip suffix="% rain" />} />
                <Area type="monotone" dataKey="pct" stroke="#3B82F6" strokeWidth={2.5} fill="url(#rnG)"
                  dot={({ cx,cy,payload }) => <g key={payload.time}><circle cx={cx} cy={cy} r={4} fill="#3B82F6"/><text x={cx} y={cy-10} textAnchor="middle" fill="#CBD5E1" fontSize={10} fontWeight={600}>{payload.pct}%</text></g>}
                  activeDot={{ r:6, fill:"#3B82F6", stroke:"#0D1F12", strokeWidth:2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <div style={{ display:"flex", alignItems:"center", gap:16, background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:14, padding:"16px 20px" }}>
            <div style={{ width:46, height:46, background:"rgba(74,222,128,0.12)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>⚠️</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#4ADE80", marginBottom:4 }}>Suggested Action</div>
              <div style={{ fontSize:13, color:"#CBD5E1" }}>{weatherSim.action}</div>
            </div>
          </div>
        </div>
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"18px 24px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Weather-Optimized Daily Itinerary & Route Plan</div>
          <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>AI recommendation customized for the local weather of {filter}</div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)" }}>
              {["Time", "Activity Type", "Target Entity", "Location", "Optimized Task Details"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", fontSize:10, color:"#64748B", fontWeight:700, textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weatherSim.schedule.map((task, i) => (
              <tr key={i} style={{ background: i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding:"12px 16px", fontSize:12, fontWeight:700, color:"#38BDF8", whiteSpace:"nowrap" }}>{task.time}</td>
                <td style={{ padding:"12px 16px", fontSize:11, fontWeight:600, color:task.type.includes("Retailer")?"#A855F7":task.type.includes("Demo")?"#EAB308":"#4ADE80", whiteSpace:"nowrap" }}>{task.type}</td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#F8FAFC" }}>{task.target}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{task.location}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:"#94A3B8" }}>{task.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center", justifyContent:"center", height:"100%", color:"#64748B" }}>
    <div style={{ fontSize:48 }}><Construction size={48}/></div>
    <div style={{ fontSize:20, fontWeight:700, color:"#F8FAFC" }}>{title}</div>
    <div style={{ fontSize:14 }}>Content will be added here later.</div>
  </div>
);

const REGIONAL_VISIT_DATA = {
  "Patna Region": [
    { id:1, name:"Ganga Agri Kendra", score:94.5, location:"Patna Tahsil, Patna", lastVisit:"36 days ago", stockRisk:"High Stock Risk", revenue:18500, why:["High order probability","Frequent buyer","Stock replenishment needed"], phone:"+91 94123 45678", x:80, y:60 },
    { id:2, name:"Kisan Seed Store", score:90.5, location:"Patna Tahsil, Patna", lastVisit:"7 days ago", stockRisk:"Critical Stock", revenue:15200, why:["Immediate restocking required","High purchase frequency"], phone:"+91 94123 45679", x:170, y:50 },
    { id:3, name:"Patel Agro Agency", score:85.0, location:"Danapur, Patna", lastVisit:"42 days ago", stockRisk:"Critical Stock", revenue:12000, why:["Low stock warning","Overdue payment follow-up"], phone:"+91 94123 45683", x:260, y:70 },
    { id:4, name:"Mahavir Fertilizers", score:76.3, location:"Patna Tahsil, Patna", lastVisit:"12 days ago", stockRisk:"Medium Risk", revenue:8700, why:["Seasonal demand increase","Good conversion chance"], phone:"+91 94123 45680", x:330, y:110 },
    { id:5, name:"Bharat Seeds", score:72.1, location:"Phulwari Sharif, Patna", lastVisit:"15 days ago", stockRisk:"High Stock Risk", revenue:9800, why:["Stock depletion warning","New product launch interest"], phone:"+91 94123 45684", x:290, y:170 },
    { id:6, name:"Ram Krishi Bhandar", score:64.3, location:"Patna Tahsil, Patna", lastVisit:"8 days ago", stockRisk:"Low Risk", revenue:5600, why:["Regular buyer","Maintain relationship"], phone:"+91 94123 45681", x:210, y:200 },
    { id:7, name:"Choudhary Fertilizers", score:58.4, location:"Fatuha, Patna", lastVisit:"29 days ago", stockRisk:"Low Risk", revenue:4200, why:["Routine check-in","Feedback collection"], phone:"+91 94123 45685", x:120, y:190 },
    { id:8, name:"Shiv Shakti Pesticides", score:52.0, location:"Danapur, Patna", lastVisit:"5 days ago", stockRisk:"Low Risk", revenue:3100, why:["New retailer onboarded","Catalog delivery"], phone:"+91 94123 45686", x:60, y:120 }
  ],
  "Jhansi Region": [
    { id:1, name:"Bundelkhand Agri Store", score:96.2, location:"Sipri Bazar, Jhansi", lastVisit:"33 days ago", stockRisk:"Critical Stock", revenue:22000, why:["High order probability","Restocking needed"], phone:"+91 94123 45701", x:70, y:50 },
    { id:2, name:"Jhansi Seed House", score:88.4, location:"Mauranipur, Jhansi", lastVisit:"10 days ago", stockRisk:"High Stock Risk", revenue:16500, why:["Frequent buyer","Payment reminder"], phone:"+91 94123 45702", x:160, y:70 },
    { id:3, name:"Veer Agro Agency", score:82.1, location:"Gwalior Road, Jhansi", lastVisit:"40 days ago", stockRisk:"Critical Stock", revenue:14000, why:["Low stock warning","No contact > 30 days"], phone:"+91 94123 45703", x:240, y:60 },
    { id:4, name:"Rani Laxmi Fertilizers", score:78.5, location:"Babina, Jhansi", lastVisit:"14 days ago", stockRisk:"Medium Risk", revenue:9500, why:["Seasonal demand","Bulk discount discussion"], phone:"+91 94123 45704", x:340, y:90 },
    { id:5, name:"Betwa Seed Corp", score:70.3, location:"Barua Sagar, Jhansi", lastVisit:"18 days ago", stockRisk:"High Stock Risk", revenue:8200, why:["Stock depletion warning"], phone:"+91 94123 45705", x:310, y:180 },
    { id:6, name:"Bundela Krishi Bhandar", score:65.0, location:"Sipri Bazar, Jhansi", lastVisit:"6 days ago", stockRisk:"Low Risk", revenue:6100, why:["Regular buyer","Feedback"], phone:"+91 94123 45706", x:220, y:190 },
    { id:7, name:"Orchha Fertilizers", score:56.1, location:"Orchha Gate, Jhansi", lastVisit:"25 days ago", stockRisk:"Low Risk", revenue:4800, why:["Routine visit"], phone:"+91 94123 45707", x:130, y:210 },
    { id:8, name:"Elite Pesticides", score:50.5, location:"Chitra Chauraha, Jhansi", lastVisit:"4 days ago", stockRisk:"Low Risk", revenue:3500, why:["Catalog update"], phone:"+91 94123 45708", x:60, y:130 }
  ],
  "Bhopal Region": [
    { id:1, name:"Raja Bhoj Agri Tech", score:95.8, location:"Kolar Road, Bhopal", lastVisit:"38 days ago", stockRisk:"Critical Stock", revenue:24000, why:["Restocking required","High purchase frequency"], phone:"+91 94123 45801", x:90, y:70 },
    { id:2, name:"MP Seeds & Pesticides", score:89.1, location:"MP Nagar, Bhopal", lastVisit:"8 days ago", stockRisk:"High Stock Risk", revenue:17200, why:["High order probability"], phone:"+91 94123 45802", x:180, y:60 },
    { id:3, name:"Satpura Agro Agency", score:84.5, location:"Bairagarh, Bhopal", lastVisit:"45 days ago", stockRisk:"Critical Stock", revenue:13500, why:["No contact > 40 days","Payment follow-up"], phone:"+91 94123 45803", x:250, y:80 },
    { id:4, name:"Vindhyachal Fertilizers", score:75.0, location:"Indrapuri, Bhopal", lastVisit:"11 days ago", stockRisk:"Medium Risk", revenue:10200, why:["Seasonal demand"], phone:"+91 94123 45804", x:320, y:100 },
    { id:5, name:"Narmada Crop Care", score:71.2, location:"Mandideep, Bhopal", lastVisit:"16 days ago", stockRisk:"High Stock Risk", revenue:8900, why:["Stock replenishment"], phone:"+91 94123 45805", x:300, y:160 },
    { id:6, name:"Malwa Krishi Bhandar", score:63.8, location:"MP Nagar, Bhopal", lastVisit:"9 days ago", stockRisk:"Low Risk", revenue:5800, why:["Routine contact"], phone:"+91 94123 45806", x:230, y:210 },
    { id:7, name:"Lake City Seeds", score:57.2, location:"Lalghati, Bhopal", lastVisit:"28 days ago", stockRisk:"Low Risk", revenue:4500, why:["Routine check-in"], phone:"+91 94123 45807", x:140, y:180 },
    { id:8, name:"Capital Fertilizers", score:51.5, location:"Govindpura, Bhopal", lastVisit:"3 days ago", stockRisk:"Low Risk", revenue:2900, why:["Catalog update"], phone:"+91 94123 45808", x:70, y:130 }
  ]
};;


const riskTrendData = [
  { date:"02 Jun", High:40, Medium:20, Low:30 },
  { date:"03 Jun", High:45, Medium:25, Low:32 },
  { date:"04 Jun", High:38, Medium:22, Low:28 },
  { date:"05 Jun", High:30, Medium:18, Low:25 },
  { date:"06 Jun", High:25, Medium:15, Low:20 },
  { date:"07 Jun", High:28, Medium:18, Low:22 },
  { date:"08 Jun", High:22, Medium:12, Low:18 },
  { date:"09 Jun", High:20, Medium:15, Low:24 }
];

const riskOverviewData = [
  { name:"Low Risk", value:24, color:"#4ADE80" },
  { name:"Medium Risk", value:15, color:"#F97316" },
  { name:"High Risk", value:8, color:"#EF4444" },
];

const riskCategoryData = [
  { name: "Pest & Disease", value: 16, pct: 34, color: "#EF4444" },
  { name: "Weather", value: 12, pct: 26, color: "#F97316" },
  { name: "Crop Health", value: 8, pct: 17, color: "#EAB308" },
  { name: "Market", value: 6, pct: 13, color: "#84CC16" },
  { name: "Supply Chain", value: 5, pct: 10, color: "#3B82F6" }
];

// ─── RISK ANALYZER PAGE ───────────────────────────────────────────────────────
const RiskAnalyzerPage = () => {
  const [filter, setFilter] = useState("Last 7 Days");
  const [selectedRisk, setSelectedRisk] = useState("All");

  const filteredAlerts = selectedRisk === "All" ? riskAlertsData : riskAlertsData.filter(r => r.severity === selectedRisk);

  const riskLegendMap = { "Low Risk": "Low", "Medium Risk": "Medium", "High Risk": "High" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader icon={<Search size={22}/>} title="Risk Analyzer" sub="Monitor and mitigate agricultural risks"
        filterOptions={["Last 7 Days","Last 30 Days","This Season"]} filter={filter} onFilter={setFilter} />

      {/* Overview Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)" label="Overall Risk Index" value="High" valueColor="#EF4444" sub="vs Medium last week" />
        <KpiCard icon={<Wheat size={22}/>} iconBg="rgba(249,115,22,0.2)" label="Impacted Area" value="3,200" valueColor="#F97316" sub="Acres under high risk" />
        <KpiCard icon={<Banknote size={22}/>} iconBg="rgba(234,179,8,0.2)" label="Value at Risk" value="₹2.4L" valueColor="#EAB308" sub="Est. potential loss" />
        <KpiCard icon={<ShieldAlert size={22}/>} iconBg="rgba(74,222,128,0.2)" label="Mitigated Risk" value="45%" valueColor="#4ADE80" sub="Resolved this week" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Risk Trend Over Time</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={riskTrendData} margin={{ top:5, right:20, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"#94A3B8", fontSize:11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, fontSize:12 }} />
              <Line type="monotone" dataKey="High" stroke="#EF4444" strokeWidth={selectedRisk === "All" || selectedRisk === "High" ? 2 : 0.5} strokeOpacity={selectedRisk === "All" || selectedRisk === "High" ? 1 : 0.25} dot={false} />
              <Line type="monotone" dataKey="Medium" stroke="#F97316" strokeWidth={selectedRisk === "All" || selectedRisk === "Medium" ? 2 : 0.5} strokeOpacity={selectedRisk === "All" || selectedRisk === "Medium" ? 1 : 0.25} dot={false} />
              <Line type="monotone" dataKey="Low" stroke="#4ADE80" strokeWidth={selectedRisk === "All" || selectedRisk === "Low" ? 2 : 0.5} strokeOpacity={selectedRisk === "All" || selectedRisk === "Low" ? 1 : 0.25} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Risk Distribution</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskOverviewData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none"
                onClick={(data) => {
                  const key = riskLegendMap[data?.name] || null;
                  if (key) setSelectedRisk(r => r === key ? "All" : key);
                }}
                style={{ cursor: "pointer" }}
              >
                {riskOverviewData.map((entry, index) => {
                  const key = riskLegendMap[entry.name];
                  const isDimmed = selectedRisk !== "All" && selectedRisk !== key;
                  return <Cell key={`cell-${index}`} fill={isDimmed ? `${entry.color}30` : entry.color} />;
                })}
              </Pie>
              <Tooltip contentStyle={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
            {riskOverviewData.map(d => {
              const key = riskLegendMap[d.name];
              const isActive = selectedRisk === key;
              return (
                <div 
                  key={d.name} 
                  onClick={() => setSelectedRisk(r => r === key ? "All" : key)}
                  style={{ 
                    display:"flex", alignItems:"center", gap:6, fontSize:11, cursor:"pointer",
                    color: isActive ? "#4ADE80" : "#94A3B8",
                    padding: "5px 10px",
                    background: isActive ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? "#4ADE80" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 7, transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <div style={{ 
                    width:10, height:10, borderRadius:2, background:d.color,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:7, color:"#0D1F12", fontWeight:900
                  }}>
                    {isActive && "✓"}
                  </div>
                  {d.name} ({d.value}%)
                </div>
              );
            })}
            {selectedRisk !== "All" && (
              <button onClick={() => setSelectedRisk("All")} style={{ fontSize:10, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"3px 8px", cursor:"pointer" }}>
                Clear ✕
              </button>
            )}
          </div>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Top Risk Categories</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {riskCategoryData.map(d=>(
              <div key={d.name}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                  <span style={{ color:"#CBD5E1" }}>{d.name}</span>
                  <span style={{ color:d.color, fontWeight:700 }}>{d.pct}%</span>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3 }}>
                  <div style={{ height:"100%", background:d.color, width:`${d.pct}%`, borderRadius:3 }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding:0, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>
              Active Risk Alerts {selectedRisk !== "All" && <span style={{ fontSize:11, color:"#4ADE80", background:"rgba(74,222,128,0.12)", borderRadius:5, padding:"2px 8px", marginLeft:8 }}>{selectedRisk} Risk</span>}
            </div>
            {selectedRisk !== "All" && (
              <button onClick={() => setSelectedRisk("All")} style={{ fontSize:11, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>
                Clear Filter ✕
              </button>
            )}
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                {["Risk Alert", "Category", "Location", "Impact", "Date"].map(h=>(
                  <th key={h} style={{ padding:"10px 16px", fontSize:11, color:"#64748B", fontWeight:600, textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:"24px", textAlign:"center", color:"#64748B", fontSize:13 }}>No risk alerts found for the selected severity.</td></tr>
              ) : filteredAlerts.map((r,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#F8FAFC", display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:r.severity==="High"?"#EF4444":r.severity==="Medium"?"#F97316":"#4ADE80" }}></div>
                      {r.risk}
                    </div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{r.desc}</div>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{r.category}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#CBD5E1" }}>{r.location}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:r.severity==="High"?"#EF4444":r.severity==="Medium"?"#F97316":"#4ADE80", fontWeight:600 }}>{r.impact}</td>
                  <td style={{ padding:"12px 16px", fontSize:11, color:"#64748B" }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Mitigation Suggestions</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
          {[
            { title:"Deploy Bollworm Traps", desc:"Dispatch 500 traps to Patna Tehsil immediately.", icon:"🪲", color:"#EF4444", bg:"rgba(239,68,68,0.1)" },
            { title:"Pre-Rain Harvesting", desc:"Alert farmers to harvest mature crops before rain.", icon:<CloudRain size={18}/>, color:"#38BDF8", bg:"rgba(56,189,248,0.1)" },
            { title:"Distribute Zinc Supplements", desc:"Provide subsidized zinc sprays to affected regions.", icon:"🧪", color:"#EAB308", bg:"rgba(234,179,8,0.1)" }
          ].map(s=>(
            <div key={s.title} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"16px", background:"rgba(255,255,255,0.03)", borderRadius:12, border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:s.color, marginBottom:4 }}>{s.title}</div>
                <div style={{ fontSize:11, color:"#94A3B8", lineHeight:1.5 }}>{s.desc}</div>
                <div style={{ fontSize:10, color:"#4ADE80", marginTop:8, fontWeight:600, cursor:"pointer" }}>Take Action →</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
const riskAlertsData = [
  { risk:"Bollworm Outbreak", desc:"High infestation in cotton crops", category:"Pest & Disease", severity:"High", location:"Patna Tehsil (24 fields)", impact:"High Yield Loss", date:"09 Jun 2026" },
  { risk:"Heavy Rainfall Alert", desc:"Excessive rainfall expected", category:"Weather", severity:"High", location:"Patna, Danapur (12 areas)", impact:"Crop Damage", date:"09 Jun 2026" },
  { risk:"Nutrient Deficiency", desc:"Nitrogen deficiency detected", category:"Crop Health", severity:"Medium", location:"Phulwari Sharif (18 fields)", impact:"Medium Yield Loss", date:"08 Jun 2026" },
  { risk:"Price Volatility", desc:"Cotton price fluctuating", category:"Market", severity:"Medium", location:"Patna Region", impact:"Profitability", date:"07 Jun 2026" },
  { risk:"Stock Shortage Risk", desc:"Pesticide stock below threshold", category:"Supply Chain", severity:"Low", location:"Kisan Seed Store (Retailer)", impact:"Low Availability", date:"07 Jun 2026" }
];

// ─── AI RECOMMENDATIONS PAGE ──────────────────────────────────────────────────
const AiRecommendationsPage = () => {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
        <button style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, cursor:"pointer" }}>&lt; Back to Recommendations</button>
      </div>

      <Card style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#F97316", background:"rgba(249,115,22,0.1)", padding:"4px 10px", borderRadius:6 }}>Medium Priority</span>
          <div style={{ width:60, height:60, borderRadius:"50%", border:"4px solid #EAB308", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", lineHeight:1 }}>75</span>
            <span style={{ fontSize:9, color:"#94A3B8" }}>Score</span>
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:"#F8FAFC" }}>Cotton — Nutrient Advisory</div>
            <div style={{ fontSize:12, color:"#94A3B8", marginTop:4 }}>Patna Tehsil, Patna  |  Farmer cluster near Kisan Seed Store (Patna #1)</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:40 }}>
          <div>
            <div style={{ fontSize:12, color:"#94A3B8" }}>AI Confidence</div>
            <div style={{ fontSize:20, fontWeight:700, color:"#4ADE80", marginTop:4 }}>92%</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#94A3B8" }}>Recommended on</div>
            <div style={{ fontSize:15, color:"#F8FAFC", marginTop:4, display:"flex", alignItems:"center", gap:6 }}><Calendar size={15}/> 09 Jun 2026</div>
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><span><User size={20}/></span> Recommendation For</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"Field Executive", value:"Amit Sharma", icon:<User size={14}/> },
              { label:"Retailer", value:"Kisan Seed Store (Patna #1)", icon:<Store size={18}/> },
              { label:"Location", value:"Patna Tehsil, Patna", icon:<MapPin size={14}/> },
              { label:"Affected Crop", value:"Cotton", icon:<Wheat size={18}/> },
            ].map(item=>(
              <div key={item.label} style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.05)", paddingBottom:12 }}>
                <div style={{ width:150, fontSize:13, color:"#94A3B8", display:"flex", alignItems:"center", gap:8 }}><span>{item.icon}</span> {item.label}</div>
                <div style={{ fontSize:13, color:"#F8FAFC", fontWeight:500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><span><Lightbulb size={16}/></span> Why AI Recommended This?</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              "Whitefly and Bollworm risk detected in nearby fields",
              "Cotton crop is in Tillering stage - high vulnerability period",
              "Weather conditions (28°C, Low Humidity) favor pest spread",
              "Ridomil Gold is available in retailer stock",
              "Similar recommendations showed 87% success rate",
              <span key="rev">Estimated revenue opportunity: <span style={{color:"#4ADE80"}}>₹12,500</span></span>
            ].map((text,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <span style={{ color:"#4ADE80", marginTop:2 }}>✓</span>
                <span style={{ fontSize:13, color:"#CBD5E1", lineHeight:1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}><span><CheckSquare size={16}/></span> Recommended Action</div>
        <div style={{ display:"flex", gap:20, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>
          
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <div style={{ width:60, height:80, background:"#fff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:30, height:50, background:"linear-gradient(#4ADE80,#16A34A)", borderRadius:4 }}></div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#94A3B8" }}>Recommended Product</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#F8FAFC", marginTop:2 }}>Ridomil Gold</div>
              <div style={{ fontSize:11, color:"#94A3B8", marginTop:6 }}>Dosage</div>
              <div style={{ fontSize:13, color:"#F8FAFC" }}>150 ml/acre</div>
            </div>
          </div>
          
          <div style={{ borderLeft:"1px solid rgba(255,255,255,0.1)", paddingLeft:20 }}>
            <div style={{ fontSize:11, color:"#94A3B8" }}>Purpose</div>
            <div style={{ fontSize:14, fontWeight:500, color:"#F8FAFC", marginTop:4 }}>Effective control of<br/>Bollworm & Whitefly</div>
          </div>
          
          <div style={{ borderLeft:"1px solid rgba(255,255,255,0.1)", paddingLeft:20 }}>
            <div style={{ fontSize:11, color:"#94A3B8" }}>Stock Status</div>
            <div style={{ fontSize:14, fontWeight:500, color:"#4ADE80", marginTop:4 }}>Available</div>
            <div style={{ fontSize:11, color:"#94A3B8", background:"rgba(255,255,255,0.05)", padding:"2px 8px", borderRadius:4, marginTop:6, display:"inline-block" }}>150 Units</div>
          </div>

          <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16, flex:1 }}>
            <div style={{ fontSize:24, color:"#4ADE80" }}><Calendar size={24}/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"#4ADE80", fontWeight:600 }}>Next Best Action</div>
              <div style={{ fontSize:15, color:"#F8FAFC", fontWeight:700, marginTop:2 }}>Visit Kisan Seed Store (Patna #1)</div>
              <div style={{ fontSize:13, color:"#CBD5E1", marginTop:2 }}>Within 3 days</div>
            </div>
            <button style={{ background:"rgba(74,222,128,0.2)", border:"none", borderRadius:8, width:40, height:40, color:"#4ADE80", cursor:"pointer" }}><Calendar size={24}/></button>
          </div>
          
        </div>

        <div style={{ display:"flex", gap:16, marginTop:30, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:20 }}>
          <button style={{ flex:1, background:"#16A34A", color:"#fff", border:"none", borderRadius:8, padding:"14px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"center", gap:8 }}><span><Check size={14}/></span> Apply Recommendation</button>
          <button style={{ flex:1, background:"rgba(255,255,255,0.05)", color:"#F8FAFC", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"14px", fontSize:14, fontWeight:600, cursor:"pointer" }}>Dismiss</button>
          <button style={{ flex:1, background:"transparent", color:"#CBD5E1", border:"1px dashed rgba(255,255,255,0.2)", borderRadius:8, padding:"14px", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", justifyContent:"center", gap:8 }}><span><ExternalLink size={14}/></span> Share Recommendation</button>
        </div>
      </Card>
    </div>
  );
};

// ─── VISIT PLANNER PAGE ───────────────────────────────────────────────────────
const VisitPlannerPage = () => {
  const [region, setRegion] = useState("Patna Region");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [date, setDate] = useState("09 Jun 2026");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [completedVisits, setCompletedVisits] = useState([3, 8]); // Default pre-completed IDs (Mahavir & Shiv Shakti)
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeStarted, setRouteStarted] = useState(false);
  const [toast, setToast] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullMapModal, setShowFullMapModal] = useState(false);
  const [userLoc, setUserLoc] = useState({ x: 200, y: 130 });

  const regionRef = useRef(null);
  const dateRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setShowRegionDropdown(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setShowDateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const dataset = REGIONAL_VISIT_DATA[region] || REGIONAL_VISIT_DATA["Patna Region"];

  // Helper to show a temporary toast notification
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper to filter data based on tab selection
  const getFilteredData = (data, filter) => {
    return data.filter(item => {
      if (filter === "All") return true;
      if (filter === "High Priority") return item.score >= 75;
      if (filter === "High Revenue") return item.revenue >= 9000;
      if (filter === "Low Stock") return item.stockRisk === "Critical Stock" || item.stockRisk === "High Stock Risk";
      if (filter === "No Visit > 30 Days") {
        const days = parseInt(item.lastVisit);
        return !isNaN(days) && days > 30;
      }
      if (filter === "Follow-up") {
        return item.why.some(w => w.toLowerCase().includes("relationship") || w.toLowerCase().includes("routine") || w.toLowerCase().includes("feedback") || w.toLowerCase().includes("catalog"));
      }
      return true;
    });
  };

  const filteredVisits = getFilteredData(dataset, activeFilter);

  const nextStopIndex = filteredVisits.findIndex(v => !completedVisits.includes(v.id));
  const nextStop = nextStopIndex !== -1 ? filteredVisits[nextStopIndex] : null;
  const lastCompletedVisit = nextStopIndex > 0 
    ? filteredVisits[nextStopIndex - 1] 
    : (nextStopIndex === -1 && filteredVisits.length > 0 ? filteredVisits[filteredVisits.length - 1] : null);

  // Dynamically update GPS coordinates based on last completed visit
  useEffect(() => {
    let targetLoc = { x: 200, y: 130 };
    if (routeStarted && lastCompletedVisit) {
      targetLoc = { x: lastCompletedVisit.x, y: lastCompletedVisit.y };
    } else if (filteredVisits.length > 0) {
      targetLoc = { x: filteredVisits[0].x, y: filteredVisits[0].y };
    }

    // Only update state if the coordinates have actually changed to prevent infinite re-render loops
    setUserLoc(current => {
      if (current.x === targetLoc.x && current.y === targetLoc.y) {
        return current;
      }
      return targetLoc;
    });
  }, [routeStarted, lastCompletedVisit, filteredVisits]);

  // Calculate stats dynamically
  const totalRevenue = dataset.reduce((acc, curr) => acc + curr.revenue, 0);
  const completedRevenue = completedVisits.reduce((acc, id) => {
    const item = dataset.find(v => v.id === id);
    return acc + (item ? item.revenue : 0);
  }, 0);
  
  const targetRevenue = Math.round(totalRevenue * 0.62); // ~62% of total potential is target
  const completedPct = dataset.length > 0 ? Math.round((completedVisits.length / dataset.length) * 100) : 0;

  // Region specific routing stats
  const routeStats = {
    "Patna Region": { distance: 156, time: "6h 20m" },
    "Jhansi Region": { distance: 184, time: "7h 10m" },
    "Bhopal Region": { distance: 142, time: "5h 45m" }
  }[region] || { distance: 150, time: "6h 00m" };

  const activeDistance = filteredVisits.length === dataset.length 
    ? routeStats.distance 
    : Math.round(routeStats.distance * (filteredVisits.length / dataset.length));

  // Calculate cumulative distances along the route dynamically based on coordinates
  const getDistance = (p1, p2) => {
    if (!p1 || !p2) return 0;
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const cumulativeDistances = [];
  let currentSvgDist = 0;
  filteredVisits.forEach((v, idx) => {
    if (idx === 0) {
      cumulativeDistances.push(0);
    } else {
      currentSvgDist += getDistance(filteredVisits[idx - 1], v);
      cumulativeDistances.push(currentSvgDist);
    }
  });

  const totalSvgDist = currentSvgDist || 1;
  const scale = activeDistance / totalSvgDist;
  const scaledDistances = cumulativeDistances.map(d => Math.round(d * scale));

  const totalMin = {
    "Patna Region": 380,
    "Jhansi Region": 430,
    "Bhopal Region": 345
  }[region] || 360;
  
  const activeMin = Math.round((totalMin * filteredVisits.length) / dataset.length) || 30;
  const activeTime = `${Math.floor(activeMin / 60)}h ${activeMin % 60}m`;

  const handleOptimize = () => {
    setIsOptimizing(true);
    triggerToast("AI Engine: Recalculating optimized route path...");
    setTimeout(() => {
      setIsOptimizing(false);
      triggerToast("AI Route optimization completed successfully!");
    }, 1200);
  };
  const handleStartRoute = () => {
    if (routeStarted) {
      setRouteStarted(false);
      triggerToast("Route stopped. Progress saved.");
    } else {
      setRouteStarted(true);
      const targetName = nextStop ? nextStop.name : "first destination";
      triggerToast(`Route started! Head towards ${targetName}.`);
    }
  };

  const handleSimulateNextStop = () => {
    if (!routeStarted) {
      setRouteStarted(true);
      const targetName = nextStop ? nextStop.name : "first destination";
      triggerToast(`Route started! Head towards ${targetName}.`);
      return;
    }
    if (nextStop) {
      setCompletedVisits(p => [...p, nextStop.id]);
      triggerToast(`Arrived at ${nextStop.name}! ₹${nextStop.revenue.toLocaleString()} collected.`);
      if (nextStopIndex === filteredVisits.length - 1) {
        setTimeout(() => {
          setRouteStarted(false);
          triggerToast("Congratulations! All stops on optimized route completed.");
        }, 1500);
      }
    } else {
      triggerToast("All stops completed! Route finished.");
      setRouteStarted(false);
    }
  };

  const handleToggleVisit = (v) => {
    if (completedVisits.includes(v.id)) {
      setCompletedVisits(p => p.filter(id => id !== v.id));
      triggerToast(`Removed check-in at ${v.name}`);
    } else {
      setCompletedVisits(p => [...p, v.id]);
      triggerToast(`Checked in at ${v.name}! ₹${v.revenue.toLocaleString()} added to progress.`);
      // Auto complete route if this was the last incomplete stop
      const remainingIncomplete = filteredVisits.filter(item => !completedVisits.includes(item.id) && item.id !== v.id);
      if (remainingIncomplete.length === 0 && routeStarted) {
        setTimeout(() => {
          setRouteStarted(false);
          triggerToast("All visits checked-in! Optimized route completed.");
        }, 1500);
      }
    }
  };

  const filterPills = [
    { key: "All", label: `All (${dataset.length})` },
    { key: "High Priority", label: `High Priority (${getFilteredData(dataset, "High Priority").length})` },
    { key: "High Revenue", label: `High Revenue (${getFilteredData(dataset, "High Revenue").length})` },
    { key: "Low Stock", label: `Low Stock (${getFilteredData(dataset, "Low Stock").length})` },
    { key: "No Visit > 30 Days", label: `No Visit > 30 Days (${getFilteredData(dataset, "No Visit > 30 Days").length})` },
    { key: "Follow-up", label: `Follow-up (${getFilteredData(dataset, "Follow-up").length})` }
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, position: "relative" }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10, 24, 15, 0.95)",
          border: "1px solid #4ADE80",
          borderRadius: 10,
          padding: "12px 24px",
          color: "#4ADE80",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backdropFilter: "blur(8px)",
          animation: "slideDown 0.3s ease"
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slideDown {
              from { transform: translate(-50%, -20px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
            .custom-scroll::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
            .custom-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scroll::-webkit-scrollbar-thumb {
              background: rgba(74, 222, 128, 0.25);
              border-radius: 4px;
            }
            .custom-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(74, 222, 128, 0.45);
            }
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .animate-shimmer {
              animation: shimmer 2s infinite linear;
            }
            @keyframes flow {
              to {
                stroke-dashoffset: -13;
              }
            }
            .flow-line {
              animation: flow 1.2s infinite linear;
            }
          ` }} />
          <Leaf size={16} /> {toast}
        </div>
      )}

      {/* Selectors Header */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:4 }}>
        <div style={{ display:"flex", gap:12 }}>
          {/* Region Selector */}
          <div ref={regionRef} style={{ position: "relative" }}>
            <button 
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, display:"flex", alignItems:"center", gap:8, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              <MapPin size={14}/> {region} ▾
            </button>
            {showRegionDropdown && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: "rgba(10,24,15,0.98)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, zIndex: 100, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.8)" }}>
                {["Patna Region", "Jhansi Region", "Bhopal Region"].map(r => (
                  <div key={r} 
                    onClick={() => { setRegion(r); setCompletedVisits([]); setRouteStarted(false); setIsExpanded(false); setShowRegionDropdown(false); triggerToast(`Switched view to ${r}`); }}
                    style={{ padding: "10px 18px", color: region === r ? "#4ADE80" : "#CBD5E1", background: region === r ? "rgba(74,222,128,0.08)" : "transparent", cursor: "pointer", transition: "all 0.15s", fontSize: 12, whiteSpace: "nowrap", fontWeight: region === r ? 700 : 400 }}
                    onMouseEnter={e => { if (region !== r) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { if (region !== r) e.currentTarget.style.background = "transparent"; }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          <div ref={dateRef} style={{ position: "relative" }}>
            <button 
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, display:"flex", alignItems:"center", gap:8, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              <Calendar size={14}/> {date} ▾
            </button>
            {showDateDropdown && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: "rgba(10,24,15,0.98)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, zIndex: 100, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.8)" }}>
                {["09 Jun 2026", "10 Jun 2026", "11 Jun 2026"].map(d => (
                  <div key={d} 
                    onClick={() => { setDate(d); setCompletedVisits([]); setRouteStarted(false); setIsExpanded(false); setShowDateDropdown(false); triggerToast(`Date set to ${d}`); }}
                    style={{ padding: "10px 18px", color: date === d ? "#4ADE80" : "#CBD5E1", background: date === d ? "rgba(74,222,128,0.08)" : "transparent", cursor: "pointer", transition: "all 0.15s", fontSize: 12, whiteSpace: "nowrap", fontWeight: date === d ? 700 : 400 }}
                    onMouseEnter={e => { if (date !== d) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { if (date !== d) e.currentTarget.style.background = "transparent"; }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Panel */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr) auto", gap:14 }}>
        <div style={{ background:"rgba(74,222,128,0.03)", border:"1px solid rgba(74,222,128,0.08)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:22, color: "#4ADE80" }}><Users size={22}/></div>
          <div><div style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase", fontWeight:700, letterSpacing:0.5 }}>Visits Planned</div><div style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", marginTop:2 }}>{dataset.length} <span style={{fontSize:11, fontWeight:400, color:"#64748B"}}>Today</span></div></div>
        </div>
        <div style={{ background:"rgba(74,222,128,0.03)", border:"1px solid rgba(74,222,128,0.08)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:22, color: "#4ADE80" }}><IndianRupee size={22}/></div>
          <div><div style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase", fontWeight:700, letterSpacing:0.5 }}>Revenue Potential</div><div style={{ fontSize:20, fontWeight:800, color:"#4ADE80", marginTop:2 }}>₹{totalRevenue.toLocaleString()} <span style={{fontSize:11, fontWeight:400, color:"#64748B"}}>Today</span></div></div>
        </div>
        <div style={{ background:"rgba(74,222,128,0.03)", border:"1px solid rgba(74,222,128,0.08)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:22, color: "#4ADE80" }}><CornerDownRight size={22}/></div>
          <div><div style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase", fontWeight:700, letterSpacing:0.5 }}>Total Distance</div><div style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", marginTop:2 }}>{activeDistance} km <span style={{fontSize:11, fontWeight:400, color:"#64748B"}}>Optimized</span></div></div>
        </div>
        <div style={{ background:"rgba(74,222,128,0.03)", border:"1px solid rgba(74,222,128,0.08)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:22, color: "#4ADE80" }}><Clock size={22}/></div>
          <div><div style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase", fontWeight:700, letterSpacing:0.5 }}>Estimated Time</div><div style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", marginTop:2 }}>{activeTime} <span style={{fontSize:11, fontWeight:400, color:"#64748B"}}>On the road</span></div></div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, width: 170 }}>
          <button 
            onClick={handleStartRoute}
            style={{ 
              background: routeStarted ? "rgba(239,68,68,0.15)" : "#16A34A", 
              color: routeStarted ? "#EF4444" : "#fff", 
              border: routeStarted ? "1px solid rgba(239,68,68,0.3)" : "none", 
              borderRadius:8, padding:"10px 16px", fontSize:13, fontWeight:700, cursor:"pointer", flex:1, 
              display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition: "all 0.2s" 
            }}
            onMouseEnter={e => { if(!routeStarted) e.currentTarget.style.background = "#15803d"; }}
            onMouseLeave={e => { if(!routeStarted) e.currentTarget.style.background = "#16A34A"; }}
          >
            {routeStarted ? <div style={{ width:8, height:8, borderRadius:"50%", background:"#EF4444", animation:"ping 1.2s infinite" }}></div> : <Play size={14} />} 
            {routeStarted ? "On the Road" : "Start Route"}
          </button>
          {routeStarted ? (
            <button 
              onClick={handleSimulateNextStop}
              style={{ 
                background: "rgba(59,130,246,0.15)", 
                color: "#60A5FA", 
                border: "1px solid rgba(59,130,246,0.4)", 
                borderRadius:8, padding:"10px 16px", fontSize:12, fontWeight:700, cursor:"pointer", flex:1, 
                display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition: "all 0.15s",
                boxShadow: "0 0 10px rgba(59,130,246,0.15)"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.15)"}
            >
              🚀 Simulate Next
            </button>
          ) : (
            <button 
              onClick={handleOptimize}
              style={{ 
                background:"rgba(255,255,255,0.04)", color:"#F8FAFC", 
                border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, 
                padding:"10px 16px", fontSize:13, fontWeight:600, cursor:"pointer", flex:1, 
                display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition: "all 0.15s" 
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.background = "rgba(74,222,128,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <RefreshCw size={14} /> Optimize Again
            </button>
          )}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.85fr 1.15fr", gap:20 }}>
        {/* Left Column: Filter Pills + List */}
        <div>
          {/* Filters */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {filterPills.map((pill) => {
              const isActive = activeFilter === pill.key;
              return (
                <button 
                  key={pill.key} 
                  onClick={() => setActiveFilter(pill.key)} 
                  style={{ 
                    background: isActive ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)", 
                    color: isActive ? "#4ADE80" : "#CBD5E1", 
                    border: `1px solid ${isActive ? "#4ADE80" : "rgba(255,255,255,0.08)"}`, 
                    borderRadius:20, padding:"6px 14px", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.15s",
                    display: "flex", alignItems: "center", gap: 5
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {isActive && "✓"} {pill.label}
                </button>
              );
            })}
          </div>

          {/* Visit Cards List */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {isOptimizing ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, background:"rgba(255,255,255,0.02)", borderRadius:16, border:"1px solid rgba(255,255,255,0.05)", gap:14 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid rgba(74,222,128,0.1)", borderTopColor:"#4ADE80", animation:"spin 1s linear infinite" }}></div>
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                  @keyframes ping {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    80%, 100% { transform: scale(1.6); opacity: 0; }
                  }
                  @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                  }
                ` }} />
                <div style={{ color:"#CBD5E1", fontSize:14, fontWeight:600 }}>AI Route Optimization in progress...</div>
                <div style={{ color:"#64748B", fontSize:11 }}>Calculating shortest path using Sales-Revenue density</div>
              </div>
            ) : filteredVisits.length === 0 ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:200, background:"rgba(255,255,255,0.01)", borderRadius:16, border:"1px solid rgba(255,255,255,0.05)", color: "#64748B", fontSize:13 }}>
                No visits found matching the selected filter.
              </div>
            ) : (
              <>
                {filteredVisits.slice(0, isExpanded ? undefined : 4).map((v, i) => {
                  const isCompleted = completedVisits.includes(v.id);
                  const isNext = routeStarted && nextStop && nextStop.id === v.id;
                  return (
                    <Card 
                      key={v.id} 
                      style={{ 
                        padding:"16px", display:"flex", gap:16, alignItems:"center", 
                        background: isCompleted 
                          ? "rgba(255,255,255,0.01)" 
                          : isNext 
                            ? "rgba(59,130,246,0.03)" 
                            : i===0||i===1 
                              ? "rgba(74,222,128,0.03)" 
                              : "rgba(255,255,255,0.02)", 
                        borderColor: isCompleted 
                          ? "rgba(255,255,255,0.04)" 
                          : isNext 
                            ? "#3B82F6" 
                            : i===0||i===1 
                              ? "rgba(74,222,128,0.2)" 
                              : "rgba(255,255,255,0.07)",
                        boxShadow: isNext ? "0 0 15px rgba(59,130,246,0.15)" : "none",
                        opacity: isCompleted ? 0.65 : 1,
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ 
                        width:62, height:62, borderRadius:"50%", 
                        border:`3.5px solid ${isCompleted ? "#64748B" : isNext ? "#3B82F6" : v.score>90?"#4ADE80":v.score>70?"#EAB308":"#F97316"}`, 
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 
                      }}>
                        <span style={{ fontSize:18, fontWeight:800, color:"#F8FAFC", lineHeight:1 }}>{v.score}</span>
                        <span style={{ fontSize:8, color:"#94A3B8" }}>AI Score</span>
                      </div>
                      
                      <div style={{ flex:1.2 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                          <span style={{ background: isCompleted ? "#475569" : isNext ? "#2563EB" : "#4ADE80", color: isCompleted ? "#CBD5E1" : "#fff", fontSize:10, fontWeight:800, padding:"2px 6px", borderRadius:4 }}>{i+1}</span>
                          <span style={{ fontSize:15, fontWeight:700, color:"#F8FAFC", textDecoration: isCompleted ? "line-through" : "none" }}>{v.name}</span>
                          {isNext && (
                            <span style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60A5FA", fontSize:8, fontWeight:800, padding:"2px 8px", borderRadius:4, animation:"pulse 1.5s infinite" }}>
                              NEXT STOP
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize:12, color:"#94A3B8", marginTop:4, display:"flex", alignItems:"center", gap:4 }}><MapPin size={11}/> {v.location}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
                          <div style={{ fontSize:11, color:"#64748B" }}>Last Visit: {v.lastVisit}</div>
                          <div style={{ fontSize:9, padding:"2px 6px", borderRadius:4, background: v.stockRisk.includes("Critical")?"rgba(239,68,68,0.15)":v.stockRisk.includes("High")?"rgba(249,115,22,0.15)":v.stockRisk.includes("Medium")?"rgba(234,179,8,0.15)":"rgba(74,222,128,0.15)", color: v.stockRisk.includes("Critical")?"#EF4444":v.stockRisk.includes("High")?"#F97316":v.stockRisk.includes("Medium")?"#EAB308":"#4ADE80", fontWeight:600 }}>{v.stockRisk}</div>
                        </div>
                      </div>

                      <div style={{ flex:0.9, borderLeft:"1px solid rgba(255,255,255,0.06)", paddingLeft:14 }}>
                        <div style={{ fontSize:11, color:"#94A3B8" }}>Revenue</div>
                        <div style={{ fontSize:15, fontWeight:700, color: isCompleted ? "#94A3B8" : isNext ? "#60A5FA" : "#4ADE80", marginTop:2 }}>₹{v.revenue.toLocaleString()}</div>
                      </div>

                      <div style={{ flex:1.4, borderLeft:"1px solid rgba(255,255,255,0.06)", paddingLeft:14 }}>
                        <div style={{ fontSize:11, color:"#94A3B8", marginBottom:4 }}>Why Visit?</div>
                        {v.why.map(w=><div key={w} style={{ fontSize:11, color:"#CBD5E1", display:"flex", alignItems:"flex-start", gap:4, marginBottom:2 }}><span style={{color: isCompleted ? "#64748B" : isNext ? "#60A5FA" : "#4ADE80"}}>•</span> {w}</div>)}
                      </div>

                      <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                        <button 
                          onClick={() => handleToggleVisit(v)}
                          style={{ 
                            background: isCompleted ? "rgba(74,222,128,0.12)" : isNext ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)", 
                            border: `1px solid ${isCompleted ? "#4ADE80" : isNext ? "#3B82F6" : "rgba(255,255,255,0.08)"}`, 
                            borderRadius:6, padding:"6px 12px", 
                            color: isCompleted ? "#4ADE80" : isNext ? "#60A5FA" : "#CBD5E1", 
                            fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={e => { if(!isCompleted) e.currentTarget.style.borderColor = isNext ? "#60A5FA" : "#4ADE80"; }}
                          onMouseLeave={e => { if(!isCompleted) e.currentTarget.style.borderColor = isNext ? "#3B82F6" : "rgba(255,255,255,0.08)"; }}
                        >
                          {isCompleted ? "✓ Visited" : isNext ? "Arrived?" : "Check-in"} <span style={{fontSize:9}}>⋮</span>
                        </button>
                        <div style={{ display:"flex", gap:6 }}>
                          {/* Interactive Action Buttons */}
                          <button 
                            onClick={() => window.open(`tel:${v.phone}`)}
                            style={{ width:26, height:26, borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#F8FAFC", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.borderColor = "#4ADE80"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                            title="Call Store"
                          >
                            📞
                          </button>
                          <button 
                            onClick={() => window.open(`https://wa.me/${v.phone.replace(/[^0-9]/g, "")}`)}
                            style={{ width:26, height:26, borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#F8FAFC", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.borderColor = "#4ADE80"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                            title="Send WhatsApp Message"
                          >
                            💬
                          </button>
                          <button 
                            onClick={() => triggerToast(`Directions to ${v.name} loaded in navigation.`)}
                            style={{ width:26, height:26, borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#F8FAFC", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.borderColor = "#4ADE80"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                            title="Get Directions"
                          >
                            ↗️
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {filteredVisits.length > 4 && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ 
                      background:"rgba(255,255,255,0.03)", color:"#4ADE80", 
                      border:"1px solid rgba(74,222,128,0.15)", borderRadius:8, 
                      padding:"10px 16px", fontSize:12, fontWeight:700, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.15s",
                      width: "100%", marginTop: 4
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.borderColor = "#4ADE80"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.15)"; }}
                  >
                    {isExpanded ? "Show Less ▴" : `View all ${filteredVisits.length} visits ▾`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Optimized Route Map & Today's Progress */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Optimized Route Card */}
          <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", display:"flex", alignItems:"center", gap:8 }}><span><Map size={16}/></span> Optimized Route</div>
              <div onClick={() => setShowFullMapModal(true)} style={{ fontSize:12, color:"#4ADE80", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>View Full Map ↗</div>
            </div>
            <div style={{ height:250, background:"#0A1A0F", position:"relative", overflow:"hidden" }}>
              {/* Fake Map Background */}
              <div style={{ position:"absolute", inset:0, opacity:0.3, backgroundImage:"radial-gradient(circle at 50% 50%, #16A34A 1px, transparent 1px)", backgroundSize:"20px 20px" }}></div>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="100%" height="100%" viewBox="0 0 400 250">
                  {/* Dynamic Route Line Path */}
                  {filteredVisits.length > 1 && (
                    <path 
                      d={filteredVisits.map((v, idx) => `${idx === 0 ? "M" : "L"} ${v.x},${v.y}`).join(" ")} 
                      fill="none" 
                      stroke="#4ADE80" 
                      strokeWidth="2" 
                      strokeDasharray="8 5" 
                      className="flow-line"
                      style={{ transition: "all 0.5s ease" }}
                    />
                  )}
                  {/* Dynamic Nodes */}
                  {filteredVisits.map((pt, idx) => {
                    const isPtCompleted = completedVisits.includes(pt.id);
                    const isNext = routeStarted && nextStop && nextStop.id === pt.id;
                    return (
                      <g key={pt.id} style={{ cursor: "pointer" }} onClick={() => handleToggleVisit(pt)}>
                        {/* Outer Pulse ring for Next Stop */}
                        {isNext && (
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r="17" 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="2" 
                            style={{ opacity: 0.6, animation: "ping 1.5s infinite", transformBox: "fill-box", transformOrigin: "center" }} 
                          />
                        )}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={isNext ? "13" : "11"} 
                          fill={isPtCompleted ? "#16A34A" : isNext ? "#2563EB" : "rgba(15,31,20,0.95)"} 
                          stroke={isPtCompleted ? "rgba(74,222,128,0.4)" : isNext ? "#3B82F6" : pt.score > 90 ? "#4ADE80" : pt.score > 70 ? "#EAB308" : "#F97316"} 
                          strokeWidth={isPtCompleted ? 4 : isNext ? 3 : 2} 
                          style={{ transition:"all 0.3s ease" }}
                        />
                        <text x={pt.x} y={pt.y+3.5} fontSize="9" fill={isPtCompleted ? "#fff" : isNext ? "#fff" : "#CBD5E1"} textAnchor="middle" fontWeight="bold">
                          {isPtCompleted ? "✓" : idx + 1}
                        </text>
                      </g>
                    );
                  })}
                  {/* Current User GPS Location Dot */}
                  <circle 
                    cx={userLoc.x} 
                    cy={userLoc.y} 
                    r="12" 
                    fill="rgba(59, 130, 246, 0.2)" 
                    stroke="none" 
                    style={{ transition: "cx 0.8s ease-in-out, cy 0.8s ease-in-out" }} 
                  />
                  <circle 
                    cx={userLoc.x} 
                    cy={userLoc.y} 
                    r="6" 
                    fill="#3B82F6" 
                    stroke="#fff" 
                    strokeWidth="1.5" 
                    style={{ transition: "cx 0.8s ease-in-out, cy 0.8s ease-in-out" }} 
                  />
                </svg>
              </div>
            </div>
            
            {/* Store Listing under map */}
            <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:10, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              <div className="custom-scroll" style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:180, overflowY:"auto", paddingRight:6 }}>
                {filteredVisits.map((item, idx) => {
                  const isItemCompleted = completedVisits.includes(item.id);
                  const isNext = routeStarted && nextStop && nextStop.id === item.id;
                  const itemDist = scaledDistances[idx] !== undefined ? scaledDistances[idx] : 0;
                  return (
                    <div key={item.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, opacity: isItemCompleted ? 0.5 : 1, transition:"opacity 0.2s", background: isNext ? "rgba(59,130,246,0.05)" : "transparent", padding: isNext ? "4px 8px" : "0px", borderRadius: 4, border: isNext ? "1px solid rgba(59,130,246,0.2)" : "none" }}>
                      <div style={{ display:"flex", gap:10, color: isNext ? "#3B82F6" : isItemCompleted ? "#64748B" : "#CBD5E1", textDecoration: isItemCompleted ? "line-through" : "none", fontWeight: isNext ? 700 : 400, minWidth: 0 }}>
                        <span style={{ color: isItemCompleted ? "#4ADE80" : isNext ? "#3B82F6" : "#64748B", fontWeight:700 }}>{isItemCompleted ? "✓" : idx + 1}</span> 
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.name}>{item.name}</span>
                        {isNext && <span style={{ fontSize:9, background:"#3B82F6", color:"#fff", padding:"1px 4px", borderRadius:3, marginLeft:4, fontWeight:800, flexShrink:0 }}>NEXT</span>}
                      </div>
                      <div style={{ color: isNext ? "#3B82F6" : "#64748B", flexShrink: 0, marginLeft: 8 }}>{itemDist} km</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:700, color:"#F8FAFC", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:10, marginTop:4 }}>
                <div>Total Distance</div>
                <div style={{ color:"#4ADE80" }}>{activeDistance} km</div>
              </div>
            </div>
          </Card>

          {/* Today's Progress Card */}
          <Card style={{ background: "rgba(10, 25, 15, 0.6)", border: "1px solid rgba(74, 222, 128, 0.15)", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={16} color="#4ADE80" style={{ animation: routeStarted ? "pulse 2s infinite" : "none" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Today's Performance</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", background: "rgba(74, 222, 128, 0.1)", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(74,222,128,0.2)" }}>
                {completedPct}% Completed
              </span>
            </div>

            {/* 3-Column Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              {/* Visits Metric */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8" }}>
                  <Users size={12} color="#60A5FA" />
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Visits</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#F8FAFC" }}>
                  {completedVisits.length} <span style={{ fontSize: 11, color: "#64748B", fontWeight: 400 }}>/ {dataset.length}</span>
                </div>
              </div>

              {/* Revenue Metric */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8" }}>
                  <IndianRupee size={12} color="#4ADE80" />
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Revenue</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#4ADE80" }}>
                  ₹{completedRevenue.toLocaleString()}
                </div>
              </div>

              {/* Target Metric */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8" }}>
                  <Target size={12} color="#EAB308" />
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Target</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#F8FAFC" }}>
                  ₹{targetRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Glowing Shimmer Progress Bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>
                <span>Route Progress</span>
                <span style={{ color: "#4ADE80" }}>{completedPct}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255, 255, 255, 0.05)", borderRadius: 3, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div 
                  className="animate-shimmer" 
                  style={{ 
                    width: completedPct + "%", 
                    height: "100%", 
                    background: "linear-gradient(90deg, #4ADE80 0%, #22C55E 50%, #4ADE80 100%)", 
                    backgroundSize: "200% 100%", 
                    borderRadius: 3, 
                    transition: "width 0.6s ease" 
                  }}
                ></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full-screen Map Modal */}
      {showFullMapModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6, 17, 10, 0.82)",
          backdropFilter: "blur(10px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          animation: "fadeIn 0.25s ease-out"
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes zoomIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          ` }} />
          
          <div style={{
            background: "rgba(10, 25, 15, 0.98)",
            border: "1px solid rgba(74, 222, 128, 0.25)",
            borderRadius: 20,
            width: "92%",
            maxWidth: 1150,
            height: "82vh",
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
            animation: "zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            {/* Modal Left Column: Stop Details & Actions */}
            <div style={{
              borderRight: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              background: "rgba(0,0,0,0.2)"
            }}>
              <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#F8FAFC", display:"flex", alignItems:"center", gap:6 }}>
                    <MapPin size={16} color="#4ADE80" /> {region}
                  </div>
                  <span style={{ fontSize: 10, background: "rgba(74,222,128,0.12)", color: "#4ADE80", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>
                    AI Optimized
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#94A3B8" }}>
                  <div>Completed: <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{completedVisits.length} / {filteredVisits.length}</span></div>
                  <div>Distance: <span style={{ color: "#4ADE80", fontWeight: 700 }}>{activeDistance} km</span></div>
                  <div>Time: <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{activeTime}</span></div>
                </div>
              </div>

              {/* Scrollable Itinerary stops */}
              <div className="custom-scroll" style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredVisits.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#64748B", marginTop: 40, fontSize: 12 }}>No stops on the itinerary.</div>
                ) : (
                  filteredVisits.map((item, idx) => {
                    const isPtCompleted = completedVisits.includes(item.id);
                    const isNext = routeStarted && nextStop && nextStop.id === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => handleToggleVisit(item)}
                        style={{
                          background: isPtCompleted 
                            ? "rgba(255,255,255,0.01)" 
                            : isNext 
                              ? "rgba(59,130,246,0.04)" 
                              : "rgba(255,255,255,0.02)",
                          border: `1px solid ${
                            isPtCompleted 
                              ? "rgba(255,255,255,0.04)" 
                              : isNext 
                                ? "rgba(59,130,246,0.4)" 
                                : "rgba(255,255,255,0.06)"
                          }`,
                          borderRadius: 10,
                          padding: "12px 14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={e => { if(!isPtCompleted && !isNext) e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; }}
                        onMouseLeave={e => { if(!isPtCompleted && !isNext) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: isPtCompleted ? "#16A34A" : isNext ? "#2563EB" : "rgba(255,255,255,0.05)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0
                        }}>
                          {isPtCompleted ? "✓" : idx + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: 13, 
                            fontWeight: 700, 
                            color: isPtCompleted ? "#64748B" : "#F8FAFC",
                            textDecoration: isPtCompleted ? "line-through" : "none",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                          }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 10, color: "#64748B", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                            <span>Potential: <span style={{ color: isPtCompleted ? "#64748B" : "#4ADE80", fontWeight: 600 }}>₹{item.revenue.toLocaleString()}</span></span>
                            <span>Score: {item.score}</span>
                          </div>
                        </div>
                        {isNext && (
                          <span style={{ fontSize: 8, background: "#3B82F6", color: "#fff", padding: "2px 5px", borderRadius: 4, fontWeight: 900 }}>
                            NEXT
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Simulation bottom panel */}
              {routeStarted && nextStop && (
                <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(59,130,246,0.03)" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>Active Target Stop: <span style={{ color: "#60A5FA", fontWeight: 700 }}>{nextStop.name}</span></div>
                  <button 
                    onClick={handleSimulateNextStop}
                    style={{
                      width: "100%",
                      background: "#3B82F6",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#2563EB"}
                    onMouseLeave={e => e.currentTarget.style.background = "#3B82F6"}
                  >
                    🚀 Simulate Arrival & Check-in
                  </button>
                </div>
              )}
            </div>

            {/* Modal Right Column: Large Interactive Map */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
              {/* Header */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>AI Routing Visualization</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Click nodes on the map to toggle check-in progress. Blue dot represents active location.</div>
                </div>
                <button 
                  onClick={() => setShowFullMapModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    width: 32, height: 32,
                    color: "#F8FAFC",
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#EF4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#F8FAFC"; }}
                >
                  ✕
                </button>
              </div>

              {/* Large Map Area */}
              <div style={{ flex: 1, background: "#06130A", position: "relative" }}>
                {/* Fake grid map backdrop */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: "linear-gradient(rgba(74,222,128,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.15) 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                  <svg width="100%" height="100%" viewBox="0 0 450 300" style={{ maxHeight: "100%" }}>
                    {/* Path connecting stops */}
                    {filteredVisits.length > 1 && (
                      <path 
                        d={filteredVisits.map((v, idx) => `${idx === 0 ? "M" : "L"} ${v.x},${v.y}`).join(" ")} 
                        fill="none" 
                        stroke="#4ADE80" 
                        strokeWidth="3" 
                        strokeDasharray="6 6" 
                        style={{ transition: "all 0.5s ease" }}
                      />
                    )}

                    {/* Nodes with labels */}
                    {filteredVisits.map((pt, idx) => {
                      const isPtCompleted = completedVisits.includes(pt.id);
                      const isNext = routeStarted && nextStop && nextStop.id === pt.id;
                      return (
                        <g key={pt.id} style={{ cursor: "pointer" }} onClick={() => handleToggleVisit(pt)}>
                          {/* Pulsing ring for next target stop */}
                          {isNext && (
                            <circle 
                              cx={pt.x} 
                              cy={pt.y} 
                              r="20" 
                              fill="none" 
                              stroke="#3B82F6" 
                              strokeWidth="2.5" 
                              style={{ opacity: 0.7, animation: "ping 1.5s infinite", transformBox: "fill-box", transformOrigin: "center" }} 
                            />
                          )}
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r={isNext ? "14" : "11"} 
                            fill={isPtCompleted ? "#16A34A" : isNext ? "#2563EB" : "rgba(10,24,15,0.95)"} 
                            stroke={isPtCompleted ? "rgba(74,222,128,0.4)" : isNext ? "#3B82F6" : pt.score > 90 ? "#4ADE80" : pt.score > 70 ? "#EAB308" : "#F97316"} 
                            strokeWidth={isPtCompleted ? 4.5 : isNext ? 3 : 2} 
                            style={{ transition: "all 0.3s ease" }}
                          />
                          <text x={pt.x} y={pt.y+4} fontSize="9" fill={isPtCompleted ? "#fff" : isNext ? "#fff" : "#CBD5E1"} textAnchor="middle" fontWeight="bold">
                            {isPtCompleted ? "✓" : idx + 1}
                          </text>

                          {/* Label Text for store name */}
                          <text 
                            x={pt.x} 
                            y={pt.y - 16} 
                            fontSize="9" 
                            fill={isPtCompleted ? "#64748B" : isNext ? "#60A5FA" : "#F8FAFC"} 
                            fontWeight={isNext ? "bold" : 600}
                            textAnchor="middle"
                            style={{ textShadow: "1px 1px 2px #000" }}
                          >
                            {pt.name.split(" ")[0]} {pt.name.split(" ")[1] || ""}
                          </text>
                        </g>
                      );
                    })}

                    {/* Animated GPS User location dot */}
                    <circle 
                      cx={userLoc.x} 
                      cy={userLoc.y} 
                      r="14" 
                      fill="rgba(59, 130, 246, 0.2)" 
                      stroke="none" 
                      style={{ transition: "cx 0.8s ease-in-out, cy 0.8s ease-in-out" }} 
                    />
                    <circle 
                      cx={userLoc.x} 
                      cy={userLoc.y} 
                      r="7" 
                      fill="#3B82F6" 
                      stroke="#fff" 
                      strokeWidth="2" 
                      style={{ transition: "cx 0.8s ease-in-out, cy 0.8s ease-in-out" }} 
                    />
                  </svg>
                </div>

                {/* Legend panel */}
                <div style={{
                  position: "absolute",
                  bottom: 16,
                  left: 20,
                  background: "rgba(10,24,15,0.92)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  display: "flex",
                  gap: 16,
                  fontSize: 10,
                  color: "#94A3B8"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16A34A" }}></div> Completed
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB" }}></div> Next Stop
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0F1F14", border: "1px solid #4ADE80" }}></div> Pending Stop
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3B82F6", border: "1.5px solid #fff" }}></div> GPS Location
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── RETAILER INSIGHTS PAGE ───────────────────────────────────────────────────
const RetailerInsightsPage = ({ initialSearch = "", initialFilter = "All" }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);
  
  const filtered = retailerData.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.owner.toLowerCase().includes(search.toLowerCase());
    if (filter === "All") return matchesSearch;
    if (filter === "Low Stock") return matchesSearch && (r.stockLevel === "Critical" || r.stockLevel === "Low Stock");
    if (filter === "Outstanding") return matchesSearch && r.outstanding > 0;
    if (filter === "Active") return matchesSearch && r.status === "Active";
    return matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <KpiCard icon={<Store size={22}/>} iconBg="rgba(74,222,128,0.2)" label="Total Retailers" value="5" valueColor="#4ADE80" sub="Active partners" />
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)" label="Low Stock Alerts" value="3" valueColor="#EF4444" sub="Need replenishment" />
        <KpiCard icon={<IndianRupee size={22}/>} iconBg="rgba(234,179,8,0.2)" label="Total Outstanding" value="₹40,000" valueColor="#EAB308" sub="Pending payments" />
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(56,189,248,0.2)" label="Sales Generated" value="₹7.16L" valueColor="#38BDF8" sub="This financial year" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["All", "Low Stock", "Outstanding", "Active"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#4ADE80" : "#CBD5E1",
              border: `1px solid ${filter === f ? "#4ADE80" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6
            }}>
              {filter === f && <span style={{ fontSize: 11, fontWeight: 900 }}>✓</span>}
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", width: 260 }}>
          <Search size={16} color="#64748B" />
          <input type="text" placeholder="Search retailer or owner..." value={search} onChange={e => setSearch(e.target.value)} style={{
            background: "transparent", border: "none", color: "#F8FAFC", fontSize: 13, outline: "none", width: "100%", fontFamily: "'DM Sans',sans-serif"
          }} />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
              {["Retailer", "Location", "Last Visit", "Stock Level", "Outstanding Balance", "Total Sales", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 11, color: "#64748B", fontWeight: 700, textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Prop: {r.owner}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#CBD5E1" }}>{r.location}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#CBD5E1" }}>{r.lastVisit}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                      background: r.stockLevel === "Critical" ? "rgba(239,68,68,0.12)" : r.stockLevel === "Low Stock" ? "rgba(249,115,22,0.12)" : "rgba(74,222,128,0.12)",
                      color: r.stockLevel === "Critical" ? "#EF4444" : r.stockLevel === "Low Stock" ? "#F97316" : "#4ADE80",
                      border: `1px solid ${r.stockLevel === "Critical" ? "#EF444430" : r.stockLevel === "Low Stock" ? "#F9731630" : "#4ADE8030"}`
                    }}>{r.stockLevel}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: r.outstanding > 0 ? "#EAB308" : "#4ADE80" }}>
                    {r.outstanding > 0 ? `₹${r.outstanding.toLocaleString()}` : "Clear"}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>₹{r.totalSales.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button title="Call Retailer" style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Phone size={13} />
                      </button>
                      <button title="Message" style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MessageSquare size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: "30px 16px", textAlign: "center", color: "#64748B", fontSize: 13 }}>No retailers found matching filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
      <InfoBar text="Retailer sales & outstanding stats are automatically synced with regional ERP distributor databases." />
    </div>
  );
};

// ─── GROWER INSIGHTS PAGE ─────────────────────────────────────────────────────
const GrowerInsightsPage = ({ initialSearch = "" }) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);
  
  const filtered = growerData.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.location.toLowerCase().includes(search.toLowerCase());
    if (filter === "All") return matchesSearch;
    return matchesSearch && g.crop === filter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <KpiCard icon={<Users size={22}/>} iconBg="rgba(74,222,128,0.2)" label="Total Active Growers" value="5" valueColor="#4ADE80" sub="Registered under cluster" />
        <KpiCard icon={<Wheat size={22}/>} iconBg="rgba(249,115,22,0.2)" label="Total Land Monitored" value="60 Acres" valueColor="#F97316" sub="Across Jhansi/Patna region" />
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)" label="High Risk Crops" value="1" valueColor="#EF4444" sub="Need advisory updates" />
        <KpiCard icon={<Activity size={22}/>} iconBg="rgba(56,189,248,0.2)" label="Average Crop Risk" value="38%" valueColor="#38BDF8" sub="Healthy overall index" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["All", "Wheat", "Rice", "Cotton", "Maize"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#4ADE80" : "#CBD5E1",
              border: `1px solid ${filter === f ? "#4ADE80" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6
            }}>
              {filter === f && <span style={{ fontSize: 11, fontWeight: 900 }}>✓</span>}
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", width: 260 }}>
          <Search size={16} color="#64748B" />
          <input type="text" placeholder="Search grower or village..." value={search} onChange={e => setSearch(e.target.value)} style={{
            background: "transparent", border: "none", color: "#F8FAFC", fontSize: 13, outline: "none", width: "100%", fontFamily: "'DM Sans',sans-serif"
          }} />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.length > 0 ? (
          filtered.map(g => (
            <Card key={g.id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#F8FAFC" }}>{g.name}</div>
                  <div style={{ fontSize:12, color:"#64748B", marginTop:3, display:"flex", alignItems:"center", gap:4 }}><MapPin size={12}/> {g.location} | Land: {g.land}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4,
                  background: g.risk === "High Risk" ? "rgba(239,68,68,0.12)" : g.risk === "Medium Risk" ? "rgba(249,115,22,0.12)" : "rgba(74,222,128,0.12)",
                  color: g.risk === "High Risk" ? "#EF4444" : g.risk === "Medium Risk" ? "#F97316" : "#4ADE80",
                  border: `1px solid ${g.risk === "High Risk" ? "#EF444430" : g.risk === "Medium Risk" ? "#F9731630" : "#4ADE8030"}`
                }}>{g.risk}</span>
              </div>

              <div style={{ display: "flex", gap: 20, background: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>Crop Monitored</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80", marginTop:3, display:"flex", alignItems:"center", gap:4 }}><Wheat size={14}/> {g.crop}</div>
                </div>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 16 }}>
                  <div style={{ fontSize: 10, color: "#64748B" }}>Growth Stage</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginTop:3 }}>{g.stage}</div>
                </div>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 16 }}>
                  <div style={{ fontSize: 10, color: "#64748B" }}>Last Visited</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#CBD5E1", marginTop:3 }}>{g.lastContact}</div>
                </div>
              </div>

              <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "#4ADE80", fontWeight: 700, display:"flex", alignItems:"center", gap:4 }}>⚡ AI Active Advisory</div>
                <div style={{ fontSize: 12, color: "#CBD5E1", marginTop:4, lineHeight:1.5 }}>{g.advisory}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
                <div style={{ fontSize: 11, color: "#475569" }}>Contact: {g.phone}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Phone size={13} />
                  </button>
                  <button style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={13} />
                  </button>
                  <button style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 6, padding: "0 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Advisory Details</button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div style={{ gridColumn: "span 2", padding: "40px", textAlign: "center", color: "#64748B", fontSize: 13 }}>No growers found matching filters.</div>
        )}
      </div>
      <InfoBar text="Grower list and advisory states are synchronized dynamically when crop recommendations are accepted." />
    </div>
  );
};

// Custom Switch Component
const Switch = ({ checked, onChange }) => (
  <div onClick={onChange} style={{
    width: 42, height: 22, borderRadius: 11,
    background: checked ? "#16A34A" : "rgba(255,255,255,0.08)",
    border: `1px solid ${checked ? "#4ADE80" : "rgba(255,255,255,0.12)"}`,
    position: "relative", cursor: "pointer", transition: "all 0.2s ease",
  }}>
    <div style={{
      width: 16, height: 16, borderRadius: "50%",
      background: checked ? "#FFF" : "#64748B",
      position: "absolute", top: 2, left: checked ? 22 : 2,
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
    }} />
  </div>
);

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [depot, setDepot] = useState("Jhansi Depot");
  const [stockAlerts, setStockAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  
  const [phone, setPhone] = useState("+91 94123 45678");
  const [vehicle, setVehicle] = useState("UP-93-AB-4321");
  const [territory, setTerritory] = useState("Jhansi Cluster-C");
  
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSync, setLastSync] = useState("10 June 2026, 04:30 AM");
  const [toast, setToast] = useState("");

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date();
      setLastSync(now.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
      showToast("System synchronization completed!");
    }, 1500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Changes saved successfully!");
    }, 1000);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const FormInput = ({ label, value, onChange, readOnly }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
      <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={onChange}
        readOnly={readOnly} 
        style={{
          background: readOnly ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)", 
          border: `1px solid ${readOnly ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 8, padding: "10px 14px", color: readOnly ? "#475569" : "#CBD5E1",
          fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif",
          transition: "border-color 0.2s",
        }} 
        onFocus={e => { if(!readOnly) e.target.style.borderColor = "rgba(74,222,128,0.4)"; }}
        onBlur={e => { if(!readOnly) e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 32, width: "100%", position: "relative" }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 32, zIndex: 1000,
          background: "#0F1F14", border: "1px solid #4ADE80", borderRadius: 8,
          padding: "12px 24px", color: "#4ADE80", fontSize: 13, fontWeight: 700,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "fadeIn 0.25s ease"
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Left Tabs Sidebar */}
      <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { id: "profile", label: "Representative Profile", icon: <User size={16} /> },
          { id: "preferences", label: "Field Preferences", icon: <Settings size={16} /> },
          { id: "sync", label: "Offline Sync", icon: <RefreshCw size={16} /> }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
            borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
            background: activeTab === t.id ? "rgba(74,222,128,0.12)" : "transparent",
            color: activeTab === t.id ? "#4ADE80" : "#64748B",
            fontWeight: activeTab === t.id ? 700 : 500, fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
          }}
            onMouseEnter={e => { if(activeTab!==t.id) e.currentTarget.style.color = "#CBD5E1"; }}
            onMouseLeave={e => { if(activeTab!==t.id) e.currentTarget.style.color = "#64748B"; }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Right Content Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
        {activeTab === "profile" && (
          <>
            {/* Header info */}
            <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#4ADE80", fontWeight: 700, border: "2px solid rgba(74,222,128,0.3)" }}>
                AS
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", fontFamily: "'Space Grotesk',sans-serif" }}>Amit Sharma</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Field Representative  •  Jhansi Cluster-C</div>
                <span style={{ fontSize: 9, background: "rgba(74,222,128,0.12)", color: "#4ADE80", padding: "2px 6px", borderRadius: 4, fontWeight: 700, display: "inline-block", marginTop: 6 }}>ONLINE STATUS: ACTIVE</span>
              </div>
            </Card>

            {/* Profile fields */}
            <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>Personal Information</div>
              
              <div style={{ display: "flex", gap: 16 }}>
                <FormInput label="Full Name" value="Amit Sharma" readOnly={true} />
                <FormInput label="Employee ID" value="#AGR-49102" readOnly={true} />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <FormInput label="Email Address" value="amit.sharma@agroai.com" readOnly={true} />
                <FormInput label="Designation" value="Senior Field Executive" readOnly={true} />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <FormInput label="Contact Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                <FormInput label="Assigned Cluster" value={territory} onChange={e => setTerritory(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <FormInput label="Transit Vehicle No." value={vehicle} onChange={e => setVehicle(e.target.value)} />
                <div style={{ flex: 1 }} /> {/* Spacing */}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSave} disabled={saving} style={{
                  background: "#16A34A", color: "#FFF", border: "none", borderRadius: 8,
                  padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "background 0.2s", display: "flex", alignItems: "center", gap: 8
                }}>
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </Card>
          </>
        )}

        {activeTab === "preferences" && (
          <>
            {/* Depot Selector */}
            <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>Primary Depot Selection</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: -10 }}>Select your warehouse depot cluster to sync stock levels.</div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { id: "Jhansi Depot", name: "Jhansi Depot", region: "UP Region-A", code: "JHS-01" },
                  { id: "Agra Depot", name: "Agra Depot", region: "UP Region-B", code: "AGR-02" },
                  { id: "Kanpur Depot", name: "Kanpur Depot", region: "UP Region-C", code: "KNP-03" }
                ].map(d => {
                  const isSelected = depot === d.id;
                  return (
                    <div key={d.id} onClick={() => setDepot(d.id)} style={{
                      background: isSelected ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "#4ADE80" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 12, padding: "14px", cursor: "pointer", transition: "all 0.2s ease"
                    }}
                      onMouseEnter={e => { if(!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                      onMouseLeave={e => { if(!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#4ADE80" : "#F8FAFC" }}>{d.name}</span>
                        {isSelected && <span style={{ fontSize: 9, background: "rgba(74,222,128,0.15)", color: "#4ADE80", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>ACTIVE</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{d.region}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>Code: {d.code}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>Notification & Field Alerts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Critical Stock Alerts", desc: "Notify immediately when product inventory levels drop below 20%", state: stockAlerts, setState: setStockAlerts },
                  { label: "High Crop Risk Advisories", desc: "Notify when local farm risk indexes increase to High", state: riskAlerts, setState: setRiskAlerts },
                  { label: "Weather Anomalies", desc: "Notify if rain forecast probability is above 60% during field visits", state: weatherAlerts, setState: setWeatherAlerts }
                ].map(opt => (
                  <div key={opt.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{opt.desc}</div>
                    </div>
                    <Switch checked={opt.state} onChange={() => opt.setState(s => !s)} />
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSave} disabled={saving} style={{
                  background: "#16A34A", color: "#FFF", border: "none", borderRadius: 8,
                  padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "background 0.2s"
                }}>
                  {saving ? "Saving Preferences..." : "Save Preferences"}
                </button>
              </div>
            </Card>
          </>
        )}

        {activeTab === "sync" && (
          <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>Offline Database Synchronization</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Database Connection</span>
                <span style={{ fontSize: 13, color: "#4ADE80", fontWeight: 700 }}>ONLINE (FAST 4G)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Local Cache Size</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>4.82 MB</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Pending Offline Uploads</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>0 records</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>Last Synchronization</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{lastSync}</span>
              </div>
            </div>

            <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 8, padding: "12px 14px", marginTop: 10 }}>
              <div style={{ fontSize: 12, color: "#4ADE80", fontWeight: 700 }}>💡 Synchronization Tip</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, lineHeight: 1.5 }}>
                Syncing updates the offline distributor inventory maps, grower riskanalyses, and weather forecasts. Ensure a stable internet connection before running a full sync.
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleSync} disabled={syncing} style={{
                background: syncing ? "rgba(255,255,255,0.05)" : "rgba(74,222,128,0.12)",
                color: syncing ? "#64748B" : "#4ADE80",
                border: `1px solid ${syncing ? "rgba(255,255,255,0.1)" : "rgba(74,222,128,0.25)"}`,
                borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: syncing ? "default" : "pointer", transition: "all 0.15s"
              }}>
                {syncing ? "Synchronizing database..." : "Force Full Synchronization"}
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const monthlySalesPerformance = [
  { month: "Jan", actual: 80000, target: 75000 },
  { month: "Feb", actual: 120000, target: 100000 },
  { month: "Mar", actual: 150000, target: 140000 },
  { month: "Apr", actual: 180000, target: 200000 },
  { month: "May", actual: 300000, target: 250000 },
  { month: "Jun", actual: 250000, target: 240000 },
];

const productSalesDistribution = [
  { name: "Actara 25 WG", value: 45000, color: "#4ADE80" },
  { name: "Custodia", value: 30000, color: "#A855F7" },
  { name: "Ridomil Gold", value: 25000, color: "#EF4444" },
  { name: "Tilt 250 EC", value: 15000, color: "#EAB308" },
  { name: "Movondo", value: 10000, color: "#64748B" }
];

const visitTrendData = [
  { week: "W1", visits: 10, target: 12 },
  { week: "W2", visits: 14, target: 12 },
  { week: "W3", visits: 18, target: 12 },
  { week: "W4", visits: 15, target: 12 }
];

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const [region, setRegion] = useState("All Regions");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const totalSalesValue = productSalesDistribution.reduce((sum, p) => sum + p.value, 0);
  const selectedEntry = selectedProduct ? productSalesDistribution.find(p => p.name === selectedProduct) : null;
  const selectedPct = selectedEntry ? Math.round((selectedEntry.value / totalSalesValue) * 100) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header filter */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
        <FilterDropdown label={region} options={["All Regions", "Jhansi Territory", "Patna Territory"]} value={region} onChange={setRegion} />
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <KpiCard icon={<IndianRupee size={22}/>} iconBg="rgba(74,222,128,0.2)" label="Total Sales Value" value="₹12.50L" valueColor="#4ADE80" sub="vs Target: ₹11.00L" />
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(56,189,248,0.2)" label="Target Achievement" value="113.6%" valueColor="#38BDF8" sub="High performance index" />
        <KpiCard icon={<Users size={22}/>} iconBg="rgba(168,85,247,0.2)" label="Total Field Visits" value="62" valueColor="#A855F7" sub="This calendar month" />
        <KpiCard icon={<CheckCircle size={22}/>} iconBg="rgba(234,179,8,0.2)" label="CSAT Rating" value="4.8 / 5.0" valueColor="#EAB308" sub="Grower satisfaction score" />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 16 }}>
        {/* Sales Performance Area Chart */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Revenue Generation vs Targets</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94A3B8" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "#4ADE80" }} /> Actual
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94A3B8" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} /> Target
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlySalesPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => `₹${v/1000}k`} tick={{ fill: "#64748B", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} contentStyle={{ background: "#0F1F14", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="#4ADE80" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="target" stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Product Sales Donut Chart */}
        <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Product Sales Share</div>
            {selectedProduct && (
              <button onClick={() => setSelectedProduct(null)} style={{ fontSize:10, color:"#64748B", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"3px 8px", cursor:"pointer" }}>
                Clear ✕
              </button>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productSalesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(data) => {
                    if (data?.name) setSelectedProduct(p => p === data.name ? null : data.name);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {productSalesDistribution.map((entry, index) => {
                    const isDimmed = selectedProduct && selectedProduct !== entry.name;
                    return <Cell key={`cell-${index}`} fill={isDimmed ? `${entry.color}30` : entry.color} />;
                  })}
                </Pie>
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748B" }}>{selectedProduct ? selectedProduct : "Total Share"}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: selectedProduct ? "#4ADE80" : "#F8FAFC" }}>{selectedPct !== null ? `${selectedPct}%` : "100%"}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {productSalesDistribution.map(item => {
              const isActive = selectedProduct === item.name;
              return (
                <div 
                  key={item.name} 
                  onClick={() => setSelectedProduct(p => p === item.name ? null : item.name)}
                  style={{ 
                    display: "flex", alignItems: "center", gap: 10, fontSize: 11, cursor: "pointer",
                    padding: "5px 8px", borderRadius: 6, transition: "all 0.15s",
                    background: isActive ? "rgba(74,222,128,0.08)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(74,222,128,0.3)" : "transparent"}`
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ 
                    width: 10, height: 10, borderRadius: 2, background: item.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, color: "#0D1F12", fontWeight: 900
                  }}>
                    {isActive && "✓"}
                  </div>
                  <span style={{ color: isActive ? "#4ADE80" : "#CBD5E1", flex: 1 }}>{item.name}</span>
                  <span style={{ color: isActive ? "#4ADE80" : "#94A3B8", fontWeight: 700 }}>₹{(item.value/1000)}k</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        {/* Weekly Visits Comparison */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Field Visit Performance</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94A3B8" }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "#38BDF8" }} /> Actual</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94A3B8" }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} /> Target</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={visitTrendData} barGap={4} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0F1F14", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="visits" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Actionable Insights Box */}
        <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", display: "flex", alignItems: "center", gap: 6 }}>
            <span>⚡</span> Actionable Regional Insights
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: "Actara 25 WG sales rose 45% in Patna district due to early season whitefly risk alerts.", severity: "Success" },
              { text: "Visits to Kisan Seed Store generated 35% higher order value than regional average.", severity: "Info" },
              { text: "Outstanding balance in Jhansi is down 12% following coordinated payment follow-up alerts.", severity: "Success" },
              { text: "High crop risk alerts in wheat clusters triggered 18 additional advisory sessions this week.", severity: "Info" }
            ].map((ins, idx) => (
              <div key={idx} style={{
                display: "flex", gap: 10, background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px 14px", alignItems: "center"
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                  background: ins.severity === "Success" ? "rgba(74,222,128,0.1)" : "rgba(56,189,248,0.1)",
                  color: ins.severity === "Success" ? "#4ADE80" : "#38BDF8"
                }}>{ins.severity}</span>
                <span style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.4 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const SkeletonLoader = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="shimmer-bg" style={{ height: 120, borderRadius: 14 }} />
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <div className="shimmer-bg" style={{ height: 320, borderRadius: 16 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="shimmer-bg" style={{ height: 152, borderRadius: 16 }} />
        <div className="shimmer-bg" style={{ height: 152, borderRadius: 16 }} />
      </div>
    </div>
  </div>
);

// ─── TASK DRAWER ──────────────────────────────────────────────────────────────
const TaskDrawer = ({ isOpen, data, onClose }) => {
  if (!data) return null;
  const { type, data: item } = data;

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: isOpen ? "auto" : "none"
        }}
      />
      <div style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : -480,
        width: 460,
        height: "100vh",
        zIndex: 1000,
        background: "rgba(10, 24, 15, 0.98)",
        borderLeft: "1px solid rgba(74,222,128,0.25)",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.85)",
        transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px",
        overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: type === "grower" ? "rgba(74,222,128,0.15)" : type === "stock" ? "rgba(168,85,247,0.15)" : "rgba(234,179,8,0.15)", color: type === "grower" ? "#4ADE80" : type === "stock" ? "#A855F7" : "#EAB308" }}>
              {type === "grower" ? "Grower Action" : type === "stock" ? "Inventory Alert" : "Retailer Payment"}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            <X size={14} />
          </button>
        </div>

        {type === "grower" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ADE80" }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{item.name}</h3>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={12} /> {item.location}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#CBD5E1" }}>Crop Risk Level</span>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: "rgba(239,68,68,0.2)", color: "#EF4444", border: "1px solid #EF444430" }}>
                {item.risk}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Crop Monitored</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#4ADE80", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Wheat size={16} /> {item.crop}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Growth Stage</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginTop: 6 }}>
                  {item.stage}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Land Monitored</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Map size={16} color="#F97316" /> {item.land}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Last Contact</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginTop: 6 }}>
                  {item.lastContact}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#4ADE80", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                <Lightbulb size={14} /> AI Contextual Advisory
              </div>
              <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>
                {item.advisory}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              <a href={`tel:${item.phone}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#16A34A", color: "#0D1F12", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#22C55E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#16A34A"; }}
              >
                <Phone size={14} /> Call Grower ({item.phone})
              </a>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#F8FAFC", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              >
                <MessageSquare size={14} /> Send Advisory SMS
              </button>
            </div>
          </div>
        )}

        {type === "stock" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A855F7" }}>
                <Store size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{item.name}</h3>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  {item.pack}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#CBD5E1" }}>Warehouse Location</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{item.warehouse}</span>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: "#94A3B8" }}>Current Stock: <strong style={{ color: "#F97316" }}>{item.stock}</strong></span>
                <span style={{ color: "#F97316", fontWeight: 700 }}>{item.pct}% Remaining</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: "#F97316", borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: "#EF4444", marginTop: 8, fontWeight: 600 }}>
                ⚠️ Status: {item.level} Stock Level
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>Demand Factors</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#CBD5E1", lineHeight: 1.6 }}>
                  {item.demand.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>Supply Constraints</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#CBD5E1", lineHeight: 1.6 }}>
                  {item.supply.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🚨</span>
              <div style={{ fontSize: 12, color: "#CBD5E1" }}>
                Recommended Action: <strong style={{ color: "#A855F7" }}>{item.action}</strong>
              </div>
            </div>

            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#A855F7", color: "#F8FAFC", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", marginTop: 10 }}
              onMouseEnter={e => { e.currentTarget.style.background = "#B55FE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#A855F7"; }}
            >
              Initiate Depot Restock Request
            </button>
          </div>
        )}

        {type === "retailer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(234,179,8,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EAB308" }}>
                <IndianRupee size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{item.name}</h3>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={12} /> {item.location}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 14, padding: "20px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#CBD5E1", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}>Outstanding Balance</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#EAB308", fontFamily: "'Space Grotesk', sans-serif", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <IndianRupee size={28} /> {item.outstanding.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>
                Last visited: {item.lastVisit}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: "#64748B" }}>Proprietor</span>
                <span style={{ color: "#F8FAFC", fontWeight: 600 }}>{item.owner}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: "#64748B" }}>Status</span>
                <span style={{ color: "#4ADE80", fontWeight: 600 }}>{item.status} Partner</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: "#64748B" }}>Total Annual Sales</span>
                <span style={{ color: "#F8FAFC", fontWeight: 600 }}>₹{item.totalSales.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              <a href={`tel:${item.phone}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#EAB308", color: "#0D1F12", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5C825"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#EAB308"; }}
              >
                <Phone size={14} /> Call Retailer ({item.phone})
              </a>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#F8FAFC", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              >
                <MessageSquare size={14} /> Send Payment Link Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── CROP RISK DETAILS DATABASE ──────────────────────────────────────────────
const CROP_RISK_DETAILS = {
  wheat: {
    crop: "Wheat",
    risk: 75,
    level: "High",
    threat: "Yellow Rust & Aphids Infestation",
    area: "1,200 Acres",
    value: "₹1.5L",
    desc: "Yellow Rust (Puccinia striiformis) has been detected in high-density pockets due to low night temperatures and high morning humidity. Aphid population is also approaching the economic threshold level.",
    action: "Apply Custodia Fungicide (Syngenta) at 300 ml/acre to control Yellow Rust. For Aphids, spray Actara 25 WG at 80 grams/acre.",
    growers: [
      { name: "Ramesh Kumar", location: "Karguwan Village", land: "12 Acres", risk: "High Risk", phone: "+91 94123 45678" },
      { name: "Harish Chandra", location: "Pura Village", land: "20 Acres", risk: "Low Risk", phone: "+91 94123 45682" }
    ]
  },
  mustard: {
    crop: "Mustard",
    risk: 45,
    level: "Medium",
    threat: "Alternaria Blight & Downy Mildew",
    area: "850 Acres",
    value: "₹0.9L",
    desc: "Early onset of Alternaria Blight detected on lower leaves. Weather forecasts show overcast skies, which could accelerate disease spreading in dense canopy fields.",
    action: "Spray Score 250 EC (Syngenta) at 1 ml/liter of water. Avoid irrigation for the next 48 hours to reduce canopy humidity.",
    growers: [
      { name: "Suresh Patel", location: "Sajnam Village", land: "8 Acres", risk: "Medium Risk", phone: "+91 94123 45679" }
    ]
  },
  pea: {
    crop: "Pea",
    risk: 20,
    level: "Low",
    threat: "Powdery Mildew",
    area: "300 Acres",
    value: "₹0.2L",
    desc: "Powdery mildew signs are present in a few low-lying damp areas of the field. The overall threat level remains low but continuous monitoring is advised.",
    action: "No chemical action needed immediately. Maintain weed-free conditions and apply preventive sulfur dust (80% WP) if symptoms spread.",
    growers: [
      { name: "Dinesh Yadav", location: "Bijoli Village", land: "5 Acres", risk: "Low Risk", phone: "+91 94123 45681" }
    ]
  },
  chickpea: {
    crop: "Chickpea",
    risk: 60,
    level: "High",
    threat: "Pod Borer Outbreak",
    area: "950 Acres",
    value: "₹1.1L",
    desc: "Pod borer (Helicoverpa armigera) activity detected at 3-4 larvae per meter row, exceeding the economic threshold level of 1 larva per meter. Immediate control is critical.",
    action: "Spray Ampligo insecticide (Syngenta) at 80-100 ml/acre or apply Actara 25 WG at 80g/acre for sucking pest control.",
    growers: [
      { name: "Mahesh Singh", location: "Simra Village", land: "15 Acres", risk: "High Risk", phone: "+91 94123 45680" }
    ]
  },
  potato: {
    crop: "Potato",
    risk: 30,
    level: "Low",
    threat: "Late Blight Prevention",
    area: "400 Acres",
    value: "₹0.4L",
    desc: "Late Blight signs are absent but weather conditions (cool nights, morning fog) are highly favorable for spore germination. Prophylactic cover is recommended.",
    action: "Apply Kavach 75 WP (Chlorothalonil) as a protective cover at 2g/liter of water. Ensure thorough coverage of the foliage.",
    growers: [
      { name: "Dinesh Yadav", location: "Bijoli Village", land: "5 Acres", risk: "Low Risk", phone: "+91 94123 45681" }
    ]
  },
  rice: {
    crop: "Rice",
    risk: 80,
    level: "High",
    threat: "Blast Disease & Brown Plant Hopper",
    area: "2,400 Acres",
    value: "₹3.5L",
    desc: "Rice blast lesions observed on foliage, accompanied by brown plant hopper nymphs at the base of the stems. Warm, humid weather is driving the infestation.",
    action: "Apply Custodia Fungicide (Syngenta) at 300 ml/acre for blast. Spray Chess insecticide at 120g/acre to knock down plant hoppers.",
    growers: [
      { name: "Ramesh Yadav", location: "Karguwan Village", land: "12 Acres", risk: "High Risk", phone: "+91 94123 45678" },
      { name: "Ram Sevak", location: "Patna Village", land: "10 Acres", risk: "High Risk", phone: "+91 94123 45683" }
    ]
  },
  cotton: {
    crop: "Cotton",
    risk: 65,
    level: "High",
    threat: "Pink Bollworm Infestation",
    area: "1,800 Acres",
    value: "₹2.8L",
    desc: "Pheromone traps show catches of 8 pink bollworm moths/trap/day. Damage to green bolls observed in cotton clusters.",
    action: "Deploy 500 Pheromone traps immediately. Spray Ampligo insecticide or apply Actara 25 WG at 80g/acre.",
    growers: [
      { name: "Suresh Patel", location: "Sajnam Village", land: "8 Acres", risk: "High Risk", phone: "+91 94123 45679" }
    ]
  },
  maize: {
    crop: "Maize",
    risk: 40,
    level: "Medium",
    threat: "Fall Armyworm Damage",
    area: "1,100 Acres",
    value: "₹1.2L",
    desc: "Early leaf damage (pinholes and window pane patterns) from Fall Armyworm larvae detected in young vegetative maize crops.",
    action: "Spray Ampligo at 80 ml/acre targeting the crop whorl. Ensure uniform chemical coverage.",
    growers: [
      { name: "Mahesh Chand", location: "Simra Village", land: "15 Acres", risk: "Medium Risk", phone: "+91 94123 45680" }
    ]
  },
  soybean: {
    crop: "Soybean",
    risk: 25,
    level: "Low",
    threat: "Girdle Beetle Activity",
    area: "600 Acres",
    value: "₹0.5L",
    desc: "Girdle beetle damage spotted in isolated field borders. Crop is currently at vegetative stage with strong health parameters.",
    action: "Remove and destroy damaged stems. Spray preventive Neem-based formulation (1500 ppm) if insect count increases.",
    growers: [
      { name: "Dinesh Yadav", location: "Bijoli Village", land: "5 Acres", risk: "Low Risk", phone: "+91 94123 45681" }
    ]
  },
  groundnut: {
    crop: "Groundnut",
    risk: 15,
    level: "Low",
    threat: "Leaf Spot (Tikka disease)",
    area: "400 Acres",
    value: "₹0.3L",
    desc: "Tikka Leaf Spot spotted in very early stages on old leaves. The spread rate is slow due to dry soil conditions.",
    action: "No immediate spray required. Apply Kavach 75 WP as a protective shield if humidity increases.",
    growers: []
  }
};

// ─── CROP RISK DETAIL DRAWER ────────────────────────────────────────────────
const CropRiskDrawer = ({ isOpen, data, onClose, onNav }) => {
  if (!data) return null;
  const cropKey = data.crop.toLowerCase();
  const details = CROP_RISK_DETAILS[cropKey] || {
    crop: data.crop,
    risk: data.risk,
    level: data.level || "Low",
    threat: "Environmental stress",
    area: "N/A",
    value: "N/A",
    desc: "No detailed risk data available for this crop. General monitoring is recommended.",
    action: "Monitor crop periodically.",
    growers: []
  };

  const levelColor = { High: "#EF4444", Medium: "#F97316", Low: "#4ADE80" }[details.level] || "#4ADE80";

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: isOpen ? "auto" : "none"
        }}
      />
      <div style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : -480,
        width: 460,
        height: "100vh",
        zIndex: 1000,
        background: "rgba(10, 24, 15, 0.98)",
        borderLeft: "1px solid rgba(74,222,128,0.25)",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.85)",
        transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px",
        overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>
              Crop Intelligence
            </span>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ADE80" }}>
              <Wheat size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{details.crop}</h3>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <Activity size={12} /> Seasonal Crop Monitor
              </div>
            </div>
          </div>

          <div style={{ background: `${levelColor}0D`, border: `1px solid ${levelColor}30`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#CBD5E1" }}>Threat Level Index</span>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${levelColor}20`, color: levelColor, border: `1px solid ${levelColor}30` }}>
              {details.risk}% — {details.level} Risk
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Impacted Area</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Map size={16} color="#38BDF8" /> {details.area}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Est. Value at Risk</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#EAB308", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <IndianRupee size={15} /> {details.value}
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Bug size={14} color="#EF4444" /> Primary Pest/Disease Threat
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{details.threat}</div>
            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6, margin: "8px 0 0" }}>{details.desc}</p>
          </div>

          <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 12, padding: "16px" }}>
            <div style={{ fontSize: 11, color: "#4ADE80", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldAlert size={14} /> Recommended AI Mitigation
            </div>
            <p style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>{details.action}</p>
          </div>

          {details.growers.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5, marginBottom: 10 }}>
                Affected Growers ({details.growers.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {details.growers.map((g, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{g.location} ({g.land})</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={`tel:${g.phone}`} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ADE80", textDecoration: "none", cursor: "pointer" }} title="Call Grower">
                        <Phone size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            <button 
              onClick={() => {
                onClose();
                onNav("crop", { selectedCrop: details.crop });
              }}
              style={{ 
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, 
                background: "#4ADE80", color: "#0D1F12", border: "none", borderRadius: 10, 
                padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" 
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#5bef90"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#4ADE80"; }}
            >
              <ExternalLink size={14} /> Open Detailed Crop Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { role, isAuthenticated } = useUIStore();
  const [page, setPage]   = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState(todayTasks.map(t=>({...t, done:false})));
  const toggleTask = id => setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const [drawerData, setDrawerData] = useState(null);
  const [cropDrawerData, setCropDrawerData] = useState(null);

  const [growerSearch, setGrowerSearch] = useState("");
  const [retailerSearch, setRetailerSearch] = useState("");
  const [retailerFilter, setRetailerFilter] = useState("All");
  const [stockWarehouse, setStockWarehouse] = useState("All Warehouses");
  const [selectedCropParam, setSelectedCropParam] = useState(null);

  const handleNav = (targetPage, params = {}) => {
    setGrowerSearch(params.growerSearch || "");
    setRetailerSearch(params.retailerSearch || "");
    setRetailerFilter(params.retailerFilter || "All");
    setStockWarehouse(params.stockWarehouse || "All Warehouses");
    setSelectedCropParam(params.selectedCrop || null);
    setPage(targetPage);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 500ms transition time
    return () => clearTimeout(timer);
  }, [page]);

  const PAGES = {
    dashboard: <Overview tasks={tasks} onToggleTask={toggleTask} onNav={handleNav} onOpenTask={setDrawerData} onOpenCropRisk={setCropDrawerData} />,
    visitPlanner: <VisitPlannerPage />,
    aiRecommendations: <AiRecommendationsPage />,
    riskAnalyzer: <RiskAnalyzerPage />,
    retailerInsights: <RetailerInsightsPage initialSearch={retailerSearch} initialFilter={retailerFilter} />,
    growerInsights: <GrowerInsightsPage initialSearch={growerSearch} />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
    visit:    <VisitPage onNav={handleNav} />,
    revenue:  <RevenuePage onNav={handleNav} />,
    stock:    <StockPage onNav={handleNav} initialWarehouse={stockWarehouse} />,
    crop:     <CropPage onNav={handleNav} initialCrop={selectedCropParam} />,
    weather:  <WeatherPage onNav={handleNav} />,
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (role === "manager") {
    return (
      <BrowserRouter>
        <div id="manager-root" className="dark">
          <ManagerApp />
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ display:"flex", height:"100vh", background:"linear-gradient(160deg,#0A1A0F 0%,#0D1F12 50%,#080F10 100%)", fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer-bg {
            background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }
        `}</style>
        <Sidebar active={page} onNav={handleNav} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <TopBar page={page} />
          <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
            {loading ? <SkeletonLoader /> : PAGES[page]}
          </main>
        </div>
        <TaskDrawer isOpen={!!drawerData} data={drawerData} onClose={() => setDrawerData(null)} />
        <CropRiskDrawer isOpen={!!cropDrawerData} data={cropDrawerData} onClose={() => setCropDrawerData(null)} onNav={handleNav} />
      </div>
    </BrowserRouter>
  );
}
