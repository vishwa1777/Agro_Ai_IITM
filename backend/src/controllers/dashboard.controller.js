import Retailer from "../models/Retailer.js";
import Product from "../models/Product.js";
import CropRisk from "../models/CropRisk.js";
import Revenue from "../models/Revenue.js";
import WeatherAlert from "../models/WeatherAlert.js";

export const getDashboard =
  async (req, res) => {

    const retailers =
      await Retailer.countDocuments();

    const criticalStocks =
      await Product.countDocuments({
        alertLevel: "Critical"
      });

    const highRisk =
      await CropRisk.countDocuments({
        riskLevel: "High"
      });

    const revenue =
      await Revenue.findOne()
        .sort({ createdAt: -1 });

    const weather =
      await WeatherAlert.findOne()
        .sort({ createdAt: -1 });

    res.json({
      retailers,
      criticalStocks,
      highRisk,
      revenue,
      weather
    });
  };