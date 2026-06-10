import express from "express";
import Grower from "../models/Grower.js";
import Retailer from "../models/Retailer.js";
import Product from "../models/Product.js";
import Task from "../models/Task.js";
import CropRisk from "../models/CropRisk.js";
import Revenue from "../models/Revenue.js";
import WeatherAlert from "../models/WeatherAlert.js";
import Visit from "../models/Visit.js";

const router = express.Router();

// Helper to handle async route errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. Get all Growers
router.get(
  "/growers",
  asyncHandler(async (req, res) => {
    const growers = await Grower.find({});
    res.json({ success: true, count: growers.length, data: growers });
  })
);

// 2. Get all Retailers
router.get(
  "/retailers",
  asyncHandler(async (req, res) => {
    const retailers = await Retailer.find({});
    res.json({ success: true, count: retailers.length, data: retailers });
  })
);

// 3. Get all Products (Stock levels)
router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json({ success: true, count: products.length, data: products });
  })
);

// 4. Get all Tasks
router.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({});
    res.json({ success: true, count: tasks.length, data: tasks });
  })
);

// 5. Toggle Task completion status
router.put(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, data: task });
  })
);

// 6. Get Crop Risks
router.get(
  "/croprisks",
  asyncHandler(async (req, res) => {
    const risks = await CropRisk.find({});
    res.json({ success: true, count: risks.length, data: risks });
  })
);

// 7. Get Monthly Revenues
router.get(
  "/revenues",
  asyncHandler(async (req, res) => {
    const revenues = await Revenue.find({}).sort({ year: 1, month: 1 });
    res.json({ success: true, count: revenues.length, data: revenues });
  })
);

// 8. Get Weather Alert
router.get(
  "/weather",
  asyncHandler(async (req, res) => {
    const weather = await WeatherAlert.findOne({});
    res.json({ success: true, data: weather });
  })
);

// 9. Save Visit Outcome (Feedback loop / outcome learning)
router.post(
  "/visits/outcome",
  asyncHandler(async (req, res) => {
    const { entityId, type, status, notes, orderDetails } = req.body;
    
    // Create visit record
    const visitData = {
      status: "Completed",
      notes: notes || "Visit completed successfully",
      visitDate: new Date()
    };

    if (type === "Grower") {
      visitData.grower = entityId;
      await Grower.findByIdAndUpdate(entityId, { lastContact: "Today" });
    } else {
      visitData.retailer = entityId;
      await Retailer.findByIdAndUpdate(entityId, { lastVisit: new Date() });
    }

    const visit = await Visit.create(visitData);

    // If order details exist, update retailer balance and sales
    if (orderDetails && type === "Retailer") {
      const { amount, productName, quantity } = orderDetails;
      if (amount) {
        await Retailer.findByIdAndUpdate(entityId, {
          $inc: { outstanding: amount, totalSales: amount }
        });
      }

      // If product name and quantity are provided, decrement stock level
      if (productName && quantity) {
        const product = await Product.findOne({ name: productName });
        if (product) {
          product.stock = Math.max(0, product.stock - quantity);
          product.pct = Math.round((product.stock / 100) * 100); // assume max capacity is 100
          if (product.stock <= 20) product.level = "Critical";
          else if (product.stock <= 40) product.level = "Low";
          else if (product.stock <= 70) product.level = "Medium";
          else product.level = "Healthy";
          await product.save();
        }
      }
    }

    res.json({ success: true, data: visit, message: "Visit outcome registered and inventory updated!" });
  })
);

// 10. Generate Real-time AI Advisory (Gemini API Integration)
router.post(
  "/advisory/generate",
  asyncHandler(async (req, res) => {
    const { growerId } = req.body;
    const grower = await Grower.findById(growerId);
    if (!grower) {
      return res.status(404).json({ success: false, message: "Grower not found" });
    }

    // Default static fallback if Gemini API Key is missing
    let advisoryText = `Maintain regular monitoring. Apply Ridomil Gold (150g/acre) if humidity levels rise past 70% to protect the ${grower.crop} crop.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        console.log("Calling Gemini API for grower advisory...");
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Act as a senior Syngenta Agronomist. A grower named ${grower.name} in ${grower.location} has ${grower.landArea} acres of ${grower.crop} at '${grower.cropStage}' stage. Current crop risk level is ${grower.riskLevel}. Recommend the best Syngenta product (like Actara 25 WG, Custodia, Ridomil Gold, Tilt 250 EC, Movondo) to use, specify exact dosage, and explain the biological reason. Keep it professional, highly relevant, and under 100 words.`
                    }
                  ]
                }
              ]
            })
          }
        );

        const result = await response.json();
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          advisoryText = result.candidates[0].content.parts[0].text.trim();
          
          // Save to grower advisory in DB
          grower.advisory = advisoryText;
          await grower.save();
        } else {
          console.error("Gemini response did not contain expected content format:", JSON.stringify(result));
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
      }
    } else {
      console.log("GEMINI_API_KEY missing, using rules-based fallback advisory.");
    }

    res.json({ success: true, advisory: advisoryText, grower });
  })
);

export default router;
