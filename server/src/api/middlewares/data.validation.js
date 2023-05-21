import httpStatus from "http-status";
import { object } from "../utils/joiMethods.js";

// default value type is Joi.Schema.Object<any>
const _schema = object({});

// validate the data according to submitted schema
const dataValidation = (schema = _schema, data = {}, next) => {
  const { error } = schema.validate(data);

  if (error)
    return next({
      message: error.message,
      status: httpStatus.BAD_REQUEST,
    });

  next();
};

export default dataValidation;
