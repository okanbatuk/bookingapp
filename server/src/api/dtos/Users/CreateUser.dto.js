import { object, string } from "../../utils/joiMethods.js";

const registerSchema = object({
  username: string().min(3).max(50).required(),
  email: string().email().max(50).required(),
  password: string().min(6).max(50).required(),
});

export default registerSchema;
