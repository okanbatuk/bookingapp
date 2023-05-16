import { object, string } from "../utils/joiMethods.js";

const updatePasswdSchema = object({
  password: string().min(6).max(50).required(),
  newPassword: string().min(6).max(50).required(),
});

export default updatePasswdSchema;
