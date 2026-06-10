import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

import User from "../models/User.js";
import Grower from "../models/Grower.js";
import Retailer from "../models/Retailer.js";
import Product from "../models/Product.js";
import Task from "../models/Task.js";
import Visit from "../models/Visit.js";
import CropRisk from "../models/CropRisk.js";
import Revenue from "../models/Revenue.js";
import WeatherAlert from "../models/WeatherAlert.js";

const seedData = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}?appName=Cluster0`;
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding.");

    // Drop the entire database to clear old indexes
    await mongoose.connection.db.dropDatabase();
    console.log("Dropped the database to clear all collections and old indexes.");

    // Seed User (Field Agent)
    const agent = await User.create({
      name: "Amit Sharma",
      email: "amit.sharma@agroai.com",
      password: "password123", // Will be hashed by pre-save hook
      role: "field_agent",
      region: "Jhansi Region",
      phone: "+91 94123 45678"
    });
    console.log("Created user (Field Agent):", agent.name);

    // Seed Growers
    const growers = await Grower.create([
      { name: "Ramesh Kumar", landArea: 12, crop: "Wheat", cropStage: "Tillering", riskLevel: "High", phone: "+91 94123 45678", location: "Karguwan Village", advisory: "Apply Ridomil Gold for blight risk" },
      { name: "Suresh Patel", landArea: 8, crop: "Cotton", cropStage: "Flowering", riskLevel: "Medium", phone: "+91 94123 45679", location: "Sajnam Village", advisory: "Monitor whitefly population closely" },
      { name: "Mahesh Singh", landArea: 15, crop: "Rice", cropStage: "Nursery", riskLevel: "Low", phone: "+91 94123 45680", location: "Simra Village", advisory: "Irrigate crop within 2 days" },
      { name: "Dinesh Yadav", landArea: 5, crop: "Maize", cropStage: "Vegetative", riskLevel: "Low", phone: "+91 94123 45681", location: "Bijoli Village", advisory: "Weeding required in field" },
      { name: "Harish Chandra", landArea: 20, crop: "Wheat", cropStage: "Harvested", riskLevel: "Low", phone: "+91 94123 45682", location: "Pura Village", advisory: "Soil preparation advice for Kharif" }
    ]);
    console.log(`Seeded ${growers.length} Growers.`);

    // Seed Retailers
    const retailers = await Retailer.create([
      { name: "Ganga Agri Kendra", owner: "Rajesh Gupta", phone: "+91 98765 43210", location: "Patna Tahsil, Patna", status: "Active", stockLevel: "Low Stock", outstanding: 12500, totalSales: 185000, lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { name: "Kisan Seed Store", owner: "Suresh Patel", phone: "+91 98765 43211", location: "Jhansi Bypass, Jhansi", status: "Low Stock", stockLevel: "Critical", outstanding: 8000, totalSales: 152000, lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { name: "Mahavir Fertilizers", owner: "Mahendra Singh", phone: "+91 98765 43212", location: "Mauranipur, Jhansi", status: "Active", stockLevel: "Healthy", outstanding: 0, totalSales: 98000, lastVisit: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
      { name: "Ram Krishi Bhandar", owner: "Ram Kumar", phone: "+91 98765 43213", location: "Babina, Jhansi", status: "Inactive", stockLevel: "Healthy", outstanding: 4500, totalSales: 75000, lastVisit: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { name: "Balaji Seeds & Chemicals", owner: "Vijay Sharma", phone: "+91 98765 43214", location: "Gursarai, Jhansi", status: "Active", stockLevel: "Low Stock", outstanding: 15000, totalSales: 210000, lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ]);
    console.log(`Seeded ${retailers.length} Retailers.`);

    // Seed Products
    const products = await Product.create([
      { name: "Actara 25 WG", pack: "100g Pack", stock: 20, pct: 18, level: "Critical", demand: ["Pest outbreak in nearby villages", "High grower demand"], supply: ["Delayed distributor supply", "Low warehouse stock"], action: "Restock within 2 days" },
      { name: "Custodia", pack: "250ml Bottle", stock: 15, pct: 15, level: "Critical", demand: ["Increase in cereal area", "Seasonal demand rise"], supply: ["Supplier dispatch delay", "High recent sales"], action: "Restock within 2 days" },
      { name: "Ridomil Gold", pack: "250g Pack", stock: 45, pct: 45, level: "Low", demand: ["Monsoon disease risk", "Preventive applications"], supply: ["High recent sales", "Replenishment in transit"], action: "Restock within 5 days" },
      { name: "Tilt 250 EC", pack: "500ml Bottle", stock: 65, pct: 65, level: "Medium", demand: ["Weed pressure in crops", "Moderate demand"], supply: ["Stock moving normal", "Some pending orders"], action: "Monitor stock" },
      { name: "Movondo", pack: "250ml Bottle", stock: 90, pct: 90, level: "Healthy", demand: ["Steady demand", "Regular usage"], supply: ["Stock well available", "No supply issues"], action: "No action needed" }
    ]);
    console.log(`Seeded ${products.length} Products.`);

    // Seed Tasks
    const tasks = await Task.create([
      { assignedTo: agent._id, title: "Ramesh Kumar — Wheat crop inspection", type: "Visit", dueTime: new Date(), completed: false },
      { assignedTo: agent._id, title: "Suresh Patel — Pesticide recommendation", type: "Visit", dueTime: new Date(), completed: false },
      { assignedTo: agent._id, title: "Restock Actara 25 WG at Jhansi depot", type: "Stock", dueTime: new Date(), completed: false },
      { assignedTo: agent._id, title: "Mahesh Singh — Cotton disease follow-up", type: "Visit", dueTime: new Date(), completed: false },
      { assignedTo: agent._id, title: "Follow up on ₹18K pending order", type: "Revenue", dueTime: new Date(), completed: false }
    ]);
    console.log(`Seeded ${tasks.length} Tasks.`);

    // Seed CropRisks
    const cropRisks = await CropRisk.create([
      { crop: "Wheat", riskPercentage: 75, riskLevel: "High" },
      { crop: "Rice", riskPercentage: 45, riskLevel: "Medium" },
      { crop: "Pea", riskPercentage: 20, riskLevel: "Low" },
      { crop: "Cotton", riskPercentage: 60, riskLevel: "High" },
      { crop: "Maize", riskPercentage: 30, riskLevel: "Low" }
    ]);
    console.log(`Seeded ${cropRisks.length} Crop Risks.`);

    // Seed Revenues
    const revenues = await Revenue.create([
      { month: "Jan", year: 2024, revenue: 0.8 },
      { month: "Feb", year: 2024, revenue: 1.2 },
      { month: "Mar", year: 2024, revenue: 1.5 },
      { month: "Apr", year: 2024, revenue: 1.8 },
      { month: "May", year: 2024, revenue: 3.0 },
      { month: "Jun", year: 2024, revenue: 2.5 }
    ]);
    console.log(`Seeded ${revenues.length} Revenues.`);

    // Seed WeatherAlert
    const weatherAlert = await WeatherAlert.create({
      region: "Jhansi Region",
      alertType: "Rain",
      temperature: 28,
      probability: 80,
      description: "Heavy Rain Expected"
    });
    console.log("Seeded Weather Alert:", weatherAlert.description);

    // Seed Visits
    await Visit.create([
      { fieldAgent: agent._id, grower: growers[0]._id, status: "Planned", visitDate: new Date(), notes: "Initial visit for blight risk" },
      { fieldAgent: agent._id, retailer: retailers[0]._id, status: "Planned", visitDate: new Date(), notes: "Outstanding collection" }
    ]);
    console.log("Seeded initial Visits.");

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
