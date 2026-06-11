import Product from "../models/Product.js";
import CropRisk from "../models/CropRisk.js";

export const generateRecommendations = async () => {
    const recommendations = [];

    const lowStock = await Product.find({
        alertLevel: "Critical",
    });

    lowStock.forEach((p) => {
        recommendations.push({
            type: "inventory",
            priority: "high",
            message: `${p.name} requires replenishment`,
        });
    });

    const risks = await CropRisk.find({
        riskLevel: "High",
    });

    risks.forEach((r) => {
        recommendations.push({
            type: "crop",
            priority: "high",
            message: `${r.crop} risk level high`,
        });
    });

    return recommendations;
};
