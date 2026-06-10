import Joi from "joi";

export const retailerSchema =
  Joi.object({
    name: Joi.string()
      .required(),

    owner: Joi.string()
      .required(),

    phone: Joi.string(),

    location: Joi.string()
      .required()
  });