import Revenue from "../models/Revenue.js";
import Visit from "../models/Visit.js";
import CropRisk from "../models/CropRisk.js";

export const revenueAnalytics = async () => {
    return Revenue.find().sort({ year: 1 });
};

export const visitAnalytics = async () => {
    return Visit.aggregate([
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);
};

export const cropRiskAnalytics = async () => {
    return CropRisk.aggregate([
        {
            $group: {
                _id: "$riskLevel",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);
};
