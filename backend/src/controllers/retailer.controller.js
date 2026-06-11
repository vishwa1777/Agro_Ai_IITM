import Retailer from "../models/Retailer.js";

export const getRetailers = async (req, res) => {
    const retailers = await Retailer.find();

    res.json(retailers);
};

export const getRetailer = async (req, res) => {
    const retailer = await Retailer.findById(req.params.id);

    res.json(retailer);
};

export const createRetailer = async (req, res) => {
    const retailer = await Retailer.create(req.body);

    res.status(201).json(retailer);
};

export const updateRetailer = async (req, res) => {
    const retailer = await Retailer.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(retailer);
};

export const deleteRetailer = async (req, res) => {
    await Retailer.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
    });
};
