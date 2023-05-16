import httpStatus from "http-status";
import CreateUserSchema from "../dtos/CreateUser.dto.js";
import LoginUserSchema from "../dtos/LoginUser.dto.js";

const registerVal = (req, res, next) => {
  const { error } = CreateUserSchema.validate(req.body);

  if (error)
    return next({
      message:
        error.message /* "Validation error found for your submitted values.." */,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

const loginVal = (req, res, next) => {
  const { error } = LoginUserSchema.validate(req.body);

  if (error)
    return next({
      message:
        error.message /* "Validation error found for your submitted values.." */,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

export { registerVal, loginVal };
