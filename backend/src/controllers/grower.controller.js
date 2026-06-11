import Grower from "../models/Grower.js";

export const getGrowers = async (req, res) => {
    res.json(await Grower.find());
};

export const createGrower = async (req, res) => {
    const grower = await Grower.create(req.body);

    res.status(201).json(grower);
};

export const updateGrower = async (req, res) => {
    const grower = await Grower.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(grower);
};

export const deleteGrower = async (req, res) => {
    await Grower.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
    });
};
