import Joi from "joi";

export const registerSchema =
  Joi.object({
    name: Joi.string()
      .required(),

    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
      .required(),

    role: Joi.string()
      .valid(
        "admin",
        "manager",
        "field_agent"
      )
  });