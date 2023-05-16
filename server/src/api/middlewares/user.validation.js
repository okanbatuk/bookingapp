import httpStatus from "http-status";
import UpdateUserSchema from "../dtos/UpdateUser.dto.js";
import IdParamSchema from "../dtos/IdParam.dto.js";
import UpdatePasswdSchema from "../dtos/UpdatePasswd.dto.js";
import DeleteUserSchema from "../dtos/DeleteUser.dto.js";

const paramValidation = (req, res, next) => {
  const { error } = IdParamSchema.validate(req.params);

  if (error)
    return next({
      message: error.message,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

const updateUserValidation = (req, res, next) => {
  const { error } = UpdateUserSchema.validate(req.body);

  if (error)
    return next({
      message: error.message,
      status: httpStatus.BAD_REQUEST,
    });

  req.password = req.body.password;
  delete req.body.password;
  next();
};

const updatePasswordValidation = (req, res, next) => {
  const { error } = UpdatePasswdSchema.validate(req.body);

  if (error)
    return next({
      message: error.message,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

const deleteUserValidation = (req, res, next) => {
  const { error } = DeleteUserSchema.validate(req.body);

  if (error)
    return next({
      message: error.message,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

export {
  paramValidation,
  updateUserValidation,
  updatePasswordValidation,
  deleteUserValidation,
};
