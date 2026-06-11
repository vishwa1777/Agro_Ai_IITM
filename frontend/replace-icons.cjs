const fs = require("fs");

let code = fs.readFileSync("src/App.jsx", "utf-8");

const imports = `import { Home, Calendar, Lightbulb, Search, Store, Users, BarChart2, Settings, IndianRupee, Bell, Wheat, CloudRain, Info, ChevronDown, Check, Sun, AlertTriangle, Navigation, TrendingUp, ShieldAlert, Bug, FlaskConical, User, Phone, MessageSquare, ExternalLink, Activity, Clipboard, MapPin, Target, TrendingDown, Minus, CheckCircle, Construction, CheckSquare, CornerDownRight, Clock, Play, RefreshCw, Map, Banknote, Leaf } from "lucide-react";\n`;

if (!code.includes("lucide-react")) {
    code = code.replace("import { BarChart", imports + "import { BarChart");
}

const r = (search, replace) => {
    code = code.split(search).join(replace);
};

// NAV array
r(`icon:"🏠"`, `icon:<Home size={18}/>`);
r(`icon:"📅"`, `icon:<Calendar size={18}/>`);
r(`icon:"💡"`, `icon:<Lightbulb size={18}/>`);
r(`icon:"🔍"`, `icon:<Search size={18}/>`);
r(`icon:"🏪"`, `icon:<Store size={18}/>`);
r(`icon:"👨‍🌾"`, `icon:<Users size={18}/>`);
r(`icon:"📊"`, `icon:<BarChart2 size={18}/>`);
r(`icon:"⚙️"`, `icon:<Settings size={18}/>`);
r(`icon:"👥"`, `icon:<Users size={18}/>`);
r(`icon:"₹"`, `icon:<IndianRupee size={18}/>`);
r(`icon:"🔔"`, `icon:<Bell size={18}/>`);
r(`icon:"🌾"`, `icon:<Wheat size={18}/>`);
r(`icon:"🌧️"`, `icon:<CloudRain size={18}/>`);

// Stock data
r(`actionIcon:"🛒"`, `actionIcon:<Store size={14}/>`);
r(`actionIcon:"👁"`, `actionIcon:<Search size={14}/>`);
r(`actionIcon:"✓"`, `actionIcon:<Check size={14}/>`);

// Shared components
r(`<span>ℹ️</span>`, `<span><Info size={16}/></span>`);
r(`<span>📅</span>`, `<span><Calendar size={14}/></span>`);
r(`<span>▾</span>`, `<span><ChevronDown size={14}/></span>`);
r(`icon="📅"`, `icon={<Calendar size={22}/>}`);
r(`icon="₹"`, `icon={<IndianRupee size={22}/>}`);
r(`icon="⚠️"`, `icon={<AlertTriangle size={22}/>}`);
r(`icon="🌾"`, `icon={<Wheat size={22}/>}`);
r(`icon="🌧️"`, `icon={<CloudRain size={22}/>}`);
r(`icon="📋"`, `icon={<Clipboard size={22}/>}`);
r(`icon="🎯"`, `icon={<Target size={22}/>}`);
r(`icon="📈"`, `icon={<TrendingUp size={22}/>}`);
r(`icon="📊"`, `icon={<BarChart2 size={22}/>}`);
r(`icon="🔝"`, `icon={<Activity size={22}/>}`);
r(`icon="🔔"`, `icon={<Bell size={22}/>}`);
r(`icon="📉"`, `icon={<TrendingDown size={22}/>}`);
r(`icon="➖"`, `icon={<Minus size={22}/>}`);
r(`icon="✅"`, `icon={<CheckCircle size={22}/>}`);
r(`icon="🔍"`, `icon={<Search size={22}/>}`);
r(`icon="💸"`, `icon={<Banknote size={22}/>}`);
r(`icon="🛡️"`, `icon={<ShieldAlert size={22}/>}`);

// Sidebar
r(`>🌿<`, `><Leaf size={24}/><`);
r(`>👨‍🌾<`, `><User size={20}/><`);

// TopBar
r(`<span>⚠️</span>`, `<span><AlertTriangle size={14}/></span>`);
r(`<span>🌍</span>`, `<span><Navigation size={14}/></span>`);
r(`<span>🌧️</span>`, `<span><CloudRain size={14}/></span>`);

// Overview
r(`Amit 👋`, `Amit`);
r(`<span>☀️</span>`, `<span><Sun size={14}/></span>`);
r(`📋 Today's Tasks`, `<Clipboard size={14} style={{marginRight:8}}/> Today's Tasks`);
r(`🌾 Crop Risk`, `<Wheat size={14} style={{marginRight:8}}/> Crop Risk`);

// Task list
r(`{task.done?"✓":""}`, `{task.done ? <Check size={14} /> : null}`);

// Weather Page
r(
    `title="Weather Alert 🌨️"`,
    `title={<span>Weather Alert <CloudRain size={18} style={{marginLeft:8}}/></span>}`
);
r(`>🌧️<`, `><CloudRain size={64}/><`);
r(`<span>📍</span>`, `<span><MapPin size={14}/></span>`);
r(`<span>💧</span>`, `<span><CloudRain size={14}/></span>`);

// Placeholder
r(`>🚧<`, `><Construction size={48}/><`);

// AiRecommendationsPage
r(`<span>👨‍🌾</span>`, `<span><Users size={16}/></span>`);
r(`icon:"👤"`, `icon:<User size={14}/>`);
r(`icon:"🏪"`, `icon:<Store size={14}/>`);
r(`icon:"📍"`, `icon:<MapPin size={14}/>`);
r(`icon:"🌾"`, `icon:<Wheat size={14}/>`);
r(`<span>💡</span>`, `<span><Lightbulb size={16}/></span>`);
r(`<span>☑️</span>`, `<span><CheckSquare size={16}/></span>`);
r(`>📅<`, `><Calendar size={24}/><`);
r(`<span>✓</span>`, `<span><Check size={14}/></span>`);
r(`<span>🔗</span>`, `<span><ExternalLink size={14}/></span>`);
r(`>📅 09 Jun 2026<`, `><Calendar size={15}/> 09 Jun 2026<`);

// VisitPlannerPage
r(`>👥<`, `><Users size={24}/><`);
r(`>₹<`, `><IndianRupee size={24}/><`);
r(`>↪️<`, `><CornerDownRight size={24}/><`);
r(`>⏱️<`, `><Clock size={24}/><`);
r(`▶ Start Route`, `<Play size={16} /> Start Route`);
r(`↻ Optimize Again`, `<RefreshCw size={16} /> Optimize Again`);
r(`📍 {v.location}`, `<MapPin size={12} style={{marginRight:4}}/> {v.location}`);
r(`📅 Plan Visit`, `<Calendar size={14} style={{marginRight:4}}/> Plan Visit`);
r(`>📞<`, `><Phone size={14}/><`);
r(`>💬<`, `><MessageSquare size={14}/><`);
r(`>↗️<`, `><ExternalLink size={14}/><`);
r(`<span>🗺️</span>`, `<span><Map size={16}/></span>`);

// RiskAnalyzerPage
r(`>🪲<`, `><Bug size={20}/><`);
r(`>🧪<`, `><FlaskConical size={20}/><`);

fs.writeFileSync("src/App.jsx", code);
console.log("Replacements complete!");
