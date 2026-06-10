import Visit from "../models/Visit.js";

export const getVisits =
  async (req, res) => {

    const visits =
      await Visit.find()
        .populate(
          "fieldAgent"
        )
        .populate("retailer")
        .populate("grower");

    res.json(visits);
  };

export const createVisit =
  async (req, res) => {

    const visit =
      await Visit.create(
        req.body
      );

    res.status(201).json(
      visit
    );
  };