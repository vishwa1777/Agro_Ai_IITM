import Joi from "joi";

export const growerSchema =
  Joi.object({
    name: Joi.string()
      .required(),

    crop: Joi.string()
      .required(),

    landArea: Joi.number()
      .required(),

    location: Joi.string()
      .required()
  });