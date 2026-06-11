/**
 * AgroAI — Database Seed Script
 * ─────────────────────────────────────────────────────────────────
 * Seeds: Users (12), Retailers (30), Growers (60), Products (20),
 *        Visits (120), Tasks (50), Revenue (24 months × 3 regions),
 *        CropRisk (80), WeatherAlerts (15)
 *
 * Run:  node seed.js
 * Reset: node seed.js --fresh   (drops everything first)
 * ─────────────────────────────────────────────────────────────────
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// ─── MINI MODEL DEFINITIONS ──────────────────────────────────────────────────
// Defined inline so seed.js is self-contained (no import path hell).

const { Schema, model } = mongoose;

// User
const userSchema = new Schema({ name:String, email:{type:String,unique:true}, password:String, role:String, region:String }, { timestamps:true });
const User = mongoose.models.User || model("User", userSchema);

// Retailer
// Retailer
const retailerSchema = new Schema({
  retailer_id: { 
    type: String, 
    unique: true, 
    default: () => `RTL${Date.now()}${Math.floor(Math.random() * 1000)}` 
  },
  name:String, owner:String, phone:String, location:String, address:String,
  status:{ type:String, enum:["Active","Inactive","Low Stock"], default:"Active" },
  stockLevel:{ type:String, enum:["Critical","Low Stock","Medium","Healthy"], default:"Healthy" },
  alertLevel:{ type:String, enum:["Critical","Low Stock","Medium","Healthy"], default:"Healthy" },
  outstanding:{ type:Number, default:0 },
  outstandingBalance:{ type:Number, default:0 },
  totalSales: { type:Number, default:0 },
  // ... keep the rest of your fields exactly as they are
}, { timestamps: true });
const Retailer = mongoose.models.Retailer || model("Retailer", retailerSchema);

// Grower
const growerSchema = new Schema({
  name:String, phone:String, location:String, village:String,
  land:String, landArea:Number,
  crop:String, stage:String,
  risk:{ type:String, enum:["High Risk","Medium Risk","Low Risk"], default:"Low Risk" },
  riskLevel:{ type:String, enum:["High","Medium","Low"], default:"Low" },
  riskScore:{ type:Number, default:0 },
  lastContact:String, advisory:String, region:String,
  fieldAgent:{ type:Schema.Types.ObjectId, ref:"User" },
}, { timestamps:true });
const Grower = mongoose.models.Grower || model("Grower", growerSchema);

// Product
const productSchema = new Schema({
  name:String, category:String,
  stock:Number, quantity:Number,
  capacity:Number, maxStock:Number,
  unit:String, packSize:String, pack:String,
  alertLevel:{ type:String, enum:["Critical","Low","Medium","Healthy"], default:"Healthy" },
  price:Number, manufacturer:String,
}, { timestamps:true });
const Product = mongoose.models.Product || model("Product", productSchema);

// Visit
const visitSchema = new Schema({
  fieldAgent:{ type:Schema.Types.ObjectId, ref:"User" },
  retailer:  { type:Schema.Types.ObjectId, ref:"Retailer" },
  grower:    { type:Schema.Types.ObjectId, ref:"Grower" },
  status:    { type:String, enum:["completed","pending","cancelled","rescheduled"], default:"pending" },
  date:      Date,
  notes:     String,
  orderValue:Number,
  purpose:   String,
  region:    String,
}, { timestamps:true });
const Visit = mongoose.models.Visit || model("Visit", visitSchema);

// Task
const taskSchema = new Schema({
  title:String, text:String,
  type:{ type:String, enum:["Visit","Stock","Revenue","Task","Advisory"], default:"Task" },
  completed:{ type:Boolean, default:false },
  dueDate:Date, time:String,
  assignedTo:{ type:Schema.Types.ObjectId, ref:"User" },
  priority:{ type:String, enum:["high","medium","low"], default:"medium" },
  region:String,
}, { timestamps:true });
const Task = mongoose.models.Task || model("Task", taskSchema);

// Revenue
const revenueSchema = new Schema({
  month:String, year:Number,
  amount:Number, revenue:Number,
  region:String, target:Number,
  products:Number, visits:Number,
}, { timestamps:true });
const Revenue = mongoose.models.Revenue || model("Revenue", revenueSchema);

// CropRisk
const cropRiskSchema = new Schema({
  crop:String, riskLevel:{ type:String, enum:["High","Medium","Low"], default:"Low" },
  riskScore:Number, affectedArea:Number,
  region:String, season:String,
  causes:[String], recommendation:String,
  grower:{ type:Schema.Types.ObjectId, ref:"Grower" },
}, { timestamps:true });
const CropRisk = mongoose.models.CropRisk || model("CropRisk", cropRiskSchema);

// WeatherAlert
const weatherAlertSchema = new Schema({
  description:String, location:String, region:String,
  temperature:Number, humidity:Number, windSpeed:Number,
  precipitation_probability:Number,
  current_weather:{ temperature:Number, weathercode:Number, windspeed:Number },
  hourly:{ time:[String], precipitation_probability:[Number] },
  suggestion:String, severity:{ type:String, enum:["Low","Medium","High"], default:"Medium" },
}, { timestamps:true });
const WeatherAlert = mongoose.models.WeatherAlert || model("WeatherAlert", weatherAlertSchema);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max, dp=1) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));
const ago   = (days) => { const d = new Date(); d.setDate(d.getDate() - days); return d; };
const future= (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d; };

// ─── MASTER DATA ─────────────────────────────────────────────────────────────

const REGIONS = ["Jhansi Region","Patna Region","Agra Region","Kanpur Region","Lucknow Region"];

const VILLAGES = [
  "Karguwan","Sajnam","Simra","Bijoli","Pura","Mauranipur","Babina","Gursarai",
  "Dhanora","Talbahat","Moth","Chirgaon","Bangra","Parichha","Ranipur","Dhauva",
  "Barua Sagar","Mau Ranipur","Khailar","Niwari","Orchha","Tikamgarh","Datia",
  "Shivpuri","Gwalior Nagar","Phulwari Sharif","Danapur","Patna Sahib","Hajipur",
];

const FIRST_NAMES = [
  "Ramesh","Suresh","Mahesh","Dinesh","Harish","Rajesh","Vijay","Anil","Santosh",
  "Mukesh","Rakesh","Ganesh","Umesh","Naresh","Girish","Brijesh","Kamlesh","Trilok",
  "Pradeep","Ashok","Vinod","Manoj","Sanjay","Deepak","Ravi","Amit","Ankit","Vishal",
  "Dharmendra","Surendra","Birendra","Jitendra","Narendra","Bhupendra","Devendra",
];
const LAST_NAMES = [
  "Kumar","Patel","Singh","Sharma","Yadav","Gupta","Verma","Tiwari","Mishra","Joshi",
  "Chaudhary","Pandey","Tripathi","Dubey","Shukla","Srivastava","Bajpai","Chauhan",
  "Rajput","Thakur","Rai","Shah","Agarwal","Garg","Saxena","Pathak","Bose","Das",
];
const fullName = () => `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
const phone    = () => `+91 ${rand(70000,99999)} ${rand(10000,99999)}`;

const AGRI_STORES = [
  "Kisan Seva Kendra","Agri Bhandar","Krishi Vigyan Store","Beej Bhandar",
  "Kisan Seed Store","Ganga Agri Kendra","Mahavir Fertilizers","Ram Krishi Bhandar",
  "Balaji Seeds & Chemicals","Shree Agro Centre","Bharat Beej Bhandar","Green Agro Store",
  "Jai Kisan Kendra","Vishnu Agri Shop","Shiv Shakti Seeds","Nandan Fertilisers",
  "Prem Krishi Udyog","Surya Agro Mart","Sanjivani Crop Care","Hari Om Beej Bhandar",
  "Lakshmi Agri Services","Durga Krishi Store","Saraswati Fertilizers","Ganesh Agro Hub",
  "New India Agri Depot","Kishan Mitra Kendra","Jeevan Agro Centre","Pragati Seeds",
  "Samridhi Agri Store","Veer Krishi Bhandar",
];

const CROPS = ["Wheat","Rice","Cotton","Maize","Soybean","Mustard","Gram","Lentil","Sugarcane","Potato","Onion","Tomato"];
const CROP_STAGES = {
  Wheat:    ["Sowing","Germination","Tillering","Jointing","Heading","Maturity","Harvested"],
  Rice:     ["Nursery","Transplanting","Tillering","Panicle Initiation","Heading","Maturity","Harvested"],
  Cotton:   ["Sowing","Seedling","Vegetative","Squaring","Flowering","Boll Development","Harvested"],
  Maize:    ["Sowing","Germination","Vegetative","Tasseling","Silking","Grain Fill","Harvested"],
  Soybean:  ["Sowing","Germination","Vegetative","Flowering","Pod Fill","Maturity","Harvested"],
  Mustard:  ["Sowing","Vegetative","Flowering","Pod Formation","Maturity","Harvested"],
  Gram:     ["Sowing","Germination","Vegetative","Flowering","Pod Fill","Maturity","Harvested"],
  Lentil:   ["Sowing","Germination","Vegetative","Flowering","Pod Fill","Harvested"],
  Sugarcane:["Planting","Tillering","Grand Growth","Maturation","Harvested"],
  Potato:   ["Planting","Emergence","Vegetative","Tuber Initiation","Bulking","Maturity","Harvested"],
  Onion:    ["Transplanting","Vegetative","Bulbing","Maturity","Harvested"],
  Tomato:   ["Transplanting","Vegetative","Flowering","Fruiting","Harvested"],
};

const ADVISORIES = [
  "Apply Ridomil Gold for blight risk — 150ml/acre recommended.",
  "Monitor whitefly population closely. Use yellow sticky traps.",
  "Irrigate crop within 2 days — soil moisture critically low.",
  "Apply urea top dressing — nitrogen deficiency observed.",
  "Spray Actara 25 WG for aphid and thrip control.",
  "Tilt 250 EC recommended for rust prevention.",
  "Bollworm pheromone traps deployment suggested immediately.",
  "Border crop of maize recommended against pest infiltration.",
  "Zinc sulphate spray advised for yellowing leaves.",
  "Apply Mancozeb at 0.2% concentration for leaf spot disease.",
  "Weed management needed — manual or Pendimethalin spray.",
  "Delay next irrigation by 3 days — waterlogging risk.",
  "Soil preparation for next Kharif season can begin.",
  "Regular monitoring for stem borer infestation advised.",
  "Apply potassium nitrate foliar spray for improved yield.",
  "No active advisory — crop is healthy. Monitor weekly.",
];

const PRODUCTS_DATA = [
  { name:"Actara 25 WG",     category:"Insecticide",  unit:"100g Pack",   price:380,  manufacturer:"Syngenta", capacity:200 },
  { name:"Custodia",         category:"Fungicide",    unit:"250ml Bottle",price:620,  manufacturer:"Syngenta", capacity:150 },
  { name:"Ridomil Gold MZ",  category:"Fungicide",    unit:"250g Pack",   price:540,  manufacturer:"Syngenta", capacity:180 },
  { name:"Tilt 250 EC",      category:"Fungicide",    unit:"500ml Bottle",price:480,  manufacturer:"Syngenta", capacity:160 },
  { name:"Movento 150 OD",   category:"Insecticide",  unit:"250ml Bottle",price:720,  manufacturer:"Bayer",    capacity:120 },
  { name:"Confidor 200 SL",  category:"Insecticide",  unit:"100ml Bottle",price:340,  manufacturer:"Bayer",    capacity:200 },
  { name:"Headline EC",      category:"Fungicide",    unit:"250ml Bottle",price:890,  manufacturer:"BASF",     capacity:100 },
  { name:"Coragen 20 SC",    category:"Insecticide",  unit:"60ml Bottle", price:1250, manufacturer:"FMC",      capacity:90  },
  { name:"Ampligo 150 ZC",   category:"Insecticide",  unit:"100ml Bottle",price:980,  manufacturer:"Syngenta", capacity:110 },
  { name:"Score 250 EC",     category:"Fungicide",    unit:"100ml Bottle",price:290,  manufacturer:"Syngenta", capacity:200 },
  { name:"Thimet 10G",       category:"Insecticide",  unit:"5kg Pack",    price:185,  manufacturer:"Bayer",    capacity:300 },
  { name:"Redomil Gold 68",  category:"Fungicide",    unit:"500g Pack",   price:760,  manufacturer:"Syngenta", capacity:140 },
  { name:"Karate Zeon 5CS",  category:"Insecticide",  unit:"100ml Bottle",price:220,  manufacturer:"Syngenta", capacity:250 },
  { name:"Vertimec 18 EC",   category:"Insecticide",  unit:"250ml Bottle",price:840,  manufacturer:"Syngenta", capacity:130 },
  { name:"Amistar Top SC",   category:"Fungicide",    unit:"100ml Bottle",price:560,  manufacturer:"Syngenta", capacity:160 },
  { name:"Regent Ultra",     category:"Insecticide",  unit:"200ml Bottle",price:410,  manufacturer:"Bayer",    capacity:180 },
  { name:"Topsin-M 70 WP",   category:"Fungicide",    unit:"100g Pack",   price:175,  manufacturer:"Indofil",  capacity:300 },
  { name:"Dursban 20 EC",    category:"Insecticide",  unit:"500ml Bottle",price:260,  manufacturer:"Dow",      capacity:200 },
  { name:"Bavistin 50 WP",   category:"Fungicide",    unit:"100g Pack",   price:130,  manufacturer:"BASF",     capacity:350 },
  { name:"Vitavax Power",    category:"Seed Treatment",unit:"250g Pack",  price:320,  manufacturer:"Bayer",    capacity:200 },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const VISIT_PURPOSES = [
  "Stock replenishment discussion","Pending payment collection","New product demo",
  "Crop advisory session","Relationship maintenance","Complaint resolution",
  "Seasonal order booking","Field inspection","Disease outbreak response",
  "Scheme registration assistance","Fertilizer recommendation","Soil health review",
];

const TASK_TITLES = [
  (r) => `Visit ${r} — stock inspection`,
  (r) => `Collect ₹${rand(5,50)*1000} outstanding from ${r}`,
  (r) => `Demo Actara 25 WG at ${r}`,
  (r) => `Follow-up advisory for ${r}`,
  (r) => `Resolve complaint at ${r}`,
  (r) => `Seasonal order booking at ${r}`,
  ()  => `Restock Ridomil Gold at Jhansi depot`,
  ()  => `Submit weekly visit report to manager`,
  ()  => `Follow up on ₹${rand(10,80)*1000} pending order`,
  ()  => `Attend regional field meeting`,
  ()  => `Upload grower advisory data`,
  ()  => `Review crop risk alerts for the region`,
];

const WEATHER_DESCS = [
  "Heavy Rain Expected","Moderate Rain","Partly Cloudy","Clear & Sunny",
  "Thunderstorm Warning","Foggy Morning","Strong Winds Alert","Heat Wave Alert",
  "Drizzle Expected","Overcast Sky",
];
const WEATHER_SUGGESTIONS = [
  "Visit retailers before 2 PM to avoid heavy rain. Schedule indoor activities for afternoon.",
  "Postpone field visits. Advise growers to protect crops from waterlogging.",
  "Good day for field visits. Carry crop advisory materials.",
  "Ideal conditions for pest scouting. Schedule grower visits.",
  "Avoid outdoor visits. Alert growers about thunderstorm risk.",
  "Visibility low in morning. Delay visits until 10 AM.",
  "Secure demonstration materials. Wind may hamper spraying operations.",
  "Early morning visits recommended. Avoid midday heat exposure.",
  "Light rain — carry waterproof equipment. Visits can proceed.",
  "No weather concerns today. Proceed with planned visit schedule.",
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  const isFresh = process.argv.includes("--fresh");

  console.log("\n🌱  AgroAI Database Seeder");
  console.log("─".repeat(50));

  // Connect
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/agroai";
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}?appName=Cluster0`);
  console.log(`✅  Connected to MongoDB: ${uri}\n`);

  if (isFresh) {
    console.log("🗑   --fresh flag detected. Dropping all collections…");
    await Promise.all([
      User.deleteMany({}), Retailer.deleteMany({}), Grower.deleteMany({}),
      Product.deleteMany({}), Visit.deleteMany({}), Task.deleteMany({}),
      Revenue.deleteMany({}), CropRisk.deleteMany({}), WeatherAlert.deleteMany({}),
    ]);
    console.log("✅  All collections cleared.\n");
  }

  // ── 1. USERS (12) ──────────────────────────────────────────────────────────
  console.log("👤  Seeding users…");
  const hashedPw = await bcrypt.hash("password123", 10);
  const usersData = [
    // Demo account (always predictable)
    { name:"Amit Sharma",   email:"amit@agroai.com",   password:hashedPw, role:"Field Representative", region:"Jhansi Region"  },
    { name:"Neha Verma",    email:"neha@agroai.com",   password:hashedPw, role:"Regional Manager",     region:"Patna Region"   },
    { name:"Rohit Gupta",   email:"rohit@agroai.com",  password:hashedPw, role:"Field Representative", region:"Agra Region"    },
    { name:"Priya Singh",   email:"priya@agroai.com",  password:hashedPw, role:"Agronomist",           region:"Kanpur Region"  },
    { name:"Karan Joshi",   email:"karan@agroai.com",  password:hashedPw, role:"Field Representative", region:"Lucknow Region" },
    { name:"Ritu Tiwari",   email:"ritu@agroai.com",   password:hashedPw, role:"Sales Executive",      region:"Jhansi Region"  },
    { name:"Deepak Yadav",  email:"deepak@agroai.com", password:hashedPw, role:"Field Representative", region:"Patna Region"   },
    { name:"Sunita Patel",  email:"sunita@agroai.com", password:hashedPw, role:"Agronomist",           region:"Agra Region"    },
    { name:"Vikas Mishra",  email:"vikas@agroai.com",  password:hashedPw, role:"Field Representative", region:"Kanpur Region"  },
    { name:"Pooja Dubey",   email:"pooja@agroai.com",  password:hashedPw, role:"Regional Manager",     region:"Lucknow Region" },
    { name:"Sumit Chauhan", email:"sumit@agroai.com",  password:hashedPw, role:"Sales Executive",      region:"Jhansi Region"  },
    { name:"Anjali Rajput", email:"anjali@agroai.com", password:hashedPw, role:"Field Representative", region:"Patna Region"   },
  ];
  const users = await User.insertMany(usersData, { ordered:false }).catch(handleDup);
  console.log(`   ✔ ${users.length ?? usersData.length} users seeded`);

  // Fetch inserted users for references
  const allUsers = await User.find({});
  const fieldAgents = allUsers.filter(u => u.role === "Field Representative");

  // ── 2. RETAILERS (30) ──────────────────────────────────────────────────────
  console.log("🏪  Seeding retailers…");
  const stockLevels   = ["Critical","Critical","Low Stock","Low Stock","Medium","Medium","Medium","Healthy","Healthy","Healthy"];
  const statusOptions = ["Active","Active","Active","Active","Active","Low Stock","Inactive"];
  const retailersData = AGRI_STORES.map((storeName, i) => {
    const sl = pick(stockLevels);
    const outstanding = sl==="Critical"?rand(8,40)*1000 : sl==="Low Stock"?rand(3,15)*1000 : rand(0,5)*1000;
    const totalSales  = rand(60,350)*1000;
    const daysAgo     = rand(0,45);
    const lastVisitStr = daysAgo===0?"Today":daysAgo===1?"Yesterday":`${daysAgo} days ago`;
    const region = REGIONS[i % REGIONS.length];
    const village = pick(VILLAGES);
    return {
      name: storeName, owner: fullName(), phone: phone(),
      location: `${village}, ${region.replace(" Region","")}`,
      address:  `${rand(1,250)}, Main Market, ${village}`,
      status:   pick(statusOptions),
      stockLevel: sl, alertLevel: sl,
      outstanding, outstandingBalance: outstanding,
      totalSales, lastVisit: lastVisitStr, region,
    };
  });
  const retailers = await Retailer.insertMany(retailersData);
  console.log(`   ✔ ${retailers.length} retailers seeded`);

  // ── 3. GROWERS (60) ────────────────────────────────────────────────────────
  console.log("🌾  Seeding growers…");
  const riskDistribution = ["High Risk","High Risk","High Risk","Medium Risk","Medium Risk","Medium Risk","Medium Risk","Low Risk","Low Risk","Low Risk"];
  const growersData = Array.from({ length: 60 }, (_, i) => {
    const crop     = pick(CROPS);
    const stages   = CROP_STAGES[crop] || ["Sowing","Vegetative","Maturity","Harvested"];
    const stage    = pick(stages);
    const risk     = pick(riskDistribution);
    const riskLvl  = risk.split(" ")[0]; // "High" | "Medium" | "Low"
    const riskScore= riskLvl==="High"?rand(62,95):riskLvl==="Medium"?rand(35,61):rand(5,34);
    const land     = rand(3,30);
    const region   = REGIONS[i % REGIONS.length];
    const village  = pick(VILLAGES);
    const daysAgo  = rand(0,21);
    const lastContactStr = daysAgo===0?"Today":daysAgo===1?"Yesterday":`${daysAgo} days ago`;
    return {
      name: fullName(), phone: phone(),
      location: `${village}, ${region.replace(" Region","")}`,
      village,
      land: `${land} Acres`, landArea: land,
      crop, stage,
      risk, riskLevel: riskLvl, riskScore,
      lastContact: lastContactStr,
      advisory: pick(ADVISORIES),
      region,
      fieldAgent: pick(fieldAgents)?._id,
    };
  });
  const growers = await Grower.insertMany(growersData);
  console.log(`   ✔ ${growers.length} growers seeded`);

  // ── 4. PRODUCTS (20) ───────────────────────────────────────────────────────
  console.log("📦  Seeding products…");
  const productsData = PRODUCTS_DATA.map((p) => {
    const stock = rand(5, p.capacity);
    const pct   = Math.round((stock / p.capacity) * 100);
    const alertLevel = pct <= 20 ? "Critical" : pct <= 40 ? "Low" : pct <= 70 ? "Medium" : "Healthy";
    return {
      ...p, stock, quantity: stock, packSize: p.unit, pack: p.unit, alertLevel,
    };
  });
  const products = await Product.insertMany(productsData);
  console.log(`   ✔ ${products.length} products seeded`);

  // ── 5. VISITS (120) ────────────────────────────────────────────────────────
  console.log("📋  Seeding visits…");
  const visitStatuses = ["completed","completed","completed","completed","pending","pending","cancelled","rescheduled"];
  const visitsData = Array.from({ length: 120 }, (_, i) => {
    const status     = pick(visitStatuses);
    const daysAgo    = rand(0, 90);
    const orderValue = status==="completed" ? rand(3,50)*1000 : 0;
    return {
      fieldAgent: pick(fieldAgents)?._id,
      retailer:   retailers[i % retailers.length]?._id,
      grower:     Math.random() > 0.5 ? growers[i % growers.length]?._id : undefined,
      status,
      date:       ago(daysAgo),
      notes:      pick(VISIT_PURPOSES),
      orderValue,
      purpose:    pick(VISIT_PURPOSES),
      region:     REGIONS[i % REGIONS.length],
    };
  });
  const visits = await Visit.insertMany(visitsData);
  console.log(`   ✔ ${visits.length} visits seeded`);

  // ── 6. TASKS (50) ──────────────────────────────────────────────────────────
  console.log("✅  Seeding tasks…");
  const taskTypes  = ["Visit","Visit","Visit","Stock","Revenue","Task","Advisory"];
  const priorities = ["high","high","medium","medium","low"];
  const tasksData  = Array.from({ length: 50 }, (_, i) => {
    const retailerName = retailers[i % retailers.length]?.name ?? "Retailer";
    const titleFn = TASK_TITLES[i % TASK_TITLES.length];
    const title   = titleFn(retailerName);
    const type    = pick(taskTypes);
    const daysAhead = rand(-3, 7);
    const dueDate   = daysAhead >= 0 ? future(daysAhead) : ago(-daysAhead);
    const timeHour  = rand(8, 18);
    const timeStr   = `${timeHour}:${rand(0,1)*3}0 ${timeHour<12?"AM":"PM"}`;
    return {
      title, text: title, type,
      completed: daysAhead < 0 ? Math.random() > 0.3 : false,
      dueDate, time: timeStr,
      assignedTo: pick(allUsers)?._id,
      priority: pick(priorities),
      region: REGIONS[i % REGIONS.length],
    };
  });
  const tasks = await Task.insertMany(tasksData);
  console.log(`   ✔ ${tasks.length} tasks seeded`);

  // ── 7. REVENUE (24 months × 5 regions = 72 records) ───────────────────────
  console.log("💰  Seeding revenue…");
  const revenueData = [];
  const now = new Date();
  for (let r = 0; r < REGIONS.length; r++) {
    for (let m = 23; m >= 0; m--) {
      const d      = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const month  = MONTHS[d.getMonth()];
      const year   = d.getFullYear();
      // Seasonal variation: higher in Mar–Jun (Rabi harvest) and Oct–Dec (Kharif)
      const monthIdx   = d.getMonth(); // 0=Jan
      const seasonal   = [0.7,0.8,1.4,1.6,1.8,1.5,0.9,0.8,1.0,1.3,1.4,1.1][monthIdx];
      const baseRevenue = rand(120000, 280000) * seasonal;
      const amount  = Math.round(baseRevenue / 1000) * 1000;
      const target  = Math.round(rand(180000, 250000) / 1000) * 1000;
      revenueData.push({
        month, year, amount, revenue: amount,
        region: REGIONS[r],
        target,
        products: rand(5, 18),
        visits:   rand(8, 25),
      });
    }
  }
  const revenues = await Revenue.insertMany(revenueData);
  console.log(`   ✔ ${revenues.length} revenue records seeded (24 months × ${REGIONS.length} regions)`);

  // ── 8. CROP RISKS (80) ─────────────────────────────────────────────────────
  console.log("🌿  Seeding crop risks…");
  const CROP_CAUSES = {
    High:   [
      ["Bollworm infestation","High temperature","Low humidity"],
      ["Blast disease detected","Excessive rainfall","Poor drainage"],
      ["Aphid outbreak","Dry spell","Nutrient deficiency"],
      ["Whitefly pressure","High humidity","Fungal spread"],
      ["Rust detected","Overcast weather","Dense canopy"],
    ],
    Medium: [
      ["Moderate pest pressure","Irregular rainfall"],
      ["Mild fungal symptoms","Temperature fluctuation"],
      ["Weed competition","Delayed irrigation"],
    ],
    Low:    [
      ["Crop is healthy","Regular monitoring in progress"],
      ["Minor insect activity","Controlled"],
      ["No significant threat","Preventive care applied"],
    ],
  };
  const SEASONS = ["Kharif 2024","Rabi 2024","Kharif 2025","Rabi 2025","Kharif 2026"];
  const riskLevelDist = [
    ...Array(25).fill("High"),
    ...Array(30).fill("Medium"),
    ...Array(25).fill("Low"),
  ];
  const cropRisksData = Array.from({ length: 80 }, (_, i) => {
    const crop     = pick(CROPS);
    const riskLevel= riskLevelDist[i % riskLevelDist.length];
    const riskScore= riskLevel==="High"?rand(65,98):riskLevel==="Medium"?rand(32,64):rand(5,31);
    const causes   = pick(CROP_CAUSES[riskLevel]);
    return {
      crop, riskLevel, riskScore,
      affectedArea: rand(5, 500),
      region: REGIONS[i % REGIONS.length],
      season: pick(SEASONS),
      causes,
      recommendation: pick(ADVISORIES),
      grower: growers[i % growers.length]?._id,
    };
  });
  const cropRisks = await CropRisk.insertMany(cropRisksData);
  console.log(`   ✔ ${cropRisks.length} crop risk records seeded`);

  // ── 9. WEATHER ALERTS (15) ─────────────────────────────────────────────────
  console.log("🌦   Seeding weather alerts…");
  // Build realistic hourly forecast arrays
  const buildHourly = (basePct) => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const d = new Date(); d.setHours(d.getHours() + i);
      return d.toISOString();
    });
    const pcts = Array.from({ length: 24 }, (_, i) =>
      Math.max(0, Math.min(100, basePct + rand(-20, 20) + (i > 10 && i < 18 ? rand(5, 25) : 0)))
    );
    return { time: hours, precipitation_probability: pcts };
  };
  const weatherAlertsData = Array.from({ length: 15 }, (_, i) => {
    const temp    = rand(18, 42);
    const pcp     = rand(10, 95);
    const desc    = WEATHER_DESCS[i % WEATHER_DESCS.length];
    const sev     = pcp > 70 ? "High" : pcp > 40 ? "Medium" : "Low";
    const region  = REGIONS[i % REGIONS.length];
    return {
      description: desc,
      location: region,
      region,
      temperature: temp,
      humidity: rand(35, 90),
      windSpeed: rand(5, 45),
      precipitation_probability: pcp,
      current_weather: { temperature: temp, weathercode: rand(0, 99), windspeed: rand(5, 45) },
      hourly: buildHourly(pcp),
      suggestion: WEATHER_SUGGESTIONS[i % WEATHER_SUGGESTIONS.length],
      severity: sev,
    };
  });
  const weatherAlerts = await WeatherAlert.insertMany(weatherAlertsData);
  console.log(`   ✔ ${weatherAlerts.length} weather alerts seeded`);

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  console.log("🎉  Seed complete! Summary:");
  console.log(`   👤  Users          : ${allUsers.length}`);
  console.log(`   🏪  Retailers      : ${retailers.length}`);
  console.log(`   🌾  Growers        : ${growers.length}`);
  console.log(`   📦  Products       : ${products.length}`);
  console.log(`   📋  Visits         : ${visits.length}`);
  console.log(`   ✅  Tasks          : ${tasks.length}`);
  console.log(`   💰  Revenue records: ${revenues.length}`);
  console.log(`   🌿  Crop risks     : ${cropRisks.length}`);
  console.log(`   🌦   Weather alerts : ${weatherAlerts.length}`);
  console.log("─".repeat(50));
  console.log("\n📝  Demo login credentials:");
  console.log("   Email   : amit@agroai.com");
  console.log("   Password: password123\n");

  await mongoose.disconnect();
  process.exit(0);
}

// ─── Duplicate key error handler ─────────────────────────────────────────────
function handleDup(err) {
  if (err.code === 11000) {
    // Partial insert succeeded — fetch what was inserted
    return { length: "some (skipped duplicates)" };
  }
  throw err;
}

seed().catch((err) => {
  console.error("\n❌  Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});