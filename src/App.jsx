import { useState, useRef, useEffect } from "react";
import { Home, Calendar, Lightbulb, Search, Store, Users, BarChart2, Settings, IndianRupee, Bell, Wheat, CloudRain, Info, ChevronDown, Check, Sun, AlertTriangle, Navigation, TrendingUp, ShieldAlert, Bug, FlaskConical, User, Phone, MessageSquare, ExternalLink, Activity, Clipboard, MapPin, Target, TrendingDown, Minus, CheckCircle, Construction, CheckSquare, CornerDownRight, Clock, Play, RefreshCw, Map, Banknote, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Area, AreaChart, PieChart, Pie, LineChart, Line } from "recharts";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const visitData = [
  { week:"W1 May 12–18", visits:2.0 }, { week:"W2 May 19–25", visits:1.0 },
  { week:"W3 May 26–Jun 1", visits:3.0 }, { week:"W4 Jun 2–8", visits:2.0 },
];
const revenueData = [
  { month:"Jan", revenue:0.80 }, { month:"Feb", revenue:1.20 }, { month:"Mar", revenue:1.50 },
  { month:"Apr", revenue:1.80 }, { month:"May", revenue:3.00 }, { month:"Jun", revenue:2.50 },
];
const stockData = [
  { name:"Actara 25 WG", pack:"100g Pack",    stock:"20 Packs",   pct:18, level:"Critical", demand:["Pest outbreak in nearby villages","High grower demand"],   supply:["Delayed distributor supply","Low warehouse stock"],  action:"Restock within 2 days", actionIcon:<Store size={14}/> },
  { name:"Custodia",      pack:"250ml Bottle", stock:"15 Bottles", pct:15, level:"Critical", demand:["Increase in cereal area","Seasonal demand rise"],           supply:["Supplier dispatch delay","High recent sales"],       action:"Restock within 2 days", actionIcon:<Store size={14}/> },
  { name:"Ridomil Gold",  pack:"250g Pack",    stock:"45 Packs",   pct:45, level:"Low",      demand:["Monsoon disease risk","Preventive applications"],           supply:["High recent sales","Replenishment in transit"],      action:"Restock within 5 days", actionIcon:<Store size={14}/> },
  { name:"Tilt 250 EC",   pack:"500ml Bottle", stock:"65 Bottles", pct:65, level:"Medium",   demand:["Weed pressure in crops","Moderate demand"],                 supply:["Stock moving normal","Some pending orders"],         action:"Monitor stock",         actionIcon:<Search size={14}/> },
  { name:"Movondo",       pack:"250ml Bottle", stock:"90 Bottles", pct:90, level:"Healthy",  demand:["Steady demand","Regular usage"],                            supply:["Stock well available","No supply issues"],           action:"No action needed",      actionIcon:<Check size={14}/> },
];
const cropData = [
  { crop:"Wheat", risk:75, level:"High" }, { crop:"Rice",  risk:45, level:"Medium" },
  { crop:"Pea",   risk:20, level:"Low" },  { crop:"Cotton",risk:60, level:"High" }, { crop:"Maize", risk:30, level:"Low" },
];
const weatherData = [
  { time:"6AM",pct:20 },{ time:"9AM",pct:40 },{ time:"12PM",pct:80 },{ time:"3PM",pct:90 },
  { time:"6PM",pct:70 },{ time:"9PM",pct:50 },{ time:"12AM",pct:30 },{ time:"3AM",pct:20 },{ time:"6AM+",pct:10 },
];
const todayTasks = [
  { id:1, type:"Visit",   text:"Ramesh Kumar — Wheat crop inspection",    time:"9:00 AM"  },
  { id:2, type:"Visit",   text:"Suresh Patel — Pesticide recommendation", time:"11:00 AM" },
  { id:3, type:"Stock",   text:"Restock Actara 25 WG at Jhansi depot",    time:"1:00 PM"  },
  { id:4, type:"Visit",   text:"Mahesh Singh — Cotton disease follow-up", time:"3:00 PM"  },
  { id:5, type:"Revenue", text:"Follow up on ₹18K pending order",         time:"4:30 PM"  },
];

const retailerData = [
  { id: 1, name: "Ganga Agri Kendra", owner: "Rajesh Gupta", phone: "+91 98765 43210", location: "Patna Tahsil, Patna", status: "Active", stockLevel: "Low Stock", outstanding: 12500, totalSales: 185000, lastVisit: "3 days ago" },
  { id: 2, name: "Kisan Seed Store", owner: "Suresh Patel", phone: "+91 98765 43211", location: "Jhansi Bypass, Jhansi", status: "Low Stock", stockLevel: "Critical", outstanding: 8000, totalSales: 152000, lastVisit: "7 days ago" },
  { id: 3, name: "Mahavir Fertilizers", owner: "Mahendra Singh", phone: "+91 98765 43212", location: "Mauranipur, Jhansi", status: "Active", stockLevel: "Healthy", outstanding: 0, totalSales: 98000, lastVisit: "12 days ago" },
  { id: 4, name: "Ram Krishi Bhandar", owner: "Ram Kumar", phone: "+91 98765 43213", location: "Babina, Jhansi", status: "Inactive", stockLevel: "Healthy", outstanding: 4500, totalSales: 75000, lastVisit: "28 days ago" },
  { id: 5, name: "Balaji Seeds & Chemicals", owner: "Vijay Sharma", phone: "+91 98765 43214", location: "Gursarai, Jhansi", status: "Active", stockLevel: "Low Stock", outstanding: 15000, totalSales: 210000, lastVisit: "Yesterday" }
];

const growerData = [
  { id: 1, name: "Ramesh Kumar", land: "12 Acres", crop: "Wheat", stage: "Tillering", risk: "High Risk", phone: "+91 94123 45678", location: "Karguwan Village", lastContact: "Today", advisory: "Apply Ridomil Gold for blight risk" },
  { id: 2, name: "Suresh Patel", land: "8 Acres", crop: "Cotton", stage: "Flowering", risk: "Medium Risk", phone: "+91 94123 45679", location: "Sajnam Village", lastContact: "3 days ago", advisory: "Monitor whitefly population closely" },
  { id: 3, name: "Mahesh Singh", land: "15 Acres", crop: "Rice", stage: "Nursery", risk: "Low Risk", phone: "+91 94123 45680", location: "Simra Village", lastContact: "5 days ago", advisory: "Irrigate crop within 2 days" },
  { id: 4, name: "Dinesh Yadav", land: "5 Acres", crop: "Maize", stage: "Vegetative", risk: "Low Risk", phone: "+91 94123 45681", location: "Bijoli Village", lastContact: "10 days ago", advisory: "Weeding required in field" },
  { id: 5, name: "Harish Chandra", land: "20 Acres", crop: "Wheat", stage: "Harvested", risk: "Low Risk", phone: "+91 94123 45682", location: "Pura Village", lastContact: "Yesterday", advisory: "Soil preparation advice for Kharif" }
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
const Sidebar = ({ active, onNav }) => (
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
    <div style={{ marginTop:"auto", padding:"20px 10px 0", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
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
const Overview = ({ tasks, onToggleTask, onNav }) => {
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

      {/* Clickable KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        <KpiCard icon={<Calendar size={22}/>} iconBg="rgba(74,222,128,0.2)"  label="Avg. Visits/Day"   value="2.0"   valueColor="#4ADE80" sub="vs Target: 2.0"    onClick={()=>onNav("visit")} />
        <KpiCard icon={<IndianRupee size={22}/>}  iconBg="rgba(234,179,8,0.2)"   label="Monthly Revenue"   value="₹3.0L" valueColor="#EAB308" sub="May 2024"           onClick={()=>onNav("revenue")} />
        <KpiCard icon={<AlertTriangle size={22}/>} iconBg="rgba(239,68,68,0.2)"   label="Critical Stocks"   value="2"     valueColor="#EF4444" sub="Need restocking"    onClick={()=>onNav("stock")} />
        <KpiCard icon={<Wheat size={22}/>} iconBg="rgba(249,115,22,0.2)"  label="High-Risk Crops"   value="2"     valueColor="#F97316" sub="Wheat & Cotton"     onClick={()=>onNav("crop")} />
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
              <div key={task.id} onClick={()=>onToggleTask(task.id)} style={{
                display:"flex", alignItems:"center", gap:14, cursor:"pointer",
                background: task.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${task.done ? "rgba(255,255,255,0.05)" : TYPE_COLOR[task.type]+"30"}`,
                borderRadius:10, padding:"10px 14px", opacity: task.done ? 0.5 : 1, transition:"opacity 0.2s",
              }}>
                <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${TYPE_COLOR[task.type]}`, background: task.done ? TYPE_COLOR[task.type] : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:"#0D1F12", fontWeight:700 }}>{task.done ? <Check size={14} /> : null}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color: task.done?"#64748B":"#CBD5E1", textDecoration: task.done?"line-through":"none", fontWeight:500 }}>{task.text}</div>
                  <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{task.time}</div>
                </div>
                <span style={{ fontSize:10, background:`${TYPE_COLOR[task.type]}15`, color:TYPE_COLOR[task.type], borderRadius:4, padding:"3px 8px", fontWeight:700 }}>{task.type}</span>
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
              <div key={d.crop} style={{ display:"flex", alignItems:"center", gap:10 }}>
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
const VisitPage = () => {
  const [filter, setFilter] = useState("Last 4 Weeks");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader icon={<Clipboard size={22}/>} title="Visit Performance" sub="Track actual field visits against the target per day"
        filterOptions={["Last 4 Weeks","Last 8 Weeks","This Month","Last Month"]} filter={filter} onFilter={setFilter} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<Calendar size={22}/>} iconBg="rgba(74,222,128,0.2)"  label="Avg. Actual Visits"  value="2.0"  valueColor="#4ADE80" sub="Visits/Day" />
        <KpiCard icon={<Target size={22}/>} iconBg="rgba(56,189,248,0.2)"  label="Target Visits/Day"   value="2.0"  valueColor="#38BDF8" sub="Visits/Day" />
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(249,115,22,0.2)"  label="Avg. Achievement"    value="100%" valueColor="#F97316" sub="of Target" />
        <KpiCard icon={<BarChart2 size={22}/>} iconBg="rgba(168,85,247,0.2)"  label="Total Actual Visits" value="8"    valueColor="#A855F7" sub="This Period" />
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Visits per Day</div>
          <div style={{ display:"flex", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94A3B8" }}><div style={{ width:14, height:14, borderRadius:3, background:"linear-gradient(#4ADE80,#16A34A)" }} /> Actual Visits (Visits/Day)</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94A3B8" }}><div style={{ width:20, height:0, borderTop:"2px dashed #CBD5E1" }} /> Target (Visits/Day)</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visitData} barSize={80} margin={{ top:20, right:20, left:-10, bottom:0 }}>
            <defs><linearGradient id="gB2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80"/><stop offset="100%" stopColor="#16A34A"/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill:"#94A3B8", fontSize:12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} domain={[0,4]} ticks={[0,1,2,3,4]} />
            <Tooltip content={<ChartTip suffix=" visits/day" />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
            <ReferenceLine y={2} stroke="#CBD5E1" strokeDasharray="6 3" strokeWidth={1.5} label={{ value:"Target: 2", position:"right", fill:"#F8FAFC", fontSize:11, dx:8 }} />
            <Bar dataKey="visits" radius={[8,8,0,0]}>{visitData.map((d,i)=><Cell key={i} fill={d.visits>=2?"url(#gB2)":"#EF4444"}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <InfoBar text="Visits per day is the average number of field visits completed by representatives per working day." />
    </div>
  );
};

// ─── REVENUE PAGE ─────────────────────────────────────────────────────────────
const RevenuePage = () => {
  const [filter, setFilter] = useState("Last 6 Months");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader icon={<IndianRupee size={22}/>} title="Monthly Revenue Generated" sub="Track revenue generated across months"
        filterOptions={["Last 6 Months","Last 3 Months","This Year","Last Year"]} filter={filter} onFilter={setFilter} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard icon={<IndianRupee size={22}/>}  iconBg="rgba(74,222,128,0.2)"  label="Total Revenue"      value="₹10.80L" valueColor="#4ADE80" sub="Last 6 Months" />
        <KpiCard icon={<TrendingUp size={22}/>} iconBg="rgba(56,189,248,0.2)"  label="Average / Month"    value="₹1.80L"  valueColor="#38BDF8" sub="Per Month" />
        <KpiCard icon={<Activity size={22}/>} iconBg="rgba(249,115,22,0.2)"  label="Highest Month"      value="₹3.00L"  valueColor="#F97316" sub="May 2024" />
        <KpiCard icon={<BarChart2 size={22}/>} iconBg="rgba(168,85,247,0.2)"  label="Growth May vs Apr"  value="+66.7%"  valueColor="#A855F7" sub="Increase" />
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Revenue Trend (₹ Lakhs)</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#94A3B8" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#84CC16" }} /> Revenue (₹)
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData} margin={{ top:20, right:20, left:-5, bottom:0 }}>
            <defs><linearGradient id="rG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#84CC16" stopOpacity={0.3}/><stop offset="90%" stopColor="#84CC16" stopOpacity={0.02}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill:"#94A3B8", fontSize:12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v}L`} domain={[0,3.5]} />
            <Tooltip content={({ active,payload,label }) => { if(!active||!payload?.length) return null; return <div style={{ background:"#0F1F14", border:"1px solid rgba(132,204,22,0.3)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#F8FAFC" }}><div style={{ color:"#94A3B8" }}>{label}</div><div style={{ color:"#84CC16", fontWeight:700 }}>₹{payload[0].value}L</div></div>; }} />
            <Area type="monotone" dataKey="revenue" stroke="#84CC16" strokeWidth={3} fill="url(#rG2)"
              dot={({ cx,cy,payload }) => <g key={payload.month}><circle cx={cx} cy={cy} r={5} fill="#84CC16"/><text x={cx} y={cy-12} textAnchor="middle" fill="#84CC16" fontSize={11} fontWeight={700}>₹{payload.revenue}L</text></g>}
              activeDot={{ r:7, fill:"#84CC16", stroke:"#0D1F12", strokeWidth:2 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ textAlign:"center", fontSize:10, color:"#64748B", marginTop:6 }}>Month</div>
      </Card>
      <InfoBar text="Revenue is calculated based on approved recommendations, product orders, and services delivered by field representatives." />
    </div>
  );
};

// ─── STOCK PAGE ───────────────────────────────────────────────────────────────
const StockPage = () => {
  const [filter, setFilter] = useState("All Warehouses");
  const [levelFilter, setLevelFilter] = useState("All");
  const counts = { Critical:0, Low:0, Medium:0, Healthy:0 };
  stockData.forEach(s=>counts[s.level]++);
  const filtered = levelFilter==="All" ? stockData : stockData.filter(s=>s.level===levelFilter);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader icon={<Bell size={22}/>} title="Stock Alert" sub="Real-time stock status across top products"
        filterOptions={["All Warehouses","Jhansi Depot","Agra Depot","Kanpur Depot"]} filter={filter} onFilter={setFilter} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { label:"Critical (≤ 20%)", count:counts.Critical, color:"#EF4444", bg:"rgba(239,68,68,0.1)",  icon:"⚠️", key:"Critical" },
          { label:"Low (21%–40%)",    count:counts.Low,      color:"#F97316", bg:"rgba(249,115,22,0.1)", icon:"📉", key:"Low" },
          { label:"Medium (41%–70%)", count:counts.Medium,   color:"#EAB308", bg:"rgba(234,179,8,0.1)",  icon:"➖", key:"Medium" },
          { label:"Healthy (> 70%)",  count:counts.Healthy,  color:"#4ADE80", bg:"rgba(74,222,128,0.1)", icon:"✅", key:"Healthy" },
        ].map(sc=>(
          <div key={sc.key} onClick={()=>setLevelFilter(l=>l===sc.key?"All":sc.key)} style={{
            background: levelFilter===sc.key ? sc.bg : "rgba(255,255,255,0.03)",
            border:`1px solid ${levelFilter===sc.key ? sc.color+"60" : sc.color+"30"}`,
            borderRadius:14, padding:"18px 20px", display:"flex", alignItems:"center", gap:14,
            cursor:"pointer", transition:"all 0.2s",
          }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:`${sc.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{sc.icon}</div>
            <div>
              <div style={{ fontSize:11, color:sc.color, fontWeight:700, marginBottom:4 }}>{sc.label}</div>
              <div style={{ fontSize:26, fontWeight:800, color:"#F8FAFC", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{sc.count} <span style={{ fontSize:13, color:"#94A3B8", fontWeight:400 }}>Products</span></div>
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
const CropPage = () => {
  const [filter, setFilter] = useState("This Season");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <PageHeader icon={<Wheat size={22}/>} title="Crop Risk Analysis" sub="Risk Percentage by Crop"
        filterOptions={["This Season","Last Season","Kharif 2024","Rabi 2024"]} filter={filter} onFilter={setFilter} />
      <Card>
        <div style={{ fontSize:13, color:"#94A3B8", marginBottom:16 }}>Risk Percentage (%)</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cropData} barSize={70} margin={{ top:20, right:20, left:-18, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="crop" tick={{ fill:"#94A3B8", fontSize:13 }} tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }} />
            <YAxis tick={{ fill:"#64748B", fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"} domain={[0,100]} ticks={[0,20,40,60,80,100]} />
            <Tooltip content={<ChartTip suffix="% risk" />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
            <Bar dataKey="risk" radius={[6,6,0,0]}>{cropData.map((d,i)=><Cell key={i} fill={CROP_COLOR(d.level)}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:14 }}>
          {[["#EF4444","High Risk (≥ 60%)"],["#F97316","Medium Risk (30%–59%)"],["#84CC16","Low Risk (< 30%)"]].map(([c,l])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#94A3B8" }}>
              <div style={{ width:12, height:12, borderRadius:3, background:c }} />{l}
            </div>
          ))}
        </div>
      </Card>
      <InfoBar text="Risk percentage is calculated based on factors like weather anomalies, pest threat, soil health, field visit data, and grower engagement." />
    </div>
  );
};

// ─── WEATHER PAGE ─────────────────────────────────────────────────────────────
const WeatherPage = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
    <PageHeader icon={<CloudRain size={22}/>} title={<span>Weather Alert <CloudRain size={18} style={{marginLeft:8}}/></span>} sub="Stay prepared for changing weather" />
    <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
      <Card style={{ background:"rgba(56,189,248,0.05)", border:"1px solid rgba(56,189,248,0.15)" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:10 }}>
          <div style={{ fontSize:80 }}><CloudRain size={64}/></div>
          <div style={{ fontSize:54, fontWeight:800, color:"#4ADE80", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>28°C</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#F8FAFC" }}>Heavy Rain Expected</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#CBD5E1" }}><span><MapPin size={14}/></span> Jhansi Region</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
            <span><CloudRain size={14}/></span><span style={{ color:"#CBD5E1" }}>Rain Probability:</span>
            <span style={{ color:"#38BDF8", fontWeight:700, fontSize:16 }}>80%</span>
          </div>
        </div>
      </Card>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Rain Forecast (Next 24 Hours)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weatherData} margin={{ top:16, right:16, left:-16, bottom:0 }}>
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
            <div style={{ fontSize:13, color:"#CBD5E1" }}>Visit nearby retailers before 2 PM to avoid heavy rain. Schedule indoor activities for the afternoon.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center", justifyContent:"center", height:"100%", color:"#64748B" }}>
    <div style={{ fontSize:48 }}><Construction size={48}/></div>
    <div style={{ fontSize:20, fontWeight:700, color:"#F8FAFC" }}>{title}</div>
    <div style={{ fontSize:14 }}>Content will be added here later.</div>
  </div>
);

const visitPlannerData = [
  { id:1, name:"Ganga Agri Kendra", score:94.5, location:"Patna Tahsil, Patna", lastVisit:"36 days ago", stockRisk:"High Stock Risk", revenue:18500, why:["High order probability","Frequent buyer","Stock replenishment needed"] },
  { id:2, name:"Kisan Seed Store", score:90.5, location:"Patna Tahsil, Patna", lastVisit:"7 days ago", stockRisk:"Critical Stock", revenue:15200, why:["Immediate restocking required","High purchase frequency"] },
  { id:3, name:"Mahavir Fertilizers", score:76.3, location:"Patna Tahsil, Patna", lastVisit:"12 days ago", stockRisk:"Medium Risk", revenue:8700, why:["Seasonal demand increase","Good conversion chance"] },
  { id:4, name:"Ram Krishi Bhandar", score:64.3, location:"Patna Tahsil, Patna", lastVisit:"8 days ago", stockRisk:"Low Risk", revenue:5600, why:["Regular buyer","Maintain relationship"] }
];

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
              <Line type="monotone" dataKey="High" stroke="#EF4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Medium" stroke="#F97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Low" stroke="#4ADE80" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Risk Distribution</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskOverviewData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {riskOverviewData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background:"#0F1F14", border:"1px solid rgba(74,222,128,0.3)", borderRadius:8, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
             {riskOverviewData.map(d=><div key={d.name} style={{fontSize:11, color:"#94A3B8"}}><span style={{color:d.color}}>●</span> {d.name} ({d.value}%)</div>)}
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
          <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:14, fontWeight:700, color:"#F8FAFC" }}>Active Risk Alerts</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                {["Risk Alert", "Category", "Location", "Impact", "Date"].map(h=>(
                  <th key={h} style={{ padding:"10px 16px", fontSize:11, color:"#64748B", fontWeight:600, textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskAlertsData.map((r,i)=>(
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
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, display:"flex", alignItems:"center", gap:8 }}><span><MapPin size={14}/></span> Patna Region ▾</div>
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#F8FAFC", fontSize:13, display:"flex", alignItems:"center", gap:8 }}><span><Calendar size={14}/></span> 09 Jun 2026 ▾</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr) auto", gap:14 }}>
        <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:24 }}><Users size={24}/></div>
          <div><div style={{ fontSize:11, color:"#94A3B8" }}>Visits Planned</div><div style={{ fontSize:22, fontWeight:800, color:"#F8FAFC" }}>8 <span style={{fontSize:12, fontWeight:400, color:"#64748B"}}>Today</span></div></div>
        </div>
        <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:24 }}><IndianRupee size={24}/></div>
          <div><div style={{ fontSize:11, color:"#94A3B8" }}>Revenue Potential</div><div style={{ fontSize:22, fontWeight:800, color:"#F8FAFC" }}>₹48,000 <span style={{fontSize:12, fontWeight:400, color:"#64748B"}}>Today</span></div></div>
        </div>
        <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:24 }}><CornerDownRight size={24}/></div>
          <div><div style={{ fontSize:11, color:"#94A3B8" }}>Total Distance</div><div style={{ fontSize:22, fontWeight:800, color:"#F8FAFC" }}>156 km <span style={{fontSize:12, fontWeight:400, color:"#64748B"}}>Optimized</span></div></div>
        </div>
        <div style={{ background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.1)", borderRadius:12, padding:"16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:24 }}><Clock size={24}/></div>
          <div><div style={{ fontSize:11, color:"#94A3B8" }}>Estimated Time</div><div style={{ fontSize:22, fontWeight:800, color:"#F8FAFC" }}>6h 20m <span style={{fontSize:12, fontWeight:400, color:"#64748B"}}>On the road</span></div></div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button style={{ background:"#16A34A", color:"#fff", border:"none", borderRadius:8, padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer", flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Play size={16} /> Start Route</button>
          <button style={{ background:"rgba(255,255,255,0.05)", color:"#F8FAFC", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 24px", fontSize:14, fontWeight:600, cursor:"pointer", flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><RefreshCw size={16} /> Optimize Again</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1.2fr", gap:20 }}>
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            {["All (8)","High Priority (4)","High Revenue","Low Stock","No Visit > 30 Days","Follow-up"].map((f,i)=>(
              <div key={f} style={{ background: i===0?"#16A34A":"rgba(255,255,255,0.05)", color: i===0?"#fff":"#CBD5E1", border:`1px solid ${i===0?"#16A34A":"rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>{f}</div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {visitPlannerData.map((v, i) => (
              <Card key={v.id} style={{ padding:"16px", display:"flex", gap:16, alignItems:"center", background: i===0||i===1?"rgba(74,222,128,0.03)":"rgba(255,255,255,0.02)", borderColor: i===0||i===1?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.07)" }}>
                <div style={{ width:70, height:70, borderRadius:"50%", border:`4px solid ${v.score>90?"#4ADE80":v.score>70?"#EAB308":"#F97316"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:20, fontWeight:800, color:"#F8FAFC", lineHeight:1 }}>{v.score}</span>
                  <span style={{ fontSize:9, color:"#94A3B8" }}>AI Score</span>
                </div>
                
                <div style={{ flex:1.2 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ background:"#4ADE80", color:"#0F1F14", fontSize:10, fontWeight:800, padding:"2px 6px", borderRadius:4 }}>{i+1}</span>
                    <span style={{ fontSize:16, fontWeight:700, color:"#F8FAFC" }}>{v.name}</span>
                  </div>
                  <div style={{ fontSize:12, color:"#94A3B8", marginTop:4, display:"flex", alignItems:"center", gap:4 }}><MapPin size={12} style={{marginRight:4}}/> {v.location}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:10 }}>
                    <div style={{ fontSize:11, color:"#64748B" }}>Last Visit: {v.lastVisit}</div>
                    <div style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background: v.stockRisk.includes("Critical")?"rgba(239,68,68,0.15)":v.stockRisk.includes("High")?"rgba(249,115,22,0.15)":v.stockRisk.includes("Medium")?"rgba(234,179,8,0.15)":"rgba(74,222,128,0.15)", color: v.stockRisk.includes("Critical")?"#EF4444":v.stockRisk.includes("High")?"#F97316":v.stockRisk.includes("Medium")?"#EAB308":"#4ADE80", fontWeight:600 }}>{v.stockRisk}</div>
                  </div>
                </div>

                <div style={{ flex:1, borderLeft:"1px solid rgba(255,255,255,0.1)", paddingLeft:16 }}>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>Revenue</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#4ADE80", marginTop:2 }}>₹{v.revenue.toLocaleString()}</div>
                </div>

                <div style={{ flex:1.5, borderLeft:"1px solid rgba(255,255,255,0.1)", paddingLeft:16 }}>
                  <div style={{ fontSize:11, color:"#94A3B8", marginBottom:4 }}>Why Visit?</div>
                  {v.why.map(w=><div key={w} style={{ fontSize:11, color:"#CBD5E1", display:"flex", alignItems:"flex-start", gap:6, marginBottom:2 }}><span style={{color:"#4ADE80"}}>•</span> {w}</div>)}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                  <button style={{ background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:6, padding:"6px 12px", color:"#4ADE80", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}><Calendar size={14} style={{marginRight:4}}/> Plan Visit <span style={{fontSize:10}}>⋮</span></button>
                  <div style={{ display:"flex", gap:6 }}>
                    {["📞","💬","↗️"].map(icon=><button key={icon} style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#F8FAFC", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>{icon}</button>)}
                  </div>
                </div>
              </Card>
            ))}
            <div style={{ textAlign:"center", fontSize:13, color:"#4ADE80", marginTop:10, cursor:"pointer" }}>View all 8 visits ▾</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", display:"flex", alignItems:"center", gap:8 }}><span><Map size={16}/></span> Optimized Route</div>
              <div style={{ fontSize:12, color:"#4ADE80", cursor:"pointer" }}>View Full Map ▾</div>
            </div>
            <div style={{ height:250, background:"#0A1A0F", position:"relative", overflow:"hidden" }}>
              {/* Fake Map Background */}
              <div style={{ position:"absolute", inset:0, opacity:0.3, backgroundImage:"radial-gradient(circle at 50% 50%, #16A34A 1px, transparent 1px)", backgroundSize:"20px 20px" }}></div>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="100%" height="100%" viewBox="0 0 400 250">
                  <path d="M 100,120 L 150,80 L 250,50 L 320,100 L 300,180 L 200,200 Z" fill="none" stroke="#4ADE80" strokeWidth="2" strokeDasharray="4 4" />
                  {[
                    {x:100,y:120,n:1},{x:150,y:80,n:2},{x:250,y:50,n:3},{x:320,y:100,n:5},{x:300,y:180,n:8},{x:200,y:200,n:4}
                  ].map(pt => (
                    <g key={pt.n}>
                      <circle cx={pt.x} cy={pt.y} r="10" fill="#16A34A" stroke="#0D1F12" strokeWidth="2" />
                      <text x={pt.x} y={pt.y+4} fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">{pt.n}</text>
                    </g>
                  ))}
                  <circle cx="200" cy="130" r="8" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { n:1, t:"Ganga Agri Kendra", d:"0 km" },
                { n:2, t:"Kisan Seed Store", d:"8 km" },
                { n:3, t:"Mahavir Fertilizers", d:"12 km" },
                { n:4, t:"Ram Krishi Bhandar", d:"5 km" }
              ].map(item=>(
                <div key={item.n} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                  <div style={{ display:"flex", gap:10, color:"#CBD5E1" }}><span style={{ color:"#4ADE80" }}>{item.n}</span> {item.t}</div>
                  <div style={{ color:"#64748B" }}>{item.d}</div>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:700, color:"#F8FAFC", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:10, marginTop:4 }}>
                <div>Total Distance</div>
                <div style={{ color:"#4ADE80" }}>156 km</div>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize:14, fontWeight:700, color:"#F8FAFC", marginBottom:16 }}>Today's Progress</div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <div style={{ width:70, height:70, borderRadius:"50%", border:"5px solid rgba(74,222,128,0.2)", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg style={{ position:"absolute", top:-5, left:-5, width:80, height:80 }} viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#4ADE80" strokeWidth="5" strokeDasharray="220" strokeDashoffset="136" strokeLinecap="round" transform="rotate(-90 40 40)" />
                </svg>
                <div style={{ fontSize:18, fontWeight:800, color:"#F8FAFC" }}>38%</div>
              </div>
              <div style={{ flex:1, display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>Visits Completed</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#F8FAFC", marginTop:4 }}>3 / 8</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>Orders Generated</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#F8FAFC", marginTop:4 }}>₹12,400</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>Revenue Target</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#F8FAFC", marginTop:4 }}>₹48,000</div>
                </div>
              </div>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:3, marginTop:20 }}>
              <div style={{ width:"38%", height:"100%", background:"#4ADE80", borderRadius:3 }}></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── RETAILER INSIGHTS PAGE ───────────────────────────────────────────────────
const RetailerInsightsPage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  
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
              background: filter === f ? "#16A34A" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#FFF" : "#CBD5E1",
              border: `1px solid ${filter === f ? "#16A34A" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", width: 260 }}>
          <Search size={16} color="#64748B" />
          <input type="text" placeholder="Search retailer or owner..." value={search} onChange={e => setSearch(e.target.value)} style={{
            background: "transparent", border: "none", color: "#F8FAFC", fontSize: 13, outline: "none", width: "100%", fontFamily: "'DM Sans',sans-serif"
          }} />
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
const GrowerInsightsPage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  
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
              background: filter === f ? "#16A34A" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#FFF" : "#CBD5E1",
              border: `1px solid ${filter === f ? "#16A34A" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", width: 260 }}>
          <Search size={16} color="#64748B" />
          <input type="text" placeholder="Search grower or village..." value={search} onChange={e => setSearch(e.target.value)} style={{
            background: "transparent", border: "none", color: "#F8FAFC", fontSize: 13, outline: "none", width: "100%", fontFamily: "'DM Sans',sans-serif"
          }} />
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

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [depot, setDepot] = useState("Jhansi Depot");
  const [stockAlerts, setStockAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("10 June 2026, 04:30 AM");

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date();
      setLastSync(now.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 800 }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#4ADE80", fontWeight: 700 }}>
          AS
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", fontFamily: "'Space Grotesk',sans-serif" }}>Amit Sharma</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Field Representative | Jhansi Region</div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Employee ID: #AGR-49102  •  amit.sharma@agroai.com</div>
        </div>
      </Card>

      <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>Regional Configuration</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 12, color: "#94A3B8" }}>Primary Warehousing Depot</label>
          <select value={depot} onChange={e => setDepot(e.target.value)} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
            padding: "10px 14px", color: "#CBD5E1", fontSize: 13, width: "100%", outline: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif"
          }}>
            <option value="Jhansi Depot" style={{ background: "#0D1F12", color: "#CBD5E1" }}>Jhansi Depot (Primary)</option>
            <option value="Agra Depot" style={{ background: "#0D1F12", color: "#CBD5E1" }}>Agra Depot</option>
            <option value="Kanpur Depot" style={{ background: "#0D1F12", color: "#CBD5E1" }}>Kanpur Depot</option>
          </select>
        </div>
      </Card>

      <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>Notification Alerts</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
              <button onClick={() => opt.setState(s => !s)} style={{
                background: opt.state ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${opt.state ? "#4ADE80" : "rgba(255,255,255,0.1)"}`,
                color: opt.state ? "#4ADE80" : "#64748B",
                borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
              }}>
                {opt.state ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Offline Data Synchronization</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Last synced: {lastSync}</div>
        </div>
        <button onClick={handleSync} disabled={syncing} style={{
          background: syncing ? "rgba(255,255,255,0.05)" : "rgba(74,222,128,0.12)",
          color: syncing ? "#64748B" : "#4ADE80",
          border: `1px solid ${syncing ? "rgba(255,255,255,0.1)" : "rgba(74,222,128,0.25)"}`,
          borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: syncing ? "default" : "pointer", transition: "all 0.15s"
        }}>
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </Card>
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

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]   = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState(todayTasks.map(t=>({...t, done:false})));
  const toggleTask = id => setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 500ms transition time
    return () => clearTimeout(timer);
  }, [page]);

  const PAGES = {
    dashboard: <Overview tasks={tasks} onToggleTask={toggleTask} onNav={setPage} />,
    visitPlanner: <VisitPlannerPage />,
    aiRecommendations: <AiRecommendationsPage />,
    riskAnalyzer: <RiskAnalyzerPage />,
    retailerInsights: <RetailerInsightsPage />,
    growerInsights: <GrowerInsightsPage />,
    analytics: <PlaceholderPage title="Analytics" />,
    settings: <SettingsPage />,
    visit:    <VisitPage />,
    revenue:  <RevenuePage />,
    stock:    <StockPage />,
    crop:     <CropPage />,
    weather:  <WeatherPage />,
  };

  return (
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
      <Sidebar active={page} onNav={setPage} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <TopBar page={page} />
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
          {loading ? <SkeletonLoader /> : PAGES[page]}
        </main>
      </div>
    </div>
  );
}
