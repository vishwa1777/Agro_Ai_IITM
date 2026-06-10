import dotenv from "dotenv";
dotenv.config();


import connectDB from "../config/db.js";

import User from "../models/User.js";
import Retailer from "../models/Retailer.js";
import Grower from "../models/Grower.js";
import Product from "../models/Product.js";
import CropRisk from "../models/CropRisk.js";
import Revenue from "../models/Revenue.js";

await connectDB();

await User.deleteMany();
await Retailer.deleteMany();
await Grower.deleteMany();
await Product.deleteMany();
await CropRisk.deleteMany();
await Revenue.deleteMany();

await User.create({
  name: "Admin",
  email: "admin@agroai.com",
  password: "123456",
  role: "admin"
});

await User.create({
  name: "Manager",
  email: "manager@agroai.com",
  password: "123456",
  role: "manager"
});

await User.create({
  name: "Agent",
  email: "agent@agroai.com",
  password: "123456",
  role: "field_agent"
});

await Retailer.insertMany([
  {
    name: "Ganga Agri Center",
    owner: "Rajesh Kumar",
    location: "Patna"
  },
  {
    name: "Kisan Seeds",
    owner: "Amit Singh",
    location: "Jhansi"
  }
]);

await Grower.insertMany([
  {
    name: "Ramesh",
    crop: "Wheat",
    landArea: 15,
    location: "Patna",
    riskLevel: "High"
  }
]);

await Product.insertMany([
  {
    name: "Actara 25 WG",
    stock: 10,
    stockPercentage: 12,
    alertLevel: "Critical"
  },
  {
    name: "Custodia",
    stock: 50,
    stockPercentage: 65,
    alertLevel: "Healthy"
  }
]);

await CropRisk.insertMany([
  {
    crop: "Wheat",
    riskPercentage: 78,
    riskLevel: "High"
  }
]);

await Revenue.insertMany([
  {
    month: "January",
    year: 2026,
    revenue: 120000
  },
  {
    month: "February",
    year: 2026,
    revenue: 180000
  }
]);

console.log("Seed Completed");
process.exit();