import httpStatus from "http-status";
import { loginSchema, registerSchema } from "../utils/auth.validations.js";

const registerVal = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error)
    return next({
      message:
        error.message /* "Validation error found for your submitted values.." */,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

const loginVal = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error)
    return next({
      message:
        error.message /* "Validation error found for your submitted values.." */,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

export { registerVal, loginVal };
