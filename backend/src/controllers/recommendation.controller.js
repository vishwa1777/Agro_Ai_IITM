import {
  generateRecommendations
} from "../services/recommendation.service.js";

export const getRecommendations =
  async (req, res) => {

    const recommendations =
      await generateRecommendations();

    res.json(
      recommendations
    );
  };