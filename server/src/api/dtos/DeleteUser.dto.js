import { object, string } from "../utils/joiMethods.js";

const deleteUserSchema = object({
  password: string().min(6).max(50).required(),
});

export default deleteUserSchema;
