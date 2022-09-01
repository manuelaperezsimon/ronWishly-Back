import { Joi } from "express-validation";

export const registerValidation = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    repeatPassword: Joi.ref("password"),
  }),
};

export const loginValidation = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }),
};
