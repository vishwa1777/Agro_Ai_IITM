import {
    revenueAnalytics,
    visitAnalytics,
    cropRiskAnalytics,
} from "../services/analytics.service.js";

export const getRevenue = async (req, res) => {
    const data = await revenueAnalytics();

    res.json(data);
};

export const getVisits = async (req, res) => {
    const data = await visitAnalytics();

    res.json(data);
};

export const getCropRisk = async (req, res) => {
    const data = await cropRiskAnalytics();

    res.json(data);
};
