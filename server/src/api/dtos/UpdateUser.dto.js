import { object, string, alternatives } from "../utils/joiMethods.js";

const updateUserSchema = alternatives().try(
  object({
    email: string().email().max(50).required(),
    password: string().min(6).max(50).required(),
  }),
  object({
    username: string().min(3).max(50).required(),
    password: string().min(6).max(50).required(),
  }),
  object({
    email: string().email().max(50).required(),
    username: string().min(3).max(50).required(),
    password: string().min(6).max(50).required(),
  })
);

export default updateUserSchema;
