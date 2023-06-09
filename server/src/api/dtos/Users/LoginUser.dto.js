import { object, string, alternatives } from "../../utils/joiMethods.js";

const loginSchema = alternatives().try(
  object({
    email: string().email().max(50).required(),
    password: string().min(6).max(50).required(),
  }),
  object({
    username: string().min(3).max(50).required(),
    password: string().min(6).max(50).required(),
  })
);

export default loginSchema;
