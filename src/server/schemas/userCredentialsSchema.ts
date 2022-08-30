import { Joi } from "express-validation";

const registerValidation = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    repeatPassword: Joi.ref("password"),
  }),
};

export default registerValidation;
